import { spawn, spawnSync } from "node:child_process";
import { createWriteStream } from "node:fs";
import {
  copyFile,
  link,
  mkdir,
  readFile,
  rename,
  rm,
  writeFile,
} from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";
import { createServer as createViteServer } from "vite";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const libraryDir = join(root, "artifacts", "v3.2", "business-case-video-library");
const sourceVideoDir = join(root, "artifacts", "v3.2", "videos");
const requestedArg = process.argv.find((arg) => arg.startsWith("--cases="));
const requestedCases = requestedArg
  ? new Set(requestedArg.split("=")[1].split(",").map((value) => Number(value.trim())))
  : new Set(Array.from({ length: 11 }, (_, index) => index + 2));
const validateOnly = process.argv.includes("--validate-only");

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, { cwd: root, encoding: "utf8", ...options });
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
};

const moduleLoader = await createViteServer({ root, server: { middlewareMode: true }, appType: "custom", logLevel: "silent" });
const workbenchModule = await moduleLoader.ssrLoadModule("/src/data/useCaseWorkbench.ts");
const useCases = workbenchModule.wireframeUseCases;
const features = workbenchModule.p0Features;
await moduleLoader.close();

const personaByFeature = {
  "WF-P0-05": "Recruiter",
  "WF-P0-06": "Recruiter",
  "WF-P0-07": "Recruiter",
  "WF-P0-08": "Recruiter",
  "WF-P0-09": "Recruiter",
  "WF-P0-10": "Hiring Manager",
  "WF-P0-11": "Screening Reviewer",
  "WF-P0-12": "Recruiter",
  "WF-P0-13": "People Operations",
  "WF-P0-14": "People Operations",
  "WF-P0-15": "People Operations",
};

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const caseFolder = (useCase) => join(libraryDir, `${useCase.code.slice(3)}-${slugify(useCase.title)}`);
const categoryForCode = (code) => {
  const number = Number(code.slice(3));
  if (number <= 2) return "Demand & Attraction";
  if (number <= 5) return "Application & Sourcing";
  if (number <= 8) return "Interview & Evaluation";
  if (number <= 11) return "Offer & Onboarding";
  return "Worker Lifecycle";
};
const spokenCode = (code) => code.replace("UC-", "Business Case ");
const compactValue = (value) => value.replaceAll("·", ",").replaceAll("+", "and");

const buildScenes = (useCase, feature) => [
  {
    id: "opening",
    chapter: useCase.code,
    title: useCase.title,
    text: `${spokenCode(useCase.code)} begins when ${useCase.trigger.toLowerCase()} ${useCase.outcome} The governed record is ${useCase.recordId}. The accountable actors are ${useCase.actors.join(", ")}. This demonstration uses synthetic browser-memory data and creates no database, provider, message or external-system effect.`,
  },
  {
    id: "dfd-overview",
    chapter: "Dynamic data-flow diagram",
    title: `${useCase.processes.length} accountable processes`,
    text: `The action-level data-flow diagram defines ${useCase.processes.length} processes before product navigation. Every process identifies the actor, screen, action, input, output, business object, event, governed store, rule, denial and recovery. The highlighted path keeps each business grain and version distinct.`,
  },
  {
    id: "dfd-processes",
    chapter: "Process walkthrough",
    title: "Actor, action, evidence and downstream state",
    text: useCase.processes.map((process, index) => `Process ${index + 1}, ${process.actor}: ${process.title}. The action ${process.action.toLowerCase()} produces ${process.output.toLowerCase()} in the ${process.store}.`).join(" "),
  },
  {
    id: "product-route",
    chapter: "Product wireframe",
    title: `Open ${feature.recordId} in context`,
    text: `The actual product route is ${feature.route}. It presents ${feature.title.toLowerCase()} in the surrounding recruitment or onboarding workspace. The screen remains a wireframe, but its identifiers, current state, navigation, data relationships and action boundaries match the business contract used by the connected workbench.`,
  },
  {
    id: "workbench-data",
    chapter: "Governed data",
    title: "Inspect fields, scope and business grains",
    text: `The seeded workbench follows record ${feature.recordId}. Its governed fields are ${feature.fields.map((field) => `${field.label}, ${compactValue(field.value)}`).join("; ")}. Field classifications remain visible so the presenter can distinguish public, internal, confidential and restricted projections for the active persona.`,
  },
  {
    id: "primary-action",
    chapter: "Happy-path action",
    title: feature.primaryAction,
    text: `With ${personaByFeature[feature.id]} selected, we perform ${feature.primaryAction.toLowerCase()}. The guard requires ${feature.guard.toLowerCase()}. The state changes from ${feature.fromState} to ${feature.toState}, records ${feature.event}, writes to the ${feature.store}, and creates the handoff: ${feature.handoff}.`,
  },
  {
    id: "controlled-exception",
    chapter: "Controlled exception",
    title: feature.exceptionAction,
    text: `We now exercise the controlled exception: ${feature.exceptionAction}. The prepared failure is ${feature.exception}. Unsupported downstream work stops, successful prior evidence remains intact, and the state-change receipt assigns explicit recovery without hiding the failed attempt.`,
  },
  {
    id: "recovery-evidence",
    chapter: "Recovery and evidence",
    title: feature.recoveryAction,
    text: `The owned recovery is ${feature.recoveryAction}. It reuses the governed business context without duplicating completed effects. The new receipt preserves previous state, current state, actor, event and correlation key. The control center and handoff inbox then expose the same recovery through ${feature.metric.toLowerCase()} and minimum-context next-actor work.`,
  },
  {
    id: "closing",
    chapter: `${useCase.code} complete`,
    title: useCase.outcome,
    text: `${spokenCode(useCase.code)} is complete. We demonstrated the level-two process contract, the actual product route, governed field projections, the primary state transition, a controlled exception, targeted recovery, causal dashboard evidence and the next-actor handoff. ${useCase.outcome} Production identity, persistence, integrations and external delivery remain separate implementation gates.`,
  },
];

