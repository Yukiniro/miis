import { describe } from "vitest";
import { test, expect } from "vitest";
import miis from "../src";

describe("basic useage", () => {
  test("subscribe", async () => {
    await new Promise((resolve) => {
      miis.subscribe("a", resolve);
      miis.dispatch("a");
    });
  });

  test("unsubscribe", async () => {
    await new Promise((resolve, reject) => {
      const unsubscribe = miis.subscribe("b", reject);
      unsubscribe();
      miis.dispatch("b");
      setTimeout(resolve, 10);
    });
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
