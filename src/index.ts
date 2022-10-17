import { remove, isUndefined } from "bittydash";

type Listener = (...args: any[]) => void;
type EventName = string | symbol;
type Options = {
  once: boolean;
};
type Subscriber = {
  listener: Listener;
  once: boolean;
};

const ALL_WILD_KEY = "*";
const handlerMap = new Map();

function subscribe(
  key: EventName,
  listener: Listener,
  options?: Options
): () => void {
  if (!handlerMap.has(key)) {
    handlerMap.set(key, []);
  }
  const list = handlerMap.get(key);
  const { once } = options || {};
  const item = { listener, once };
  list.push(item);
  return () => {
    remove(list, item);
  };
}

function dispatch(key: EventName, ...args: any[]) {
  const trigger = (list: Subscriber[]) => {
    const removeList = [];
    list.forEach((item: Subscriber) => {
      const { listener, once } = item;
      listener(...args);
      if (once) {
        removeList.push(item);
      }
    });
    removeList.forEach((item: Subscriber) => remove(list, item));
  };
  if (handlerMap.has(key)) {
    trigger(handlerMap.get(key));
  }
  if (key !== ALL_WILD_KEY && handlerMap.has(ALL_WILD_KEY)) {
    trigger(handlerMap.get(ALL_WILD_KEY));
  }
}

function clear(key?: EventName) {
  if (isUndefined(key)) {
    handlerMap.clear();
  } else {
    handlerMap.delete(key);
  }
}

export default {
  subscribe,
  dispatch,
  clear,
};
