import { describe, expect, it } from "vitest";
import { parseExplanation } from "../ai";

describe("parseExplanation", () => {
  it("parses a bare JSON object", () => {
    const parsed = parseExplanation(JSON.stringify({ summary: "Off by one.", confidence: "high" }));
    expect(parsed.summary).toBe("Off by one.");
    expect(parsed.confidence).toBe("high");
    expect(parsed.bugLocation).toBe("");
  });

  it("extracts JSON wrapped in a markdown fence", () => {
    const text = "Here you go:\n```json\n{\"summary\":\"Loop bound\",\"suggestedFix\":\"use <=\"}\n```";
    const parsed = parseExplanation(text);
    expect(parsed.summary).toBe("Loop bound");
    expect(parsed.suggestedFix).toBe("use <=");
  });

  it("falls back to the raw text when the response is not JSON", () => {
    const parsed = parseExplanation("The model refused to answer.");
    expect(parsed.summary).toBe("The model refused to answer.");
    expect(parsed.confidence).toBe("unknown");
  });
});
