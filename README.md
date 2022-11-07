# miis

![NPM](https://img.shields.io/npm/l/miis?color=blue&style=flat-square) ![npm](https://img.shields.io/npm/v/miis?color=blue&style=flat-square)

> The `miis` is a tiny functional event subscriber and dispatcher.

## Features

- **Tiny**. weighs less than 1kb gzipped
- **Plentiful**: a special "\*" event type listens to all events

## Install

This project need node and npm.

```shell
npm install miis --save
```

or

```shell
pnpm add miis --save
```

## Useage

```javascript
import miis from "miis";

miis.subscribe("a", (...args) => {
  console.log("a event call"); // a event call
  console.log(...args); /// 1, 2, 3
});
miis.dispatch("a", 1, 2, 3);
```

And it's so easy to operate with react. Here is a [demo](https://stackblitz.com/edit/react-ts-ucliuq?file=App.tsx).

```jsx
import * as React from "react";
import "./style.css";
import miis from "miis";

export default function App() {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    return miis.subscribe("a", () => {
      setCount(count + 1);
    });
  }, [count]);

  const handleClick = () => {
    miis.dispatch("a");
  };

  return (
    <div>
      <button onClick={handleClick}>Dispatch A</button>
      <p>Count: {count}</p>
    </div>
  );
}
```

You could unsubscribe the event lisenter with the result of subscribe.

```javascript
import miis from "miis";

const unsubscribe = miis.subscribe("a", () => {
  console.log("a event call");
});
unsubscribe();

miis.dispatch("a"); // not work
```

## API

### subscirbe

Register an event listenter for the given name.

#### Params

- `eventName` **string | symbol** Name of event to listen for.(_`*`_ for all events)
- `listenter` **Function** Function to call in response to given event
- `options` **undefined | Object** Some options. _optional_
  - `once` **boolean** Only call once if it is `true`.

#### Returns

- `unsubscribe` **Function** Function to remove the listenter.

### dispatch

Invoke all handlers for the given name.

#### Params

- `eventName` **string | symbol** Name of event to invoke for.

### clear

Clears the specified listeners. It will clear all listeners if the parameter is undefined.

#### Params

- `eventName` **string | symbol | undefiend** Name of event to listen for.(_undefined_ for all events)
