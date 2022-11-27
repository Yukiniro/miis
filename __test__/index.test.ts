import { afterEach, describe } from "vitest";
import { test, expect } from "vitest";
import miis from "../src";

afterEach(() => {
  miis.clear();
});

describe("basic useage", () => {
  test("subscribe", () => {
    let count = 0;
    miis.subscribe("a", () => count++);
    miis.dispatch("a");
    miis.dispatch("a");
    expect(count).toBe(2);
  });

  test("unsubscribe", async () => {
    await new Promise((resolve, reject) => {
      const unsubscribe = miis.subscribe("b", reject);
      unsubscribe();
      miis.dispatch("b");
      setTimeout(resolve, 10);
    });
  });

  test("clear", async () => {
    await new Promise((resolve, reject) => {
      miis.subscribe("a", reject);
      miis.clear();
      miis.dispatch("a");
      setTimeout(resolve, 10);
    });

    await new Promise((resolve, reject) => {
      miis.subscribe("a", reject);
      miis.clear("a");
      miis.dispatch("a");
      setTimeout(resolve, 10);
    });
  });

  test("once", async () => {
    let tag = 0;
    await new Promise((resolve) => {
      miis.subscribe(
        "a",
        (value) => {
          tag++;
          resolve(value);
        },
        { once: true }
      );
      miis.dispatch("a");
    });
    miis.dispatch("a");
    expect(tag).toBe(1);
  });
});

describe("arguments", () => {
  test("single", async () => {
    const result = await new Promise((resolve) => {
      miis.subscribe("b", resolve);
      miis.dispatch("b", 1);
    });
    expect(result).toBe(1);
  });

  test("multi", async () => {
    const result = await new Promise((resolve) => {
      miis.subscribe("b", (...args) => {
        resolve(Array.from(args));
      });
      miis.dispatch("b", 2, 3, 4);
    });
    expect(result).toEqual([2, 3, 4]);
  });
});

describe("*", () => {
  test("subscribe", () => {
    let count = 0;
    miis.subscribe("a", () => count++);
    miis.subscribe("*", () => count++);
    miis.dispatch("a");
    expect(count).toBe(2);
  });
});

test("scope", () => {
  let count = 0;
  miis.subscribe("Event A", () => count++, { scope: "Scope A" });
  miis.subscribe("Event B", () => count++);
  miis.dispatch("Event A");
  expect(count).toBe(0);
  miis.setScope("Scope A");
  expect(miis.getScope()).toBe("Scope A");
  miis.dispatch("Event A");
  expect(count).toBe(1);
  miis.dispatch("Event B");
  expect(count).toBe(1);
  miis.resetScope();
  miis.dispatch("Event B");
  expect(count).toBe(2);
});
