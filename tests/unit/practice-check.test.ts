import { beforeEach, describe, expect, it } from "vitest";
import {
  countCorrect,
  getChecks,
  parseChecks,
  setCheck,
  totalCorrect,
} from "../../src/lib/practice-check";

const KEY = "ts-py-practice-checks";

describe("主动练习自检", () => {
  beforeEach(() => localStorage.clear());

  it("parseChecks 只收合法键与 correct 值", () => {
    expect(parseChecks({ "a#0": "correct", "a#1": "review", "a#2": 1, "": "correct" })).toEqual({
      "a#0": "correct",
    });
  });

  it("非对象输入返回 null", () => {
    expect(parseChecks(null)).toBeNull();
    expect(parseChecks([])).toBeNull();
    expect(parseChecks("x")).toBeNull();
  });

  it("setCheck 写入、撤销、并派发事件", () => {
    let events = 0;
    window.addEventListener("practice-check-updated", () => events++);
    setCheck("/paths/a/#0", "correct");
    expect(getChecks()).toEqual({ "/paths/a/#0": "correct" });
    setCheck("/paths/a/#1", "correct");
    setCheck("/paths/a/#0", null);
    expect(getChecks()).toEqual({ "/paths/a/#1": "correct" });
    expect(events).toBe(3);
  });

  it("本地存储损坏时降级为空，不抛错", () => {
    localStorage.setItem(KEY, "{broken");
    expect(getChecks()).toEqual({});
  });

  it("countCorrect 只数当前页，totalCorrect 数全站", () => {
    setCheck("/paths/a/#0", "correct");
    setCheck("/paths/a/#1", "correct");
    setCheck("/paths/b/#0", "correct");
    const checks = getChecks();
    expect(countCorrect(checks, "/paths/a/")).toBe(2);
    expect(countCorrect(checks, "/paths/b/")).toBe(1);
    expect(totalCorrect(checks)).toBe(3);
  });
});
