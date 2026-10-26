import { tokenizeCode } from "./fingerprint";
import { languageFamily } from "./language";
import type { AcceptedSubmission, FailedSubmission, LogicFingerprint, MatchedSubmission, StyleFingerprint } from "./types";

export function overlapScore(a: string[], b: string[]) {
  const left = new Set(a);
  const right = new Set(b);
  const union = new Set([...left, ...right]);
  if (!union.size) return 0;
  let overlap = 0;
  left.forEach((value) => {
    if (right.has(value)) overlap += 1;
  });
  return overlap / union.size;
}

export function scoreByLogicalSimilarity(user: LogicFingerprint, candidate: LogicFingerprint) {
  const approach = overlapScore(user.approachTags, candidate.approachTags);
  const structures = overlapScore(user.dataStructures, candidate.dataStructures);
  const flow = overlapScore(user.controlFlowShape, candidate.controlFlowShape);
  const state = overlapScore(user.stateVariables, candidate.stateVariables);
  const edge = overlapScore(user.edgeCaseSignals, candidate.edgeCaseSignals);
  const complexity = user.complexityHint === candidate.complexityHint ? 1 : 0;

  return approach * 0.32 + structures * 0.18 + flow * 0.18 + state * 0.12 + edge * 0.12 + complexity * 0.08;
}

export function scoreByTokenSimilarity(userCode: string, candidateCode: string) {
  return overlapScore(tokenizeCode(userCode), tokenizeCode(candidateCode));
}

export function scoreByStyleSimilarity(user: StyleFingerprint, candidate: StyleFingerprint) {
  // Compare language families, not raw labels: "GNU C++17" and "GNU C++20" are the same style.
  const language = languageFamily(user.language) === languageFamily(candidate.language) ? 1 : 0;
  const loop = user.loopType === candidate.loopType ? 1 : 0;
  const naming = user.namingConvention === candidate.namingConvention ? 1 : 0;
  const recursion = user.usesRecursion === candidate.usesRecursion ? 1 : 0;
  const verbosity = user.verbosity === candidate.verbosity ? 1 : 0;
  const stl = overlapScore(user.stlUsage, candidate.stlUsage);
  const lineDistance = Math.abs(user.lineCount - candidate.lineCount);
  const lineSimilarity = Math.max(0, 1 - lineDistance / Math.max(user.lineCount, candidate.lineCount, 1));

  return language * 0.18 + loop * 0.15 + naming * 0.12 + recursion * 0.1 + verbosity * 0.12 + stl * 0.2 + lineSimilarity * 0.13;
}

const MIN_LOGIC_SCORE = 0.08;

export function filterByLogic(user: LogicFingerprint, candidates: AcceptedSubmission[]) {
  if (candidates.length <= 5) return candidates;
  return candidates.filter((candidate) => scoreByLogicalSimilarity(user, candidate.logicFingerprint) >= MIN_LOGIC_SCORE);
}

export function hybridSearch(
  failed: FailedSubmission,
  userLogic: LogicFingerprint,
  userStyle: StyleFingerprint,
  candidates: AcceptedSubmission[]
): MatchedSubmission[] {
  const filtered = filterByLogic(userLogic, candidates);

  return filtered
    .map((candidate) => {
      const logicalScore = scoreByLogicalSimilarity(userLogic, candidate.logicFingerprint);
      const tokenScore = scoreByTokenSimilarity(failed.code, candidate.code);
      const styleScore = scoreByStyleSimilarity(userStyle, candidate.styleFingerprint);
      const totalScore = logicalScore * 0.6 + tokenScore * 0.25 + styleScore * 0.15;
      const sharedApproaches = candidate.logicFingerprint.approachTags.filter((tag) => userLogic.approachTags.includes(tag));
      const reason = sharedApproaches.length
        ? `Shares ${sharedApproaches.join(", ")} with the failed code.`
        : "Kept as a weaker fallback because no close logic tags were detected.";

      return {
        ...candidate,
        totalScore,
        logicalScore,
        tokenScore,
        styleScore,
        reason,
      };
    })
    .sort((a, b) => b.totalScore - a.totalScore);
}
