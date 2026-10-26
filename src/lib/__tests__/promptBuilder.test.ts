import { describe, expect, it } from "vitest";
import { extractLogicFingerprint, extractStyleFingerprint } from "../fingerprint";
import { buildDebugPrompt } from "../promptBuilder";
import type { FailedSubmission, MatchedSubmission, ProblemStatement } from "../types";

const failed: FailedSubmission = {
  url: "https://codeforces.com/contest/4/submission/99",
  contestId: "4",
  problemIndex: "A",
  submissionId: "99",
  verdict: "Wrong answer on test 2",
  language: "GNU C++17",
  code: "int main(){int w;cin>>w;cout<<(w%2==0?\"YES\":\"NO\");}",
};

const problem: ProblemStatement = {
  title: "A. Watermelon",
  statement: "Split the watermelon into two even parts.",
  inputFormat: "One integer w.",
  outputFormat: "YES or NO.",
  examples: ["8", "YES"],
  notes: "",
  rawText: "Split the watermelon into two even parts.",
  url: "https://codeforces.com/problemset/problem/4/A",
};

function match(code: string): MatchedSubmission {
  return {
    submissionId: "5",
    userHandle: "tourist",
    language: "GNU C++17",
    code,
    codeLength: code.length,
    sourceUrl: "https://codeforces.com/contest/4/submission/5",
    logicFingerprint: extractLogicFingerprint(code),
    styleFingerprint: extractStyleFingerprint(code, "GNU C++17"),
    totalScore: 0.7,
    logicalScore: 0.8,
    tokenScore: 0.6,
    styleScore: 0.5,
    reason: "Shares modular/digit logic with the failed code.",
  };
}

describe("buildDebugPrompt", () => {
  it("includes the failed code, the problem and each match", () => {
    const prompt = buildDebugPrompt(failed, problem, [match("int main(){int w;cin>>w;cout<<(w%2==0&&w>2?\"YES\":\"NO\");}")]);
    expect(prompt).toContain(failed.code);
    expect(prompt).toContain("A. Watermelon");
    expect(prompt).toContain("MATCH 1");
    expect(prompt).toContain("https://codeforces.com/contest/4/submission/5");
    expect(prompt).toContain("Return exactly this JSON object");
  });

  it("truncates very long accepted code so the prompt stays bounded", () => {
    const huge = match("x".repeat(50_000));
    const prompt = buildDebugPrompt(failed, problem, [huge]);
    expect(prompt.length).toBeLessThan(20_000);
  });
});
