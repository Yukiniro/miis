# miis

![NPM](https://img.shields.io/npm/l/miis?color=blue&style=flat-square) ![npm](https://img.shields.io/npm/v/miis?color=blue&style=flat-square)

> The `miis` is a tiny functional event subscriber and dispatcher.

## Features

- __Tiny__.  weighs less than 1kb gzipped
- __Plentiful__: a special "*" event type listens to all events

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
import miis from 'miis';

miis.subscribe("a", (...args) => {
  console.log('a event call'); // a event call
  console.log(...args); /// 1, 2, 3
});
miis.dispatch("a", 1, 2, 3);
```

You could unsubscribe the event lisenter with the result of subscribe.

```javascript
import miis from 'miis';

const unsubscribe = miis.subscribe("a", () => {
  console.log('a event call');
});
unsubscribe();

miis.dispatch("a"); // not work
```

## API

### subscirbe

Register an event listenter for the given name.

#### Params

- `eventName` __string | symbol__ Name of event to listen for.(_`*`_ for all events)
- `listenter` __Function__ Function to call in response to given event

#### Returns

- `unsubscribe` __Function__ Function to remove the listenter.

### dispatch

Invoke all handlers for the given name.

- `eventName` __string | symbol__ Name of event to invoke for.

### clear

Clears the specified listeners. It will clear all listeners if the parameter is undefined.

#### Params
- `eventName` __string | symbol | undefiend__ Name of event to listen for.(_undefined_ for all events)