const timestamp = (seconds) => {
  const milliseconds = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  const secs = Math.floor((milliseconds % 60_000) / 1000);
  const millis = milliseconds % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(millis).padStart(3, "0")}`;
};

const wrapCaption = (value, width = 72) => {
  const lines = [];
  let line = "";
  for (const word of value.trim().split(/\s+/)) {
    if (line && `${line} ${word}`.length > width) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines.join("\n");
};

const writeNarrationAssets = async (useCase, feature, folder, workingDir) => {
  const scenes = buildScenes(useCase, feature);
  const narration = { id: useCase.code, title: useCase.title, voice: "Aman (English (India))", rate: 176, scenes };
  await writeFile(join(folder, "narration.json"), `${JSON.stringify(narration, null, 2)}\n`);
  const audioDir = join(workingDir, "audio");
  await mkdir(audioDir, { recursive: true });
  const audioFiles = [];
  const durations = [];
  for (const [index, scene] of scenes.entries()) {
    const audioFile = join(audioDir, `${String(index + 1).padStart(2, "0")}-${scene.id}.aiff`);
    console.log(`[${useCase.code} audio ${index + 1}/${scenes.length}] ${scene.title}`);
    let synthesized = false;
    let synthesisError = "";
    for (let attempt = 1; attempt <= 3 && !synthesized; attempt += 1) {
      const result = spawnSync("/usr/bin/say", ["-v", narration.voice, "-r", String(narration.rate), "-o", audioFile, scene.text], { cwd: root, encoding: "utf8" });
      synthesized = result.status === 0;
      synthesisError = result.stderr || result.stdout || "Unknown narration error";
      if (!synthesized) {
        await rm(audioFile, { force: true });
        console.log(`[${useCase.code} audio retry ${attempt}/3] ${synthesisError.trim()}`);
        await new Promise((resolveWait) => setTimeout(resolveWait, 1_500));
      }
    }
    if (!synthesized) throw new Error(`/usr/bin/say failed after three attempts: ${synthesisError}`);
    durations.push(Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", audioFile]).trim()));
    audioFiles.push(audioFile);
  }
  const concatFile = join(workingDir, "audio-concat.txt");
  await writeFile(concatFile, audioFiles.map((audioFile) => `file '${audioFile.replaceAll("'", "'\\''")}'`).join("\n"));
  const narrationAudio = join(workingDir, "narration.wav");
  run("ffmpeg", ["-y", "-v", "warning", "-f", "concat", "-safe", "0", "-i", concatFile, "-c:a", "pcm_s16le", narrationAudio]);

  let cursor = 0;
  let cueNumber = 0;
  const subtitleBlocks = [];
  const chapterLines = [";FFMETADATA1", `title=${useCase.code} · ${useCase.title}`];
  const transcriptLines = [`# ${useCase.code} · ${useCase.title}`, "", "> Synthetic browser-memory demonstration. No external effect.", ""];
  for (const [index, scene] of scenes.entries()) {
    const start = cursor;
    const end = start + durations[index];
    const sentences = scene.text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((item) => item.trim()) ?? [scene.text];
    const weights = sentences.map((sentence) => sentence.split(/\s+/).length);
    const totalWeight = weights.reduce((sum, value) => sum + value, 0);
    let usedWeight = 0;
    for (const [sentenceIndex, sentence] of sentences.entries()) {
      const cueStart = start + (durations[index] * usedWeight) / totalWeight;
      usedWeight += weights[sentenceIndex];
      const cueEnd = sentenceIndex === sentences.length - 1 ? end : start + (durations[index] * usedWeight) / totalWeight;
      cueNumber += 1;
      subtitleBlocks.push(`${cueNumber}\n${timestamp(cueStart)} --> ${timestamp(cueEnd)}\n${wrapCaption(sentence)}\n`);
    }
    chapterLines.push("[CHAPTER]", "TIMEBASE=1/1000", `START=${Math.round(start * 1000)}`, `END=${Math.round(end * 1000)}`, `title=${scene.chapter}: ${scene.title}`);
    transcriptLines.push(`## ${timestamp(start).slice(0, 8)} · ${scene.chapter}: ${scene.title}`, "", scene.text, "");
    cursor = end;
  }
  const captions = join(folder, "captions.srt");
  const transcript = join(folder, "transcript.md");
  const chapters = join(workingDir, "chapters.ffmeta");
  await writeFile(captions, `${subtitleBlocks.join("\n")}\n`);
  await writeFile(transcript, transcriptLines.join("\n"));
  await writeFile(chapters, `${chapterLines.join("\n")}\n`);
  return { scenes, durations, totalDuration: cursor, cueNumber, narrationAudio, captions, transcript, chapters, narration };
};

