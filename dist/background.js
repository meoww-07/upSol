import{t as C,e as E,a as A}from"./assets/fingerprint-BuUToDgv.js";function T(e){return`Title:
${e.title}

Statement:
${e.statement.slice(0,4500)}

Input format:
${e.inputFormat.slice(0,1500)}

Output format:
${e.outputFormat.slice(0,1500)}

Examples:
${e.examples.slice(0,6).join(`

`).slice(0,2500)}

Notes:
${e.notes.slice(0,1500)}`}function v(e,t,r){const o=r.map((n,a)=>`MATCH ${a+1}
Submission: ${n.sourceUrl}
Language: ${n.language}
Scores: total=${n.totalScore.toFixed(2)}, logic=${n.logicalScore.toFixed(2)}, token=${n.tokenScore.toFixed(2)}, style=${n.styleScore.toFixed(2)}
Reason: ${n.reason}
Logic tags: ${n.logicFingerprint.approachTags.join(", ")||"none"}
Data structures: ${n.logicFingerprint.dataStructures.join(", ")||"none"}
Control flow: ${n.logicFingerprint.controlFlowShape.join(", ")||"none"}
State variables: ${n.logicFingerprint.stateVariables.join(", ")||"none"}
Edge signals: ${n.logicFingerprint.edgeCaseSignals.join(", ")||"none"}
Code:
\`\`\`
${n.code.slice(0,1e4)}
\`\`\``).join(`

`);return`You are upSol, a strict logic-first Codeforces Wrong Answer debugger.

Your task:
Find why the FAILED submission got WA by comparing it against the TOP MATCHED ACCEPTED submissions.
The user is a beginner/intermediate competitive programmer. Explain the smallest logic mistake, not a full rewrite.

Hard rules:
1. Use only the failed code, problem statement, and accepted submissions below.
2. Do not invent a different algorithm unless it is clearly used by an accepted submission.
3. Match logic before style. Variable names and formatting are secondary.
4. Identify the user's intended algorithm first.
5. Compare the failed code against the closest accepted code at the level of conditions, state updates, loops, and edge cases.
6. Prefer a minimal fix that preserves the user's approach.
7. If you cannot infer an exact counterexample, give a counterexample pattern, not a fake exact input.
8. Do not provide a full replacement solution unless the user's approach is unrecoverable.
9. Keep explanations concrete and tied to code blocks/conditions.
10. Return only valid JSON. No Markdown outside JSON.

Failed submission:
URL: ${e.url}
Verdict: ${e.verdict}
Language: ${e.language}
Problem: ${e.contestId}${e.problemIndex}

Problem statement:
${T(t)}

Failed code:
\`\`\`
${e.code.slice(0,12e3)}
\`\`\`

Top logically matched accepted submissions:
${o}

Analyze in this order internally:
1. What is the problem asking?
2. What algorithm/reasoning is the failed code attempting?
3. Which accepted match is logically closest?
4. What condition, loop invariant, state update, or edge-case differs?
5. Why does that difference cause WA?
6. What is the smallest fix?

Return exactly this JSON object:
{
  "summary": "2-3 sentence explanation of the WA cause.",
  "intendedAlgorithm": "What the failed code is trying to do.",
  "acceptedAlgorithm": "What the closest accepted submission does logically.",
  "bugLocation": "Specific condition/loop/state update/block in the failed code.",
  "failingLogic": "Why the failed code's logic is wrong.",
  "logicDivergence": "The exact difference between failed code and accepted code.",
  "matchedSolutionReason": "Why the top accepted match is relevant.",
  "counterexample": "Small exact input if you are confident; otherwise empty string.",
  "counterexamplePattern": "Pattern of cases that break the failed logic.",
  "suggestedFix": "Minimal logic-level fix, preserving the user's approach.",
  "patchGuidance": "Concrete implementation guidance without rewriting the full solution.",
  "confidence": "high | medium | low"
}`}const x=9e4;function P(e){return typeof e=="object"&&e!==null&&e.name==="AbortError"}async function w(e,t,r,o=x){const n=new AbortController,a=setTimeout(()=>n.abort(),o);try{return await fetch(e,{...t,signal:n.signal})}catch(i){throw P(i)?new Error(`${r} request timed out after ${Math.round(o/1e3)}s. Try again or switch to a faster model.`):i}finally{clearTimeout(a)}}function y(e){const t=e.match(/\{[\s\S]*\}/)?.[0]??e;try{const r=JSON.parse(t);return{summary:r.summary??e,intendedAlgorithm:r.intendedAlgorithm??"",acceptedAlgorithm:r.acceptedAlgorithm??"",bugLocation:r.bugLocation??"",failingLogic:r.failingLogic??"",logicDivergence:r.logicDivergence??"",matchedSolutionReason:r.matchedSolutionReason??"",counterexample:r.counterexample??"",suggestedFix:r.suggestedFix??"",patchGuidance:r.patchGuidance??"",counterexamplePattern:r.counterexamplePattern??"",confidence:r.confidence??"unknown"}}catch{return{summary:e,intendedAlgorithm:"",acceptedAlgorithm:"",bugLocation:"",failingLogic:"",logicDivergence:"",matchedSolutionReason:"",counterexample:"",suggestedFix:"",patchGuidance:"",counterexamplePattern:"",confidence:"unknown"}}}async function F(e,t,r,o){if(o.provider==="none")return null;const n=v(e,t,r);if(o.provider==="openai"||o.provider==="deepseek"||o.provider==="kimi"){const s={openai:{apiKey:o.openaiApiKey||o.apiKey,missingKeyMessage:"OpenAI API key is missing.",endpoint:"https://api.openai.com/v1/chat/completions",defaultModel:"gpt-4o-mini",label:"OpenAI"},deepseek:{apiKey:o.deepseekApiKey||o.apiKey,missingKeyMessage:"DeepSeek API key is missing.",endpoint:"https://api.deepseek.com/chat/completions",defaultModel:"deepseek-v4-flash",label:"DeepSeek"},kimi:{apiKey:o.kimiApiKey||o.apiKey,missingKeyMessage:"Kimi API key is missing.",endpoint:"https://api.moonshot.ai/v1/chat/completions",defaultModel:"kimi-k2.6",label:"Kimi"}}[o.provider],c=s.apiKey.trim();if(!c)throw new Error(s.missingKeyMessage);const l=await w(s.endpoint,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${c}`},body:JSON.stringify({model:o.model||s.defaultModel,messages:[{role:"user",content:n}],temperature:.2})},s.label);if(!l.ok){const u=await l.text().catch(()=>"");throw new Error(`${s.label} request failed: ${l.status}${u?` - ${u.slice(0,180)}`:""}`)}const p=await l.json();return y(p.choices?.[0]?.message?.content??"")}if(o.provider==="gemini"){const s=(o.geminiApiKey||o.apiKey).trim();if(!s)throw new Error("Gemini API key is missing.");const c=o.model||"gemini-2.5-flash-lite",l=await w(`https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(c)}:generateContent?key=${encodeURIComponent(s)}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({contents:[{role:"user",parts:[{text:n}]}],generationConfig:{temperature:.2,responseMimeType:"application/json"}})},"Gemini");if(!l.ok){const d=await l.text().catch(()=>"");throw l.status===503?new Error("Gemini is temporarily overloaded. Your API key was accepted, but the model is experiencing high demand. Try again later or switch to another model/provider."):new Error(`Gemini request failed: ${l.status}${d?` - ${d.slice(0,180)}`:""}`)}const u=(await l.json()).candidates?.[0]?.content?.parts?.map(d=>d.text??"").join("")??"";return y(u)}if(o.provider==="claude"){const s=(o.claudeApiKey||o.apiKey).trim();if(!s)throw new Error("Claude API key is missing.");const c=await w("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"Content-Type":"application/json","x-api-key":s,"anthropic-version":"2023-06-01"},body:JSON.stringify({model:o.model||"claude-3-5-haiku-latest",max_tokens:1400,temperature:.2,messages:[{role:"user",content:n}]})},"Claude");if(!c.ok){const u=await c.text().catch(()=>"");throw new Error(`Claude request failed: ${c.status}${u?` - ${u.slice(0,180)}`:""}`)}const p=(await c.json()).content?.map(u=>u.type==="text"?u.text??"":"").join("")??"";return y(p)}let a;try{a=await w(o.ollamaUrl||"http://localhost:11434/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({model:o.model||"qwen2.5-coder:7b",prompt:n,stream:!1,options:{temperature:.2}})},"Ollama")}catch(s){throw s instanceof Error&&s.message.includes("timed out")?s:new Error("Could not connect to Ollama. Start Ollama and run: ollama run qwen2.5-coder:7b")}if(!a.ok)throw a.status===403?new Error("Ollama returned 403. Allow Chrome extension origins, restart Ollama, then retry: set OLLAMA_ORIGINS=chrome-extension://*"):new Error(`Ollama request failed: ${a.status}. Make sure the model is installed with: ollama run ${o.model||"qwen2.5-coder:7b"}`);const i=await a.json();return y(i.response??"")}function g(e){const t=e.toLowerCase().trim();return t?t.includes("c++")||t.includes("gcc")||t.includes("clang")?"cpp":t.includes("c#")||t.includes("mono")||t.includes(".net")?"csharp":/\bc(?:\d{2})?\b/.test(t)?"c":t.includes("python")||t.includes("pypy")?"python":t.includes("javascript")||t.includes("node")?"javascript":t.includes("java")?"java":t.includes("kotlin")?"kotlin":t.includes("rust")?"rust":/\bgo\b|golang/.test(t)?"go":t.split(/\s+/)[0]||"unknown":"unknown"}function m(e,t){const r=new Set(e),o=new Set(t),n=new Set([...r,...o]);if(!n.size)return 0;let a=0;return r.forEach(i=>{o.has(i)&&(a+=1)}),a/n.size}function $(e,t){const r=m(e.approachTags,t.approachTags),o=m(e.dataStructures,t.dataStructures),n=m(e.controlFlowShape,t.controlFlowShape),a=m(e.stateVariables,t.stateVariables),i=m(e.edgeCaseSignals,t.edgeCaseSignals),s=e.complexityHint===t.complexityHint?1:0;return r*.32+o*.18+n*.18+a*.12+i*.12+s*.08}function O(e,t){return m(C(e),C(t))}function M(e,t){const r=g(e.language)===g(t.language)?1:0,o=e.loopType===t.loopType?1:0,n=e.namingConvention===t.namingConvention?1:0,a=e.usesRecursion===t.usesRecursion?1:0,i=e.verbosity===t.verbosity?1:0,s=m(e.stlUsage,t.stlUsage),c=Math.abs(e.lineCount-t.lineCount),l=Math.max(0,1-c/Math.max(e.lineCount,t.lineCount,1));return r*.18+o*.15+n*.12+a*.1+i*.12+s*.2+l*.13}const K=.08;function U(e,t){return t.length<=5?t:t.filter(r=>$(e,r.logicFingerprint)>=K)}function L(e,t,r,o){return U(t,o).map(a=>{const i=$(t,a.logicFingerprint),s=O(e.code,a.code),c=M(r,a.styleFingerprint),l=i*.6+s*.25+c*.15,p=a.logicFingerprint.approachTags.filter(d=>t.approachTags.includes(d)),u=p.length?`Shares ${p.join(", ")} with the failed code.`:"Kept as a weaker fallback because no close logic tags were detected.";return{...a,totalScore:l,logicalScore:i,tokenScore:s,styleScore:c,reason:u}}).sort((a,i)=>i.totalScore-a.totalScore)}const _="upsol.latestAnalysis";async function R(){const t=(await new Promise(r=>{chrome.tabs.query({active:!0,currentWindow:!0},r)}))[0]?.id;if(!t)throw new Error("No active tab found.");return t}async function j(){return await new Promise(e=>{chrome.tabs.query({url:"https://codeforces.com/*/submission/*"},e)})}async function N(e){try{if((await chrome.tabs.sendMessage(e,{type:"PING"}))?.ok)return}catch{await chrome.scripting.executeScript({target:{tabId:e},files:["contentScript.js"]})}}async function h(e,t){return await N(e),chrome.tabs.sendMessage(e,t)}async function D(e){await new Promise((t,r)=>{const o=setTimeout(()=>{chrome.tabs.onUpdated.removeListener(n),r(new Error(`Temporary tab ${e} did not finish loading.`))},2e4),n=(a,i)=>{a===e&&i.status==="complete"&&(clearTimeout(o),chrome.tabs.onUpdated.removeListener(n),t())};chrome.tabs.onUpdated.addListener(n)})}async function b(e,t){const o=(await chrome.tabs.create({url:e,active:!1})).id;if(!o)throw new Error(`Could not open temporary tab for ${e}`);try{return await D(o),await new Promise(n=>setTimeout(n,450)),await h(o,t)}catch(n){const a=n instanceof Error?n.message:"unknown error";throw new Error(`Could not scrape ${e}: ${a}`)}finally{await chrome.tabs.remove(o).catch(()=>{})}}async function S(e){await chrome.storage.local.set({[_]:{...e,updatedAt:Date.now()}})}async function B(e,t){try{const o=await h(e,{type:"FETCH_PROBLEM_STATEMENT",contestId:t.contestId,problemIndex:t.problemIndex});if(o?.rawText)return o}catch(o){console.warn(o)}const r=`https://codeforces.com/problemset/problem/${t.contestId}/${t.problemIndex}`;return b(r,{type:"SCRAPE_PROBLEM_STATEMENT"})}async function W(e){const t=await G(e);if(t.length)return t;const r=[];for(let a=1;a<=8;a+=1)r.push(`https://codeforces.com/contest/${e.contestId}/status/${e.problemIndex}/page/${a}?order=BY_ARRIVED_DESC`),r.push(`https://codeforces.com/problemset/status/${e.contestId}/problem/${e.problemIndex}/page/${a}?order=BY_ARRIVED_DESC`);const o=[],n=new Set;for(const a of r)try{const i=await b(a,{type:"SCRAPE_ACCEPTED_META",limit:40});for(const s of i)n.has(s.submissionId)||(n.add(s.submissionId),o.push(s));if(o.length>=80)break}catch(i){console.warn(i)}return o}async function G(e){const t=`https://codeforces.com/api/contest.status?contestId=${e.contestId}&from=1&count=200`;try{const r=await fetch(t).then(async a=>{if(!a.ok)throw new Error(`Codeforces API failed: ${a.status}`);return await a.json()});if(r.status!=="OK"||!r.result)return[];const o=new Set,n=[];for(const a of r.result){if(!(String(a.problem?.contestId??e.contestId)===e.contestId&&a.problem?.index?.toUpperCase()===e.problemIndex.toUpperCase())||a.verdict!=="OK")continue;const s=String(a.id);if(!o.has(s)&&(o.add(s),n.push({submissionId:s,userHandle:a.author?.members?.[0]?.handle??a.author?.participantType??"unknown",language:a.programmingLanguage??"Unknown language",sourceUrl:`https://codeforces.com/contest/${e.contestId}/submission/${s}`}),n.length>=80))break}return n}catch(r){return console.warn(r),[]}}async function q(e){const t=await H(e);if(t.length>=1)return t.slice(0,3);const r=await W(e);if(!r.length)throw new Error(`No accepted rows were found on Codeforces status pages for ${e.contestId}${e.problemIndex}.`);const o=g(e.language),n=r.filter(s=>g(s.language)===o);if(o!=="unknown"&&!n.length)throw new Error(`Accepted rows were found, but none matched the failed submission language family (${e.language}).`);const a=(o==="unknown"?r:n).slice(0,60),i=[];for(const s of a)try{const c=await b(s.sourceUrl,{type:"SCRAPE_SUBMISSION_SOURCE"});if(!c.code)continue;if(i.push({...c,userHandle:c.userHandle||s.userHandle,language:c.language==="Unknown language"?s.language:c.language,logicFingerprint:E(c.code),styleFingerprint:A(c.code,c.language==="Unknown language"?s.language:c.language)}),i.length>=3)break}catch(c){console.warn(c)}return i.filter(s=>o==="unknown"||g(s.language)===o)}async function H(e){const t=await j(),r=[],o=g(e.language),n=e.submissionId;for(const a of t)if(!(!a.id||!a.url)&&!(n&&a.url.includes(`/submission/${n}`))&&a.url.includes(`/contest/${e.contestId}/submission/`))try{const i=await h(a.id,{type:"SCRAPE_SUBMISSION_SOURCE"});if(!i.code)continue;const s=i.language==="Unknown language"?e.language:i.language;if(o!=="unknown"&&g(s)!==o)continue;if(r.push({...i,language:s,logicFingerprint:E(i.code),styleFingerprint:A(i.code,s)}),r.length>=3)break}catch(i){console.warn(i)}return r}function Y(e){return e?e.replace(/_/g," ").toLowerCase():""}async function J(e){if(!e.viewerHandle)throw new Error("This problem page was detected, but upSol could not find your Codeforces handle. Sign in to Codeforces, then try again from the problem page.");const t=`https://codeforces.com/api/user.status?handle=${encodeURIComponent(e.viewerHandle)}&from=1&count=500`,r=await fetch(t).then(async i=>{if(!i.ok)throw new Error(`Codeforces user status failed: ${i.status}`);return await i.json()});if(r.status!=="OK"||!r.result)throw new Error(r.comment??"Codeforces did not return your recent submissions.");const o=r.result.filter(i=>String(i.problem?.contestId??"")===e.contestId&&i.problem?.index?.toUpperCase()===e.problemIndex.toUpperCase()&&Y(i.verdict).includes("wrong answer")).sort((i,s)=>(s.creationTimeSeconds??0)-(i.creationTimeSeconds??0))[0];if(!o)throw new Error(`No recent Wrong Answer submission was found for ${e.contestId}${e.problemIndex} under ${e.viewerHandle}.`);const n=`https://codeforces.com/contest/${e.contestId}/submission/${o.id}`,a=await b(n,{type:"SCRAPE_SUBMISSION_SOURCE"});if(!a.code)throw new Error(`Found submission ${o.id}, but Codeforces did not expose its source code in this session.`);return{url:n,contestId:e.contestId,problemIndex:e.problemIndex,submissionId:String(o.id),verdict:o.verdict?o.verdict.replace(/_/g," "):"Wrong answer",language:o.programmingLanguage??a.language??"Unknown language",code:a.code}}function V(e){return e.provider==="none"?!1:e.provider==="gemini"?!!(e.geminiApiKey||e.apiKey).trim():e.provider==="openai"?!!(e.openaiApiKey||e.apiKey).trim():e.provider==="claude"?!!(e.claudeApiKey||e.apiKey).trim():e.provider==="deepseek"?!!(e.deepseekApiKey||e.apiKey).trim():e.provider==="kimi"?!!(e.kimiApiKey||e.apiKey).trim():e.provider==="ollama"?!!e.ollamaUrl:!1}async function z(e){await S({status:"running"});const t=await R(),r=await h(t,{type:"DETECT_ANALYZABLE_PAGE"});if(!r.ok)throw new Error(r.reason);const o=r.pageType==="problem"?await h(t,{type:"SCRAPE_PROBLEM_PAGE_CONTEXT"}):null,n=r.pageType==="problem"&&o?await J(o):await h(t,{type:"SCRAPE_FAILED_CODE"});if(!n.code)throw new Error("Failed source code was not found on the page.");if(!n.contestId||!n.problemIndex)throw new Error("Could not detect contest ID or problem index from this submission.");const a=o?.problemStatement?.rawText||o?.problemStatement?.statement?o.problemStatement:await B(t,n);let i=[];try{i=await q(n)}catch(f){const I=f instanceof Error?f.message:"Unknown accepted-submission collector error.";throw new Error(`Step 4 failed: ${I}`)}if(!i.length)throw new Error("No accepted source code could be collected. Codeforces blocked or hid the accepted submission source pages in this browser session.");const s=E(n.code),c=A(n.code,n.language),l=L(n,s,c,i).slice(0,3),p=V(e);let u=null,d=!p;if(p)try{u=await F(n,a,l,e)}catch(f){console.warn(f),d=!0}const k={failedSubmission:n,problemStatement:a,acceptedSubmissions:i,matchedSubmissions:l,explanation:u,explanationSkipped:d};return await S({status:"complete",result:k}),k}chrome.runtime.onMessage.addListener((e,t,r)=>{const o=e;if(o.type==="ANALYZE_CURRENT_TAB")return z(o.settings).then(n=>r({ok:!0,result:n})).catch(async n=>{const a=n instanceof Error?n.message:"Unknown analysis error.";await S({status:"error",error:a}),r({ok:!1,error:a})}),!0});
