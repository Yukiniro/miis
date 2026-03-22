import { afterEach, describe, beforeEach } from 'vitest';
import { test, expect } from 'vitest';
import miis from '../src';

afterEach(() => {
    miis.clear();
    miis.resetScope();
});

describe('basic usage', () => {
    test('subscribe', () => {
        let result = '';
        miis.subscribe('a', (...args) => {
            result = args.join(',');
        });
        miis.dispatch('a', 1, 2, 3);
        expect(result).toBe('1,2,3');
    });

    test('dispatch with no listener', () => {
        expect(() => miis.dispatch('nonexistent')).not.toThrow();
    });

    test('dispatch with multiple listeners', () => {
        let count = 0;
        miis.subscribe('a', () => count++);
        miis.subscribe('a', () => count++);
        miis.dispatch('a');
        expect(count).toBe(2);
    });
});

describe('unsubscribe', () => {
    test('unsubscribe', () => {
        let count = 0;
        const unsubscribe = miis.subscribe('a', () => {
            count++;
        });
        unsubscribe();
        miis.dispatch('a');
        expect(count).toBe(0);
    });

    test('unsubscribe twice should be safe', () => {
        const unsubscribe = miis.subscribe('a', () => {});
        unsubscribe();
        expect(() => unsubscribe()).not.toThrow();
    });
});

describe('once', () => {
    test('once', () => {
        let count = 0;
        miis.subscribe(
            'a',
            () => {
                count++;
            },
            { once: true },
        );
        miis.dispatch('a');
        miis.dispatch('a');
        expect(count).toBe(1);
    });
});

describe('wildcard', () => {
    test('wildcard listens to all events', () => {
        let count = 0;
        miis.subscribe('*', () => {
            count++;
        });
        miis.dispatch('a');
        miis.dispatch('b');
        expect(count).toBe(2);
    });

    test('wildcard should not trigger on itself', () => {
        let count = 0;
        miis.subscribe('*', () => count++);
        miis.dispatch('*');
        expect(count).toBe(1);
    });
});

describe('scope', () => {
    beforeEach(() => {
        miis.resetScope();
    });

    test('setScope', () => {
        miis.setScope('test');
        expect(miis.getScope()).toBe('test');
    });

    test('getScope default', () => {
        expect(miis.getScope()).toBe('default');
    });

    test('resetScope', () => {
        miis.setScope('test');
        miis.resetScope();
        expect(miis.getScope()).toBe('default');
    });

    test('dispatch with different scope', () => {
        let count = 0;

        miis.subscribe('a', () => count++);
        miis.setScope('test');
        miis.dispatch('a');
        expect(count).toBe(0);

        miis.resetScope();
        miis.dispatch('a');
        expect(count).toBe(1);
    });
});

describe('clear', () => {
    test('clear specific event', () => {
        let count = 0;
        miis.subscribe('a', () => count++);
        miis.subscribe('b', () => count++);
        miis.clear('a');
        miis.dispatch('a');
        miis.dispatch('b');
        expect(count).toBe(1);
    });

    test('clear all events', () => {
        let count = 0;
        miis.subscribe('a', () => count++);
        miis.subscribe('b', () => count++);
        miis.clear();
        miis.dispatch('a');
        miis.dispatch('b');
        expect(count).toBe(0);
    });
});

describe('symbol event', () => {
    test('symbol as event name', () => {
        const sym = Symbol('test');
        let called = false;
        miis.subscribe(sym, () => (called = true));
        miis.dispatch(sym);
        expect(called).toBe(true);
    });
});
