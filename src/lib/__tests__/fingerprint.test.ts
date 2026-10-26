import { describe, expect, it } from "vitest";
import { extractLogicFingerprint, extractStyleFingerprint, tokenizeCode } from "../fingerprint";

const twoPointerCode = `
#include <bits/stdc++.h>
using namespace std;
int main() {
  int n; cin >> n;
  vector<long long> a(n);
  for (auto &x : a) cin >> x;
  sort(a.begin(), a.end());
  int l = 0, r = n - 1;
  long long ans = 0;
  while (l < r) {
    if (a[l] + a[r] > 0) r--; else { ans++; l++; }
  }
  cout << ans << "\\n";
}`;

describe("tokenizeCode", () => {
  it("strips comments and lowercases identifiers", () => {
    const tokens = tokenizeCode("int Ans = 0; // comment Foo\n/* block Bar */ ans += 1;");
    expect(tokens).toContain("ans");
    expect(tokens).not.toContain("foo");
    expect(tokens).not.toContain("bar");
    expect(tokens).toContain("+=");
  });
});

describe("extractLogicFingerprint", () => {
  it("detects sorting, two pointers and large-number handling", () => {
    const fp = extractLogicFingerprint(twoPointerCode);
    expect(fp.approachTags).toContain("sorting");
    expect(fp.approachTags).toContain("two pointers");
    expect(fp.dataStructures).toContain("array/vector");
    expect(fp.edgeCaseSignals).toContain("large number handling");
    expect(fp.complexityHint).toBe("likely O(n log n)");
  });

  it("only flags zero/one handling when 0 or 1 is compared against", () => {
    const plainLoop = "for (int i = 0; i < n; i++) total += a[i];";
    expect(extractLogicFingerprint(plainLoop).edgeCaseSignals).not.toContain("zero/one case handling");

    const guarded = "if (n == 1) { puts(\"YES\"); } if (x > 0) cnt++;";
    expect(extractLogicFingerprint(guarded).edgeCaseSignals).toContain("zero/one case handling");
  });

  it("does not treat the words all or will as a long long alias", () => {
    const fp = extractLogicFingerprint("int all = 0; // this will run\nfor (int i = 0; i < all; i++) {}");
    expect(fp.edgeCaseSignals).not.toContain("large number handling");
  });

  it("does not read mapping or stacked as data structures", () => {
    const fp = extractLogicFingerprint("int mapping = 1; int stacked = 2; int x = mapping + stacked;");
    expect(fp.dataStructures).not.toContain("map/hash map");
    expect(fp.dataStructures).not.toContain("stack");

    const real = extractLogicFingerprint("map<int,int> m; stack<int> st; deque<int> dq;");
    expect(real.dataStructures).toContain("map/hash map");
    expect(real.dataStructures).toContain("stack");
    expect(real.dataStructures).toContain("queue/deque");
  });
});

describe("extractStyleFingerprint", () => {
  it("summarises loop style, naming and verbosity", () => {
    const style = extractStyleFingerprint(twoPointerCode, "GNU C++17");
    expect(style.language).toBe("GNU C++17");
    expect(style.loopType).toBe("mixed");
    expect(style.verbosity).toBe("compact");
    expect(style.lineCount).toBeGreaterThan(5);
  });
});
