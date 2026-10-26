/**
 * Collapses a Codeforces language label such as "GNU C++17 (64)" or
 * "PyPy 3-64" into a coarse family so submissions written in the same
 * language can be compared even when the compiler version differs.
 */
export function languageFamily(language: string) {
  const value = language.toLowerCase().trim();
  if (!value) return "unknown";
  if (value.includes("c++") || value.includes("gcc") || value.includes("clang")) return "cpp";
  if (value.includes("c#") || value.includes("mono") || value.includes(".net")) return "csharp";
  if (/\bc(?:\d{2})?\b/.test(value)) return "c";
  if (value.includes("python") || value.includes("pypy")) return "python";
  if (value.includes("javascript") || value.includes("node")) return "javascript";
  if (value.includes("java")) return "java";
  if (value.includes("kotlin")) return "kotlin";
  if (value.includes("rust")) return "rust";
  if (/\bgo\b|golang/.test(value)) return "go";
  return value.split(/\s+/)[0] || "unknown";
}
