import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import { QUIZZES } from "../../src/data/quizzes";

const python = process.env.PYTHON ?? (process.platform === "win32" ? "python" : "python3");

function runPython(code: string, input?: string): string {
  return execFileSync(python, ["-X", "utf8", "-c", code], {
    input,
    encoding: "utf8",
    timeout: 10_000,
  }).trim();
}

function compileErrors(code: string): string[] {
  const file = resolve("__content_example__.ts");
  const options: ts.CompilerOptions = {
    strict: true,
    noEmit: true,
    skipLibCheck: true,
    target: ts.ScriptTarget.ES2022,
    module: ts.ModuleKind.NodeNext,
    moduleResolution: ts.ModuleResolutionKind.NodeNext,
  };
  const host = ts.createCompilerHost(options);
  const getSourceFile = host.getSourceFile.bind(host);
  host.getSourceFile = (name, version, ...rest) =>
    resolve(name) === file
      ? ts.createSourceFile(name, code, version, true)
      : getSourceFile(name, version, ...rest);
  return ts
    .getPreEmitDiagnostics(ts.createProgram([file], options, host))
    .map((diagnostic) => ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
}

describe("题库与课程的可执行示例", { timeout: 30_000 }, () => {
  it("联合类型正确选项可以接受数字和字符串", () => {
    const answer = QUIZZES.types[2].options.find((option) => option.correct)!.text;
    expect(
      compileErrors(`export type Value = ${answer}; const n: Value = 1; const s: Value = 'ok';`)
    ).toEqual([]);
  });

  it("模块测验和课程中的路径函数导入可通过类型检查", () => {
    const answer = QUIZZES.modules[1].options.find((option) => option.correct)!.text;
    const lesson = readFileSync("src/content/docs/paths/migration/modules.mdx", "utf8");
    const imports = [...lesson.matchAll(/`(import \{ join \} from '[^']+')`/g)].map(
      (match) => match[1]
    );
    expect(imports.length).toBeGreaterThan(0);
    for (const statement of [answer, ...imports]) {
      expect(compileErrors(`${statement}; const path: string = join('a', 'b');`)).toEqual([]);
    }
  });

  it.each(QUIZZES.prediction)("预测题实际输出与正确选项一致：$question", (question) => {
    const outputs: { language: string; output: string }[] = [];
    if (question.codeSnippets?.python) {
      outputs.push({
        language: "Python",
        output: runPython(question.codeSnippets.python).split(/\r?\n/).join(", "),
      });
    }
    if (question.codeSnippets?.typescript) {
      const code = question.codeSnippets.typescript;
      expect(compileErrors(code)).toEqual([]);
      const lines: string[] = [];
      const compiled = ts.transpileModule(code, {
        compilerOptions: { target: ts.ScriptTarget.ES2022 },
      }).outputText;
      runInNewContext(
        compiled,
        { console: { log: (...values: unknown[]) => lines.push(values.map(String).join(" ")) } },
        { timeout: 1000 }
      );
      outputs.push({ language: "TypeScript", output: lines.join(", ") });
    }
    const expected =
      outputs.length === 1
        ? outputs[0].output
        : outputs.map(({ language, output }) => `${language}: ${output}`).join("; ");
    expect(question.options.find((option) => option.correct)?.expected).toBe(expected);
  });

  it("课程中的所有 Python retry 示例均返回可调用函数，且按约定重试与抛错", () => {
    const content = readFileSync("src/content/docs/paths/advanced/decorators.mdx", "utf8");
    const snippets = [...content.matchAll(/```python\r?\n([\s\S]*?)```/g)].map((match) => match[1]);
    const output = runPython(
      `
import ast, functools, json, sys
from typing import Callable, Any
checked = 0
for snippet in json.load(sys.stdin):
    for node in ast.parse(snippet).body:
        if not isinstance(node, ast.FunctionDef) or node.name != "retry":
            continue
        namespace = {"Callable": Callable, "Any": Any, "functools": functools}
        exec(compile(ast.Module(body=[node], type_ignores=[]), "course", "exec"), namespace)
        retry = namespace["retry"]
        assert retry(3)(lambda: "ok")() == "ok"
        calls = []
        def flaky():
            calls.append(1)
            if len(calls) < 3:
                raise ValueError("retry")
            return "ok"
        assert retry(3)(flaky)() == "ok"
        assert len(calls) == 3
        calls.clear()
        def failing():
            calls.append(1)
            raise ValueError("failure")
        try:
            retry(2)(failing)()
            raise AssertionError("exception swallowed")
        except ValueError:
            assert len(calls) == 2
        checked += 1
assert checked == 2
print("validated retry examples: 2")
`,
      JSON.stringify(snippets)
    );
    expect(output).toContain("validated retry examples: 2");
  });
});