const recordingCss = [
  "html { scroll-behavior: smooth !important; }",
  "* { transition-duration: .35s !important; }",
  ".demo-floating-launcher,.demo-presenter-dock { display: none !important; }",
  ".bc-lib-chapter { position: fixed; z-index: 9998; bottom: .8rem; left: .8rem; display: grid; gap: .1rem; max-width: 18rem; border: 1px solid rgba(255,255,255,.35); border-radius: .55rem; padding: .48rem .62rem; color: white; background: rgba(13,54,46,.94); box-shadow: 0 12px 30px rgba(0,0,0,.2); font-family: Arial,sans-serif; }",
  ".bc-lib-chapter small { color: #a9e7cf; font-size: .54rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }",
  ".bc-lib-chapter strong { font-size: .72rem; line-height: 1.2; }",
  ".bc-lib-slide { position: fixed; z-index: 9999; inset: 0; display: grid; grid-template-columns: minmax(0,1.35fr) minmax(22rem,.65fr); gap: 3rem; align-items: center; padding: 5rem 7rem; color: white; background: radial-gradient(circle at 80% 15%,rgba(145,225,194,.3),transparent 30%),linear-gradient(135deg,#0c332c,#176652 60%,#2a8c70); font-family: Arial,sans-serif; }",
  ".bc-lib-slide .kicker { color: #9fe1c8; font-size: .86rem; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }",
  ".bc-lib-slide h1 { max-width: 57rem; margin: .7rem 0 1rem; font-size: 4.2rem; line-height: .98; letter-spacing: -.05em; }",
  ".bc-lib-slide p { max-width: 55rem; color: #d7ebe4; font-size: 1.12rem; line-height: 1.55; }",
  ".bc-lib-slide .outcome { border-left: 4px solid #91e1c2; padding-left: 1.1rem; color: white; font-weight: 700; }",
  ".bc-lib-slide aside { display: grid; gap: .8rem; border: 1px solid rgba(255,255,255,.22); border-radius: 1rem; padding: 1.3rem; background: rgba(4,36,29,.34); }",
  ".bc-lib-slide aside span { display: grid; gap: .2rem; border-bottom: 1px solid rgba(255,255,255,.15); padding-bottom: .7rem; color: #d8ebe5; font-size: .82rem; }",
  ".bc-lib-slide aside strong { color: #9fe1c8; font-size: .67rem; text-transform: uppercase; }",
  ".bc-lib-focus { outline: 4px solid #f0ad35 !important; outline-offset: 4px; box-shadow: 0 16px 45px rgba(71,53,15,.22) !important; }",
  ".bc-lib-field { outline: 4px solid #f0ad35 !important; outline-offset: 3px; border-radius: .35rem; background: #fff8e7 !important; }",
  ".v32-dfd-canvas article.bc-lib-active { outline: 4px solid #f0ad35 !important; background: #fff4d9 !important; box-shadow: 0 0 0 8px rgba(240,173,53,.18),0 18px 45px rgba(81,58,14,.2) !important; transform: scale(1.008); }",
  ".v32-dfd-canvas article.bc-lib-complete { border-color: #42a984 !important; background: #e3f5ed !important; }",
  ".bc-lib-cursor { position: fixed; z-index: 10001; width: 22px; height: 22px; border: 3px solid white; border-radius: 50%; pointer-events: none; background: #f0ad35; box-shadow: 0 0 0 5px rgba(240,173,53,.28),0 5px 14px rgba(0,0,0,.25); transform: translate(-50%,-50%); transition: left .5s ease,top .5s ease,transform .18s ease !important; }",
  ".bc-lib-cursor.clicking { transform: translate(-50%,-50%) scale(.65); }",
].join("\n");

