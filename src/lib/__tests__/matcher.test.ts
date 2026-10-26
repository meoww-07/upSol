import { describe, expect, it } from "vitest";
import { extractLogicFingerprint, extractStyleFingerprint } from "../fingerprint";
import { hybridSearch, overlapScore, scoreByStyleSimilarity } from "../matcher";
import type { AcceptedSubmission, FailedSubmission } from "../types";

function accepted(submissionId: string, code: string, language = "GNU C++17"): AcceptedSubmission {
  return {
    submissionId,
    userHandle: `user${submissionId}`,
    language,
    code,
    codeLength: code.length,
    sourceUrl: `https://codeforces.com/contest/1/submission/${submissionId}`,
    logicFingerprint: extractLogicFingerprint(code),
    styleFingerprint: extractStyleFingerprint(code, language),
  };
}

const failedCode = `
#include <bits/stdc++.h>
using namespace std;
int main(){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
int l=0,r=n-1;int ans=0;while(l<r){if(a[l]+a[r]>0)r--;else{ans++;l++;}}cout<<ans;}`;

const failed: FailedSubmission = {
  url: "https://codeforces.com/contest/1/submission/1",
  contestId: "1",
  problemIndex: "A",
  submissionId: "1",
  verdict: "Wrong answer on test 3",
  language: "GNU C++17",
  code: failedCode,
};

describe("overlapScore", () => {
  it("is Jaccard similarity over unique values", () => {
    expect(overlapScore(["a", "b"], ["b", "c"])).toBeCloseTo(1 / 3);
    expect(overlapScore([], [])).toBe(0);
    expect(overlapScore(["a"], ["a", "a"])).toBe(1);
  });
});

describe("scoreByStyleSimilarity", () => {
  it("treats different compiler versions of one language as the same", () => {
    const user = extractStyleFingerprint(failedCode, "GNU C++17 (64)");
    const sameFamily = extractStyleFingerprint(failedCode, "GNU C++20 (64)");
    const otherFamily = extractStyleFingerprint(failedCode, "PyPy 3-64");
    expect(scoreByStyleSimilarity(user, sameFamily)).toBeGreaterThan(scoreByStyleSimilarity(user, otherFamily));
    expect(scoreByStyleSimilarity(user, sameFamily)).toBeCloseTo(1);
  });
});

describe("hybridSearch", () => {
  it("ranks the logically closest accepted submission first", () => {
    const similar = accepted(
      "10",
      `#include <bits/stdc++.h>
using namespace std;
int main(){int n;cin>>n;vector<int>a(n);for(auto&x:a)cin>>x;sort(a.begin(),a.end());
int l=0,r=n-1;int ans=0;while(l<r){if(a[l]+a[r]>=0)r--;else{ans++;l++;}}cout<<ans;}`
    );
    const different = accepted(
      "11",
      `import sys
def main():
    data = sys.stdin.read().split()
    print(sum(int(v) for v in data[1:]) % 7)
main()`,
      "PyPy 3-64"
    );

    const userLogic = extractLogicFingerprint(failed.code);
    const userStyle = extractStyleFingerprint(failed.code, failed.language);
    const ranked = hybridSearch(failed, userLogic, userStyle, [different, similar]);

    expect(ranked.map((match) => match.submissionId)).toEqual(["10", "11"]);
    expect(ranked[0].totalScore).toBeGreaterThan(ranked[1].totalScore);
    expect(ranked[0].reason).toContain("Shares");
    expect(ranked[0].tokenScore).toBeGreaterThan(0.5);
  });

  it("keeps every candidate when there are five or fewer", () => {
    const candidates = ["20", "21", "22"].map((id) => accepted(id, "print(1)", "Python 3"));
    const userLogic = extractLogicFingerprint(failed.code);
    const userStyle = extractStyleFingerprint(failed.code, failed.language);
    expect(hybridSearch(failed, userLogic, userStyle, candidates)).toHaveLength(3);
  });
});
