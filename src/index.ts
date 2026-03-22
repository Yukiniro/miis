type Listener = (...args: unknown[]) => void;
type EventName = string | symbol;
type Options = {
    once?: boolean;
    scope?: string;
};
type Subscriber = {
    listener: Listener;
    once?: boolean;
    scope: string;
};

const ALL_WILD_KEY = '*';
const handlerMap = new Map<EventName, Subscriber[]>();
let curScope = 'default';

function removeItem<T>(arr: T[], item: T): void {
    const idx = arr.indexOf(item);
    if (idx > -1) {
        arr.splice(idx, 1);
    }
}

function isUndefined(value: unknown): value is undefined {
    return value === undefined;
}

function subscribe(
    key: EventName,
    listener: Listener,
    options?: Options,
): () => void {
    if (!handlerMap.has(key)) {
        handlerMap.set(key, []);
    }
    const list = handlerMap.get(key)!;
    const { once, scope } = options || {};
    const item: Subscriber = {
        listener,
        once,
        scope: isUndefined(scope) ? 'default' : scope,
    };
    list.push(item);
    return () => {
        removeItem(list, item);
    };
}

function dispatch(key: EventName, ...args: unknown[]): void {
    const trigger = (list: Subscriber[]) => {
        const removeList: Subscriber[] = [];
        list.filter((item) => item.scope === curScope).forEach(
            (item: Subscriber) => {
                const { listener, once } = item;
                listener(...args);
                if (once) {
                    removeList.push(item);
                }
            },
        );
        removeList.forEach((item: Subscriber) => removeItem(list, item));
    };
    if (handlerMap.has(key)) {
        trigger(handlerMap.get(key)!);
    }
    if (key !== ALL_WILD_KEY && handlerMap.has(ALL_WILD_KEY)) {
        trigger(handlerMap.get(ALL_WILD_KEY)!);
    }
}

function clear(key?: EventName): void {
    if (isUndefined(key)) {
        handlerMap.clear();
    } else {
        handlerMap.delete(key);
    }
}

function setScope(scope: string): void {
    curScope = scope;
}

function getScope(): string {
    return curScope;
}

function resetScope(): void {
    curScope = 'default';
}

export { subscribe, dispatch, setScope, getScope, resetScope, clear };

export default {
    subscribe,
    dispatch,
    setScope,
    getScope,
    resetScope,
    clear,
};
