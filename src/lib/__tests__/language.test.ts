import { describe, expect, it } from "vitest";
import { languageFamily } from "../language";

describe("languageFamily", () => {
  it("groups compiler variants into one family", () => {
    expect(languageFamily("GNU C++17 (64)")).toBe("cpp");
    expect(languageFamily("GNU C++20 (64)")).toBe("cpp");
    expect(languageFamily("Clang++20 Diagnostics")).toBe("cpp");
    expect(languageFamily("C++")).toBe("cpp");
  });

  it("tells C apart from C++ and C#", () => {
    expect(languageFamily("GNU C11")).toBe("c");
    expect(languageFamily("C")).toBe("c");
    expect(languageFamily("C# 10")).toBe("csharp");
    expect(languageFamily("Mono C#")).toBe("csharp");
  });

  it("does not mistake JavaScript for Java", () => {
    expect(languageFamily("JavaScript V8 4.8.0")).toBe("javascript");
    expect(languageFamily("Node.js 15")).toBe("javascript");
    expect(languageFamily("Java 21")).toBe("java");
  });

  it("handles python, go and unknown labels", () => {
    expect(languageFamily("PyPy 3-64")).toBe("python");
    expect(languageFamily("Python 3")).toBe("python");
    expect(languageFamily("Go 1.22")).toBe("go");
    expect(languageFamily("Unknown language")).toBe("unknown");
    expect(languageFamily("")).toBe("unknown");
  });
});
