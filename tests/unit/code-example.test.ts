import { describe, it, expect } from "vitest";
import { normalizeDualCodeInput } from "../../src/lib/code-example";

describe("normalizeDualCodeInput", () => {
  it("requires both python and typescript blocks", () => {
    expect(() =>
      normalizeDualCodeInput({
        python: "print('ok')",
        typescript: "",
      })
    ).toThrow(/typescript/i);
  });
});