const attachRecordingHelpers = async (page, useCase, feature) => {
  await page.addStyleTag({ content: recordingCss });
  const clearFocus = async () => page.evaluate(() => document.querySelectorAll(".bc-lib-focus,.bc-lib-field").forEach((element) => element.classList.remove("bc-lib-focus", "bc-lib-field")));
  const focusLocator = async (locator, className = "bc-lib-focus") => {
    await clearFocus();
    if (!(await locator.count())) return;
    const target = locator.first();
    await target.scrollIntoViewIfNeeded();
    await target.evaluate((element, nextClass) => element.classList.add(nextClass), className);
  };
  const moveCursor = async (locator) => {
    const box = await locator.first().boundingBox();
    if (!box) return;
    await page.evaluate(({ x, y }) => {
      let cursor = document.querySelector(".bc-lib-cursor");
      if (!cursor) {
        cursor = document.createElement("div");
        cursor.className = "bc-lib-cursor";
        document.body.appendChild(cursor);
      }
      cursor.style.left = `${x}px`;
      cursor.style.top = `${y}px`;
    }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
    await page.waitForTimeout(450);
  };
  const clickWithCursor = async (locator) => {
    const target = locator.first();
    await target.scrollIntoViewIfNeeded();
    await moveCursor(target);
    await page.evaluate(() => document.querySelector(".bc-lib-cursor")?.classList.add("clicking"));
    await page.waitForTimeout(150);
    await target.click();
    await page.evaluate(() => document.querySelector(".bc-lib-cursor")?.classList.remove("clicking"));
    await page.waitForTimeout(450);
  };
  const openRoute = async (route) => {
    await page.goto(`${page.url().split("/#")[0]}/#${route}`, { waitUntil: "domcontentloaded" });
    await page.locator("main#main-content").waitFor({ state: "visible" });
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  };
  const showChapter = async (scene) => page.evaluate((sceneData) => {
    document.querySelector(".bc-lib-chapter")?.remove();
    const element = document.createElement("div");
    element.className = "bc-lib-chapter";
    const chapter = document.createElement("small");
    const title = document.createElement("strong");
    chapter.textContent = sceneData.chapter;
    title.textContent = sceneData.title;
    element.append(chapter, title);
    document.body.appendChild(element);
  }, scene);
  const showSlide = async (closing) => page.evaluate(({ closingState, useCaseData, featureData }) => {
    document.querySelector(".bc-lib-slide")?.remove();
    const element = document.createElement("div");
    element.className = "bc-lib-slide";
    const main = document.createElement("div");
    const kicker = document.createElement("span");
    const heading = document.createElement("h1");
    const summary = document.createElement("p");
    const outcome = document.createElement("p");
    const aside = document.createElement("aside");
    kicker.className = "kicker";
    outcome.className = "outcome";
    kicker.textContent = closingState ? `${useCaseData.code} · Complete` : `Recruitment System · ${useCaseData.code}`;
    heading.textContent = closingState ? useCaseData.outcome : useCaseData.title;
    summary.textContent = closingState
      ? `${featureData.fromState} → ${featureData.toState} → controlled failure → targeted recovery → reconciled evidence.`
      : `${useCaseData.trigger} ${useCaseData.outcome}`;
    outcome.textContent = closingState
      ? "The same synthetic record reconciles across its receipt, causal dashboard and next-actor handoff."
      : `Outcome: ${useCaseData.outcome}`;
    const rows = closingState
      ? [["Demonstrated", `${useCaseData.processes.length} action-level DFD processes`], ["Workbench", featureData.id], ["Evidence", "State, event, receipt, recovery and handoff"], ["Boundary", "No production or external effect"]]
      : [["Primary record", useCaseData.recordId], ["Actors", useCaseData.actors.join(" · ")], ["Workbench", `${featureData.id} · ${featureData.title}`], ["Mode", "Synthetic · browser memory"]];
    rows.forEach(([label, value]) => {
      const row = document.createElement("span");
      const strong = document.createElement("strong");
      strong.textContent = label;
      row.append(strong, document.createTextNode(value));
      aside.appendChild(row);
    });
    main.append(kicker, heading, summary, outcome);
    element.append(main, aside);
    document.body.appendChild(element);
  }, { closingState: closing, useCaseData: useCase, featureData: feature });
  const clearSlide = async () => page.evaluate(() => document.querySelector(".bc-lib-slide")?.remove());
  return { clearFocus, focusLocator, moveCursor, clickWithCursor, openRoute, showChapter, showSlide, clearSlide };
};

const validateCase = async (browser, baseUrl, useCase, feature) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  try {
    await page.goto(`${baseUrl}/#/demo/workbench/${useCase.id}?feature=${feature.id}&tab=dfd`, { waitUntil: "domcontentloaded" });
    await page.locator("main#main-content").waitFor();
    const processCount = await page.locator(".v32-dfd-canvas article").count();
    if (processCount !== useCase.processes.length) throw new Error(`${useCase.code} DFD expected ${useCase.processes.length}, found ${processCount}`);
    await page.goto(`${baseUrl}/#${feature.route}`, { waitUntil: "domcontentloaded" });
    await page.locator("main#main-content").waitFor();
    if (await page.getByRole("heading", { name: /not found|unavailable/i }).count()) throw new Error(`${useCase.code} product route rendered a missing-record state`);
    await page.goto(`${baseUrl}/#/demo/workbench/${useCase.id}?feature=${feature.id}`, { waitUntil: "domcontentloaded" });
    await page.getByLabel("Active persona").selectOption(personaByFeature[feature.id]);
    for (const action of [feature.primaryAction, feature.exceptionAction, feature.recoveryAction]) {
      const button = page.getByRole("button", { name: action, exact: false });
      if (!(await button.count())) throw new Error(`${useCase.code} missing action: ${action}`);
      await button.click();
    }
    await page.goto(`${baseUrl}/#/demo/control-center`, { waitUntil: "domcontentloaded" });
    if (!(await page.getByRole("row").filter({ hasText: feature.id }).count())) throw new Error(`${useCase.code} missing control-center row`);
    await page.goto(`${baseUrl}/#/demo/handoffs`, { waitUntil: "domcontentloaded" });
    if (!(await page.locator(".v32-handoff-grid article").filter({ hasText: feature.recordId }).count())) throw new Error(`${useCase.code} missing handoff`);
    console.log(`[validated] ${useCase.code} · ${useCase.title}`);
  } finally {
    await context.close();
  }
};

