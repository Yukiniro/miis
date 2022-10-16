import { remove } from "bittydash";

type Listener = (...args: any[]) => void;
type EventName = string | symbol;
type Options = {
  once: boolean;
};
type Subscriber = {
  listener: Listener;
  once: boolean;
};

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
  const list = handlerMap.get(key) || [];
  const removeList = [];
  list.forEach((item: Subscriber) => {
    const { listener, once } = item;
    listener(...args);
    if (once) {
      removeList.push(item);
    }
  });
  removeList.forEach((item: Subscriber) => remove(list, item));
}

export default {
  subscribe,
  dispatch,
};
