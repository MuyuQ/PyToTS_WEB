import { describe, expect, it } from "vitest";
import { docRoute, docSlug } from "../../src/lib/doc-id";

describe("docSlug：entry.id → 路由 slug", () => {
  it("剥离扩展名", () => {
    expect(docSlug("paths/migration/types.mdx")).toBe("paths/migration/types");
    expect(docSlug("algorithms/two-sum.md")).toBe("algorithms/two-sum");
  });

  it("index 页归一到其目录", () => {
    expect(docSlug("paths/foundation/index.mdx")).toBe("paths/foundation");
    expect(docSlug("algorithms/index.mdx")).toBe("algorithms");
  });

  it("无扩展名输入原样归一", () => {
    expect(docSlug("paths/preparation/setup")).toBe("paths/preparation/setup");
  });
});

describe("docRoute：entry.id → 站内路由", () => {
  it("普通页带尾斜杠", () => {
    expect(docRoute("paths/migration/types.mdx")).toBe("/paths/migration/types/");
  });

  it("根 index 归一为站点根", () => {
    expect(docRoute("index.mdx")).toBe("/");
  });
});