const recordCase = async (browser, baseUrl, useCase, feature) => {
  const folder = caseFolder(useCase);
  const workingDir = join(folder, ".working");
  await rm(folder, { recursive: true, force: true });
  await mkdir(join(workingDir, "video"), { recursive: true });
  const assets = await writeNarrationAssets(useCase, feature, folder, workingDir);
  console.log(`[recording] ${useCase.code} · ${useCase.title} · ${Math.round(assets.totalDuration)} seconds`);
  const context = await browser.newContext({
    viewport: { width: 1600, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "light",
    recordVideo: { dir: join(workingDir, "video"), size: { width: 1600, height: 900 } },
  });
  const page = await context.newPage();
  const pageCreatedAt = Date.now();
  const video = page.video();
  page.setDefaultTimeout(12_000);
  await page.goto(`${baseUrl}/#/demo/workbench/${useCase.id}?feature=${feature.id}`, { waitUntil: "networkidle" });
  const ui = await attachRecordingHelpers(page, useCase, feature);
  await ui.showSlide(false);
  const visualStartOffsetSeconds = (Date.now() - pageCreatedAt) / 1000;

  const handlers = {
    opening: async () => ui.showSlide(false),
    "dfd-overview": async () => {
      await ui.clearSlide();
      await ui.openRoute(`/demo/workbench/${useCase.id}?feature=${feature.id}&tab=dfd`);
      await ui.focusLocator(page.locator(".v32-dfd"));
    },
    "dfd-processes": async (_, duration) => {
      const dwell = Math.max(1_500, (duration * 1000 - 1_000) / useCase.processes.length);
      for (let index = 0; index < useCase.processes.length; index += 1) {
        await page.evaluate((activeIndex) => {
          const articles = [...document.querySelectorAll(".v32-dfd-canvas article")];
          articles.forEach((article, articleIndex) => {
            article.classList.remove("bc-lib-active");
            article.classList.toggle("bc-lib-complete", articleIndex < activeIndex);
          });
          const active = articles[activeIndex];
          active?.classList.add("bc-lib-active");
          if (active && !active.classList.contains("expanded")) active.querySelector("button")?.click();
          active?.scrollIntoView({ block: "center", behavior: "smooth" });
        }, index);
        await page.waitForTimeout(dwell);
      }
    },
    "product-route": async () => {
      await ui.openRoute(feature.route);
      const heading = page.locator("main#main-content h1,main#main-content h2").first();
      await ui.focusLocator((await heading.count()) ? heading : page.locator("main#main-content"));
      await page.waitForTimeout(3_500);
      const contextPanel = page.locator("main#main-content section,main#main-content article,main#main-content .panel").nth(1);
      if (await contextPanel.count()) await ui.focusLocator(contextPanel);
    },
    "workbench-data": async (_, duration) => {
      await ui.openRoute(`/demo/workbench/${useCase.id}?feature=${feature.id}`);
      await page.getByLabel("Active persona").selectOption(personaByFeature[feature.id]);
      const dwell = Math.max(700, (duration * 1000 - 2_000) / feature.fields.length - 450);
      for (const field of feature.fields) {
        const control = page.getByLabel(field.label, { exact: false }).first();
        const label = control.locator("xpath=ancestor::label[1]");
        await ui.focusLocator(label, "bc-lib-field");
        await ui.moveCursor(control);
        await page.waitForTimeout(dwell);
      }
    },
    "primary-action": async () => {
      await ui.clickWithCursor(page.getByRole("button", { name: feature.primaryAction, exact: false }));
      await ui.focusLocator(page.locator(".v32-receipt-card"));
      await page.waitForTimeout(3_200);
      await ui.focusLocator(page.locator(".v32-feature-contracts"));
    },
    "controlled-exception": async () => {
      await ui.clickWithCursor(page.getByRole("button", { name: feature.exceptionAction, exact: false }));
      await ui.focusLocator(page.locator(".v32-current-state"));
      await page.waitForTimeout(2_600);
      await ui.focusLocator(page.locator(".v32-receipt-card"));
    },
    "recovery-evidence": async () => {
      await ui.clickWithCursor(page.getByRole("button", { name: feature.recoveryAction, exact: false }));
      await ui.focusLocator(page.locator(".v32-receipt-card"));
      await page.waitForTimeout(2_400);
      await ui.openRoute("/demo/control-center");
      const row = page.getByRole("row").filter({ hasText: feature.id }).first();
      await ui.focusLocator(row);
      await page.waitForTimeout(2_800);
      await ui.openRoute("/demo/handoffs");
      const handoff = page.locator(".v32-handoff-grid article").filter({ hasText: feature.recordId }).last();
      await ui.focusLocator(handoff);
    },
    closing: async () => ui.showSlide(true),
  };

  try {
    for (const [index, scene] of assets.scenes.entries()) {
      console.log(`[${useCase.code} scene ${index + 1}/${assets.scenes.length}] ${scene.title} · ${assets.durations[index].toFixed(1)}s`);
      const startedAt = Date.now();
      await ui.showChapter(scene);
      await handlers[scene.id](scene, assets.durations[index]);
      await page.waitForTimeout(Math.max(250, assets.durations[index] * 1000 - (Date.now() - startedAt)));
    }
  } finally {
    await context.close();
  }

  const recordedPath = await video.path();
  const rawVideo = join(workingDir, "raw.webm");
  await rename(recordedPath, rawVideo);
  const clientVideo = join(folder, "client-demo.mp4");
  console.log(`[mastering] ${useCase.code}`);
  run("ffmpeg", [
    "-y", "-v", "warning", "-ss", visualStartOffsetSeconds.toFixed(3), "-i", rawVideo,
    "-i", assets.narrationAudio, "-i", assets.captions, "-f", "ffmetadata", "-i", assets.chapters,
    "-map", "0:v:0", "-map", "1:a:0", "-map", "2:0", "-map_metadata", "3", "-map_chapters", "3",
    "-c:v", "libx264", "-preset", "veryfast", "-crf", "19", "-vf", "scale=1920:1080:flags=lanczos,fps=30", "-pix_fmt", "yuv420p",
    "-c:a", "aac", "-af", "aresample=48000,loudnorm=I=-16:TP=-1.5:LRA=11", "-ar", "48000", "-b:a", "160k",
    "-c:s", "mov_text", "-metadata", `title=Recruitment System · ${useCase.code} · ${useCase.title}`,
    "-metadata:s:s:0", "language=eng", "-movflags", "+faststart", "-shortest", clientVideo,
  ]);
  const duration = Number(run("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", clientVideo]).trim());
  run("ffmpeg", ["-y", "-v", "warning", "-ss", "3", "-i", clientVideo, "-frames:v", "1", "-update", "1", join(folder, "thumbnail.png")]);
  run("ffmpeg", ["-y", "-v", "warning", "-i", clientVideo, "-vf", `fps=1/${(duration / 12).toFixed(3)},scale=480:270,tile=4x3`, "-frames:v", "1", "-update", "1", join(folder, "qa-contact-sheet.png")]);

  const sceneMetadata = assets.scenes.map((scene, index) => ({ ...scene, text: undefined, durationSeconds: Number(assets.durations[index].toFixed(3)) }));
  const metadata = {
    id: useCase.code,
    title: useCase.title,
    generatedAt: new Date().toISOString(),
    recordId: useCase.recordId,
    featureId: feature.id,
    videos: { client: "client-demo.mp4", executive: "executive-cut.mp4", evidence: "evidence-master.mp4" },
    captions: "captions.srt",
    transcript: "transcript.md",
    thumbnail: "thumbnail.png",
    qaContactSheet: "qa-contact-sheet.png",
    durationSeconds: Number(duration.toFixed(3)),
    resolution: "1920x1080",
    frameRate: 30,
    audioSampleRate: 48000,
    captionCues: assets.cueNumber,
    embeddedChapters: assets.scenes.length,
    scenes: sceneMetadata,
    productionBoundary: "Synthetic browser-memory wireframe; no external or production effect.",
  };
  await writeFile(join(folder, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);
  await packageExecutiveCut(folder, clientVideo, assets, useCase);
  await replaceLink(clientVideo, join(folder, "evidence-master.mp4"));
  await writeCaseReadme(folder, useCase, feature, metadata);
  await rm(workingDir, { recursive: true, force: true });
  console.log(`[complete] ${useCase.code} · ${folder}`);
};

const parseSrt = (value) => value.trim().split(/\r?\n\r?\n/).map((block) => {
  const lines = block.split(/\r?\n/);
  const parseClock = (clock) => {
    const match = clock.match(/(\d+):(\d+):(\d+),(\d+)/);
    return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000;
  };
  const [start, end] = lines[1].split(" --> ").map(parseClock);
  return { start, end, text: lines.slice(2).join("\n") };
});

async function packageExecutiveCut(folder, clientVideo, assets, useCase) {
  const selectedIds = new Set(["opening", "dfd-overview", "product-route", "primary-action", "controlled-exception", "recovery-evidence", "closing"]);
  let sourceCursor = 0;
  const sourceScenes = assets.scenes.map((scene, index) => {
    const start = sourceCursor;
    sourceCursor += assets.durations[index];
    return { ...scene, start, end: sourceCursor, duration: assets.durations[index] };
  });
  const selected = sourceScenes.filter((scene) => selectedIds.has(scene.id));
  const filter = [];
  const inputs = [];
  selected.forEach((scene, index) => {
    filter.push(`[0:v]trim=start=${scene.start}:end=${scene.end},setpts=PTS-STARTPTS[v${index}]`);
    filter.push(`[0:a]atrim=start=${scene.start}:end=${scene.end},asetpts=PTS-STARTPTS[a${index}]`);
    inputs.push(`[v${index}][a${index}]`);
  });
  filter.push(`${inputs.join("")}concat=n=${selected.length}:v=1:a=1[v][a]`);
  const temporary = join(folder, ".executive-av.mp4");
  run("ffmpeg", ["-y", "-v", "warning", "-i", clientVideo, "-filter_complex", filter.join(";"), "-map", "[v]", "-map", "[a]", "-c:v", "libx264", "-preset", "veryfast", "-crf", "20", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "160k", "-ar", "48000", temporary]);

  const cues = parseSrt(await readFile(assets.captions, "utf8"));
  const remapped = [];
  const chapterLines = [";FFMETADATA1", `title=${useCase.code} · Executive cut`];
  const transcriptLines = [`# ${useCase.code} · ${useCase.title} · Executive cut`, "", "> Synthetic browser-memory demonstration. No external effect.", ""];
  let executiveCursor = 0;
  let cueNumber = 1;
  const executiveScenes = [];
  for (const scene of selected) {
    const start = executiveCursor;
    const end = start + scene.duration;
    executiveScenes.push({ id: scene.id, chapter: scene.chapter, title: scene.title, start, end, durationSeconds: scene.duration });
    chapterLines.push("[CHAPTER]", "TIMEBASE=1/1000", `START=${Math.round(start * 1000)}`, `END=${Math.round(end * 1000)}`, `title=${scene.chapter}: ${scene.title}`);
    for (const cue of cues) {
      if (cue.end <= scene.start || cue.start >= scene.end) continue;
      const cueStart = start + Math.max(0, cue.start - scene.start);
      const cueEnd = start + Math.min(scene.duration, cue.end - scene.start);
      remapped.push(`${cueNumber++}\n${timestamp(cueStart)} --> ${timestamp(cueEnd)}\n${cue.text}`);
    }
    transcriptLines.push(`## ${scene.chapter}: ${scene.title}`, "", scene.text, "");
    executiveCursor = end;
  }
  const executiveCaptions = join(folder, "executive-captions.srt");
  const executiveChapters = join(folder, ".executive-chapters.ffmeta");
  await writeFile(executiveCaptions, `${remapped.join("\n\n")}\n`);
  await writeFile(executiveChapters, `${chapterLines.join("\n")}\n`);
  await writeFile(join(folder, "executive-transcript.md"), transcriptLines.join("\n"));
  const executiveVideo = join(folder, "executive-cut.mp4");
  run("ffmpeg", ["-y", "-v", "warning", "-i", temporary, "-i", executiveCaptions, "-f", "ffmetadata", "-i", executiveChapters, "-map", "0:v:0", "-map", "0:a:0", "-map", "1:0", "-map_metadata", "2", "-map_chapters", "2", "-c:v", "copy", "-c:a", "copy", "-c:s", "mov_text", "-metadata:s:s:0", "language=eng", "-movflags", "+faststart", executiveVideo]);
  run("ffmpeg", ["-y", "-v", "warning", "-ss", "3", "-i", executiveVideo, "-frames:v", "1", "-update", "1", join(folder, "executive-thumbnail.png")]);
  await writeFile(join(folder, "executive.metadata.json"), `${JSON.stringify({ id: `${useCase.code}-EXEC`, title: `${useCase.title} · executive cut`, generatedAt: new Date().toISOString(), durationSeconds: Number(executiveCursor.toFixed(3)), captionCues: remapped.length, embeddedChapters: selected.length, scenes: executiveScenes, productionBoundary: "Synthetic browser-memory wireframe; no external or production effect." }, null, 2)}\n`);
  await rm(temporary, { force: true });
  await rm(executiveChapters, { force: true });
}

async function replaceLink(source, destination) {
  await rm(destination, { force: true });
  try { await link(source, destination); } catch { await copyFile(source, destination); }
}

async function writeCaseReadme(folder, useCase, feature, metadata) {
  const minutes = `${Math.floor(metadata.durationSeconds / 60)}:${String(Math.round(metadata.durationSeconds % 60)).padStart(2, "0")}`;
  const lines = [
    `# ${useCase.code} · ${useCase.title}`,
    "",
    useCase.outcome,
    "",
    `- Primary record: \`${useCase.recordId}\``,
    `- P0 workbench: \`${feature.id}\``,
    `- Client demo: \`client-demo.mp4\` (${minutes}, 1,920×1,080, ${metadata.embeddedChapters} chapters, ${metadata.captionCues} caption cues)`,
    "- Executive cut: `executive-cut.mp4`",
    "- Detailed evidence master: `evidence-master.mp4`",
    "- Accessibility: `captions.srt`, `executive-captions.srt`, `transcript.md` and `executive-transcript.md`",
    "- QA: `metadata.json`, `executive.metadata.json`, `thumbnail.png` and `qa-contact-sheet.png`",
    "",
    "> All people, records and actions are synthetic and browser-memory-only. No external effect is executed.",
    "",
  ];
  await writeFile(join(folder, "README.md"), lines.join("\n"));
}

const seedBusinessCaseOne = async () => {
  const useCase = useCases[0];
  const feature = features.find((candidate) => candidate.id === "WF-P0-04");
  const folder = caseFolder(useCase);
  await rm(folder, { recursive: true, force: true });
  await mkdir(folder, { recursive: true });
  await replaceLink(join(sourceVideoDir, "business-case-01-v2-client-demo.mp4"), join(folder, "client-demo.mp4"));
  await replaceLink(join(sourceVideoDir, "business-case-01-v2-executive-cut.mp4"), join(folder, "executive-cut.mp4"));
  await replaceLink(join(sourceVideoDir, "business-case-01-v2-evidence-master.mp4"), join(folder, "evidence-master.mp4"));
  const copies = [
    ["business-case-01-v2-full-captions.srt", "captions.srt"],
    ["business-case-01-v2-executive-captions.srt", "executive-captions.srt"],
    ["business-case-01-v2-transcript.md", "transcript.md"],
    ["business-case-01-v2-executive-transcript.md", "executive-transcript.md"],
    ["business-case-01-v2-thumbnail.png", "thumbnail.png"],
    ["business-case-01-v2-executive-thumbnail.png", "executive-thumbnail.png"],
    ["business-case-01-v2-qa-contact-sheet.png", "qa-contact-sheet.png"],
  ];
  for (const [source, destination] of copies) await copyFile(join(sourceVideoDir, source), join(folder, destination));
  await copyFile(join(scriptDir, "business-case-01-v2.narration.json"), join(folder, "narration.json"));
  const sourceMetadata = JSON.parse(await readFile(join(sourceVideoDir, "business-case-01-v2.metadata.json"), "utf8"));
  const metadata = { ...sourceMetadata, id: "UC-01", video: "client-demo.mp4", subtitles: "captions.srt", videos: { client: "client-demo.mp4", executive: "executive-cut.mp4", evidence: "evidence-master.mp4" }, captions: "captions.srt", transcript: "transcript.md", thumbnail: "thumbnail.png", qaContactSheet: "qa-contact-sheet.png" };
  await writeFile(join(folder, "metadata.json"), `${JSON.stringify(metadata, null, 2)}\n`);
  const sourceExecutiveMetadata = JSON.parse(await readFile(join(sourceVideoDir, "business-case-01-v2-executive.metadata.json"), "utf8"));
  await writeFile(join(folder, "executive.metadata.json"), `${JSON.stringify(sourceExecutiveMetadata, null, 2)}\n`);
  await writeCaseReadme(folder, useCase, feature, metadata);
};

const writeLibraryIndex = async () => {
  const entries = [];
  for (const useCase of useCases) {
    const folder = caseFolder(useCase);
    const metadata = JSON.parse(await readFile(join(folder, "metadata.json"), "utf8"));
    const executive = JSON.parse(await readFile(join(folder, "executive.metadata.json"), "utf8"));
    entries.push({ code: useCase.code, category: categoryForCode(useCase.code), title: useCase.title, folder: folder.replace(`${libraryDir}/`, ""), recordId: useCase.recordId, clientDurationSeconds: metadata.durationSeconds, executiveDurationSeconds: executive.durationSeconds, chapters: metadata.embeddedChapters, captionCues: metadata.captionCues, resolution: metadata.resolution ?? "1920x1080", qaStatus: "passed" });
  }
  const manifest = { id: "RECRUITMENT-SYSTEM-12-CASE-VIDEO-LIBRARY", generatedAt: new Date().toISOString(), totalBusinessCases: entries.length, videoSetsPerCase: ["client-demo", "executive-cut", "evidence-master"], productionBoundary: "Synthetic browser-memory wireframe; no database, API, provider or external effect.", entries };
  await writeFile(join(libraryDir, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
  const table = entries.map((entry) => `| ${entry.code} | ${entry.category} | [${entry.title}](${entry.folder}/README.md) | ${(entry.clientDurationSeconds / 60).toFixed(1)} min | ${(entry.executiveDurationSeconds / 60).toFixed(1)} min | ${entry.chapters} | ${entry.qaStatus} |`);
  await writeFile(join(libraryDir, "README.md"), [
    "# Recruitment System · 12 Business-Case Video Library",
    "",
    "Each numbered folder is a self-contained demo set with a narrated 1080p client demo, shorter executive cut, detailed evidence master, embedded and sidecar captions, transcript, narration contract, metadata, thumbnails and visual QA contact sheet.",
    "",
    "Validation evidence: [`QA-REPORT.md`](QA-REPORT.md) and [`qa-report.json`](qa-report.json).",
    "",
    "| Case | Category | Business use case | Client | Executive | Chapters | QA |",
    "|---|---|---|---:|---:|---:|---|",
    ...table,
    "",
    "All content uses deterministic synthetic browser-memory data. No production identity, persistence, API, provider, message, signature or downstream-system effect is used.",
    "",
  ].join("\n"));
  const thumbnailGlob = join(libraryDir, "*", "thumbnail.png");
  run("ffmpeg", ["-y", "-v", "warning", "-pattern_type", "glob", "-i", thumbnailGlob, "-vf", "scale=480:270,tile=4x3", "-frames:v", "1", "-update", "1", join(libraryDir, "library-contact-sheet.png")]);
};

await mkdir(libraryDir, { recursive: true });
if (!validateOnly) await seedBusinessCaseOne();

const port = 4182;
const baseUrl = `http://127.0.0.1:${port}`;
const logFile = createWriteStream(join(libraryDir, ".recording-server.log"));
const server = spawn("pnpm", ["exec", "vite", "--host", "127.0.0.1", "--port", String(port), "--strictPort"], { cwd: root, stdio: ["ignore", "pipe", "pipe"] });
server.stdout.pipe(logFile);
server.stderr.pipe(logFile);
for (let attempt = 0; attempt < 60; attempt += 1) {
  try {
    if ((await fetch(baseUrl)).ok) break;
  } catch {}
  if (attempt === 59) throw new Error("Recording server did not become ready");
  await new Promise((resolveWait) => setTimeout(resolveWait, 250));
}

const browser = await chromium.launch({ headless: true });
try {
  const selectedUseCases = useCases.filter((useCase) => requestedCases.has(Number(useCase.code.slice(3))));
  for (const useCase of selectedUseCases) {
    const candidates = features.filter((feature) => feature.useCaseIds.includes(useCase.id));
    const feature = useCase.id === "uc-04" ? candidates.find((candidate) => candidate.id === "WF-P0-07") : candidates[0];
    if (!feature) throw new Error(`No feature for ${useCase.code}`);
    if (validateOnly) await validateCase(browser, baseUrl, useCase, feature);
    else await recordCase(browser, baseUrl, useCase, feature);
  }
} finally {
  await browser.close();
  server.kill("SIGTERM");
  logFile.end();
}

if (!validateOnly) {
  try {
    await writeLibraryIndex();
  } catch (error) {
    if (requestedCases.size === 11) throw error;
    console.log("[index deferred] Remaining business-case folders are not complete yet.");
  }
}
console.log(validateOnly ? "[validated] requested business cases" : `[recording batch complete] ${libraryDir}`);
