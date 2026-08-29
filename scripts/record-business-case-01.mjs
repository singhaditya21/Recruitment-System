import { spawn, spawnSync } from "node:child_process";
import { createWriteStream } from "node:fs";
import { mkdir, readFile, rename, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "@playwright/test";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const root = resolve(scriptDir, "..");
const config = JSON.parse(
  await readFile(join(scriptDir, "business-case-01-v2.narration.json"), "utf8"),
);
const outputDir = join(root, "artifacts", "v3.2", "videos");
const workingDir = join(outputDir, ".bc01-v2-working");
const audioDir = join(workingDir, "audio");
const rawVideoDir = join(workingDir, "video");
const finalVideo = join(
  outputDir,
  "business-case-01-v2-client-demo.mp4",
);
const subtitles = join(
  outputDir,
  "business-case-01-v2-full-captions.srt",
);
const thumbnail = join(
  outputDir,
  "business-case-01-v2-thumbnail.png",
);
const transcript = join(outputDir, "business-case-01-v2-transcript.md");
const metadata = join(outputDir, "business-case-01-v2.metadata.json");
const narrationAudio = join(workingDir, "business-case-01-v2-narration.wav");
const chapterMetadata = join(workingDir, "business-case-01-v2-chapters.ffmeta");

await rm(workingDir, { recursive: true, force: true });
await mkdir(audioDir, { recursive: true });
await mkdir(rawVideoDir, { recursive: true });

const run = (command, args, options = {}) => {
  const result = spawnSync(command, args, {
    cwd: root,
    encoding: "utf8",
    ...options,
  });
  if (result.status !== 0)
    throw new Error(
      command + " failed: " + (result.stderr || result.stdout),
    );
  return result.stdout;
};

const timestamp = (seconds) => {
  const milliseconds = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(milliseconds / 3_600_000);
  const minutes = Math.floor((milliseconds % 3_600_000) / 60_000);
  const secs = Math.floor((milliseconds % 60_000) / 1000);
  const millis = milliseconds % 1000;
  return (
    String(hours).padStart(2, "0") +
    ":" +
    String(minutes).padStart(2, "0") +
    ":" +
    String(secs).padStart(2, "0") +
    "," +
    String(millis).padStart(3, "0")
  );
};

const audioFiles = [];
const durations = [];
for (const [index, scene] of config.scenes.entries()) {
  const audioPath = join(
    audioDir,
    String(index + 1).padStart(2, "0") + "-" + scene.id + ".aiff",
  );
  console.log(
    "[audio " +
      (index + 1) +
      "/" +
      config.scenes.length +
      "] " +
      scene.title,
  );
  run("/usr/bin/say", [
    "-v",
    config.voice,
    "-r",
    String(config.rate),
    "-o",
    audioPath,
    scene.text,
  ]);
  const duration = Number(
    run("/opt/homebrew/bin/ffprobe", [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=noprint_wrappers=1:nokey=1",
      audioPath,
    ]).trim(),
  );
  audioFiles.push(audioPath);
  durations.push(duration);
}

const concatFile = join(workingDir, "audio-concat.txt");
await writeFile(
  concatFile,
  audioFiles
    .map((audioPath) => "file '" + audioPath.replaceAll("'", "'\\''") + "'")
    .join("\n"),
);
run("/opt/homebrew/bin/ffmpeg", [
  "-y",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  concatFile,
  "-c:a",
  "pcm_s16le",
  narrationAudio,
]);

const wrapCaption = (value, width = 72) => {
  const words = value.trim().split(/\s+/);
  const lines = [];
  let line = "";
  for (const word of words) {
    if (line && `${line} ${word}`.length > width) {
      lines.push(line);
      line = word;
    } else line = line ? `${line} ${word}` : word;
  }
  if (line) lines.push(line);
  return lines.join("\n");
};

let totalDuration = 0;
let captionNumber = 0;
const subtitleBlocks = [];
const chapterLines = [";FFMETADATA1"];
const transcriptSections = [
  `# ${config.title}`,
  "",
  "Synthetic browser-memory product demonstration. No external system is changed.",
  "",
];
for (const [index, scene] of config.scenes.entries()) {
  const sceneStart = totalDuration;
  const sceneEnd = sceneStart + durations[index];
  const sentences =
    scene.text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((item) => item.trim()) ??
    [scene.text];
  const weights = sentences.map((sentence) => sentence.split(/\s+/).length);
  const totalWeight = weights.reduce((sum, value) => sum + value, 0);
  let usedWeight = 0;
  for (const [sentenceIndex, sentence] of sentences.entries()) {
    const start =
      sceneStart + (durations[index] * usedWeight) / totalWeight;
    usedWeight += weights[sentenceIndex];
    const end =
      sentenceIndex === sentences.length - 1
        ? sceneEnd
        : sceneStart + (durations[index] * usedWeight) / totalWeight;
    captionNumber += 1;
    subtitleBlocks.push(
      `${captionNumber}\n${timestamp(start)} --> ${timestamp(end)}\n${wrapCaption(sentence)}\n`,
    );
  }
  chapterLines.push(
    "[CHAPTER]",
    "TIMEBASE=1/1000",
    `START=${Math.round(sceneStart * 1000)}`,
    `END=${Math.round(sceneEnd * 1000)}`,
    `title=${scene.chapter}: ${scene.title}`,
  );
  transcriptSections.push(
    `## ${timestamp(sceneStart).slice(0, 8).replaceAll(",", ".")} · ${scene.chapter}: ${scene.title}`,
    "",
    scene.text,
    "",
  );
  totalDuration = sceneEnd;
}
await writeFile(subtitles, subtitleBlocks.join("\n"));
await writeFile(chapterMetadata, chapterLines.join("\n") + "\n");
await writeFile(transcript, transcriptSections.join("\n"));

const port = 4178;
const baseUrl = "http://127.0.0.1:" + port;
const serverLog = createWriteStream(join(workingDir, "vite.log"));
const server = spawn(
  "pnpm",
  [
    "exec",
    "vite",
    "--host",
    "127.0.0.1",
    "--port",
    String(port),
    "--strictPort",
  ],
  { cwd: root, stdio: ["ignore", "pipe", "pipe"] },
);
server.stdout.pipe(serverLog);
server.stderr.pipe(serverLog);

const waitForServer = async () => {
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      const response = await fetch(baseUrl);
      if (response.ok) return;
    } catch {}
    await new Promise((resolveWait) => setTimeout(resolveWait, 200));
  }
  throw new Error("Vite recording server did not become ready");
};

await waitForServer();
console.log(
  "[recording] " +
    config.title +
    " · " +
    Math.round(totalDuration) +
    " seconds of narration",
);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1600, height: 900 },
  deviceScaleFactor: 1,
  colorScheme: "light",
  recordVideo: { dir: rawVideoDir, size: { width: 1600, height: 900 } },
});
const page = await context.newPage();
const pageCreatedAt = Date.now();
const video = page.video();
page.setDefaultTimeout(12_000);
await page.goto(baseUrl + "/#/demo/workbench/uc-01", {
  waitUntil: "networkidle",
});

const recordingCss = [
  "html { scroll-behavior: smooth !important; }",
  "* { transition-duration: .45s !important; }",
  ".demo-floating-launcher,.demo-presenter-dock { display: none !important; }",
  ".bc01-chapter { position: fixed; z-index: 9998; bottom: .8rem; left: .8rem; display: grid; gap: .1rem; max-width: 18rem; border: 1px solid rgba(255,255,255,.35); border-radius: .55rem; padding: .48rem .62rem; color: white; background: rgba(13,54,46,.94); box-shadow: 0 12px 30px rgba(0,0,0,.2); font-family: Arial,sans-serif; }",
  ".bc01-chapter small { color: #a9e7cf; font-size: .54rem; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }",
  ".bc01-chapter strong { font-size: .72rem; line-height: 1.2; }",
  ".bc01-title-slide { position: fixed; z-index: 9999; inset: 0; display: grid; grid-template-columns: minmax(0,1.35fr) minmax(22rem,.65fr); gap: 3rem; align-items: center; padding: 5rem 7rem; color: white; background: radial-gradient(circle at 80% 15%,rgba(145,225,194,.3),transparent 30%),linear-gradient(135deg,#0c332c,#176652 60%,#2a8c70); font-family: Arial,sans-serif; }",
  ".bc01-title-slide .kicker { color: #9fe1c8; font-size: .86rem; font-weight: 900; letter-spacing: .12em; text-transform: uppercase; }",
  ".bc01-title-slide h1 { max-width: 56rem; margin: .7rem 0 1rem; font-size: 4.6rem; line-height: .95; letter-spacing: -.055em; }",
  ".bc01-title-slide p { max-width: 55rem; color: #d7ebe4; font-size: 1.15rem; line-height: 1.6; }",
  ".bc01-title-slide .outcome { border-left: 4px solid #91e1c2; padding-left: 1.1rem; color: white; font-weight: 700; }",
  ".bc01-title-slide aside { display: grid; gap: .8rem; border: 1px solid rgba(255,255,255,.22); border-radius: 1rem; padding: 1.3rem; background: rgba(4,36,29,.34); }",
  ".bc01-title-slide aside span { display: grid; gap: .2rem; border-bottom: 1px solid rgba(255,255,255,.15); padding-bottom: .7rem; color: #d8ebe5; font-size: .82rem; }",
  ".bc01-title-slide aside strong { color: #9fe1c8; font-size: .67rem; text-transform: uppercase; }",
  ".v32-dfd-canvas article.bc01-active { outline: 4px solid #f0ad35 !important; background: #fff4d9 !important; box-shadow: 0 0 0 8px rgba(240,173,53,.18),0 18px 45px rgba(81,58,14,.2) !important; transform: scale(1.012); }",
  ".v32-dfd-canvas article.bc01-complete { border-color: #42a984 !important; background: #e3f5ed !important; }",
  ".bc01-focus { outline: 4px solid #f0ad35 !important; outline-offset: 5px; box-shadow: 0 16px 45px rgba(71,53,15,.2) !important; }",
  ".bc01-field-focus { outline: 4px solid #f0ad35 !important; outline-offset: 3px; border-radius: .35rem; background: #fff8e7 !important; }",
  ".bc01-cursor { position: fixed; z-index: 10001; width: 22px; height: 22px; border: 3px solid white; border-radius: 50%; pointer-events: none; background: #f0ad35; box-shadow: 0 0 0 5px rgba(240,173,53,.28),0 5px 14px rgba(0,0,0,.25); transform: translate(-50%,-50%); transition: left .55s ease,top .55s ease,transform .18s ease !important; }",
  ".bc01-cursor.clicking { transform: translate(-50%,-50%) scale(.65); }",
  ".bc01-flow-token { position: absolute; z-index: 4; top: 1.2rem; left: 4rem; width: 14px; height: 14px; border: 3px solid white; border-radius: 50%; background: #f0ad35; box-shadow: 0 0 0 5px rgba(240,173,53,.25); animation: bc01-flow 2.8s ease-in-out infinite; }",
  ".v32-dfd-canvas article { position: relative; }",
  "@keyframes bc01-flow { 0% { left: 5%; } 48% { left: 48%; } 100% { left: 88%; } }",
].join("\n");
await page.addStyleTag({ content: recordingCss });

const showChapter = async (scene) => {
  await page.evaluate((sceneData) => {
    document.querySelector(".bc01-chapter")?.remove();
    const element = document.createElement("div");
    const chapter = document.createElement("small");
    const title = document.createElement("strong");
    element.className = "bc01-chapter";
    chapter.textContent = sceneData.chapter;
    title.textContent = sceneData.title;
    element.append(chapter, title);
    document.body.appendChild(element);
  }, scene);
};

const showSlide = async (closing) => {
  await page.evaluate((isClosing) => {
    document.querySelector(".bc01-title-slide")?.remove();
    const element = document.createElement("div");
    element.className = "bc01-title-slide";
    const main = document.createElement("div");
    const kicker = document.createElement("span");
    const heading = document.createElement("h1");
    const summary = document.createElement("p");
    const outcome = document.createElement("p");
    const aside = document.createElement("aside");
    kicker.className = "kicker";
    outcome.className = "outcome";
    if (isClosing) {
      kicker.textContent = "Business Case 01 · Complete";
      heading.textContent = "Approved demand to reconciled posting";
      summary.textContent =
        "Controlled demand → exact-version approval → job and individual openings → immutable posting version → channel reconciliation.";
      outcome.textContent =
        "The same synthetic record now reconciles across the action receipt, audit timeline, causal dashboard and cross-persona handoff.";
      [
        ["Demonstrated", "5 action-level DFD processes"],
        ["Workbenches", "WF-P0-03 and WF-P0-04"],
        ["Evidence", "Versions, events, receipts, rules and recovery"],
        ["Boundary", "No real publication or external write"],
      ].forEach(([label, value]) => {
        const row = document.createElement("span");
        const strong = document.createElement("strong");
        strong.textContent = label;
        row.append(strong, document.createTextNode(value));
        aside.appendChild(row);
      });
    } else {
      kicker.textContent = "Recruitment System · Business Case 01";
      heading.textContent = "Hiring demand to published job";
      summary.textContent =
        "A hiring manager requests approved capacity. Finance and compensation approve the exact version. Recruiting creates the job, openings and immutable posting version, then reconciles every delivery channel.";
      outcome.textContent =
        "Outcome: a public posting that is traceable to approved headcount and individual openings.";
      [
        ["Primary actors", "Hiring Manager · Recruiter"],
        ["Approvers", "Finance · Compensation"],
        ["Business objects", "Requisition · Job · Opening · Posting Version"],
        ["Demo mode", "Synthetic · browser memory · no external writes"],
      ].forEach(([label, value]) => {
        const row = document.createElement("span");
        const strong = document.createElement("strong");
        strong.textContent = label;
        row.append(strong, document.createTextNode(value));
        aside.appendChild(row);
      });
    }
    main.append(kicker, heading, summary, outcome);
    element.append(main, aside);
    document.body.appendChild(element);
  }, closing);
};

const clearSlide = async () =>
  page.evaluate(() => document.querySelector(".bc01-title-slide")?.remove());

const clearFocus = async () =>
  page.evaluate(() =>
    document
      .querySelectorAll(".bc01-focus,.bc01-field-focus")
      .forEach((element) =>
        element.classList.remove("bc01-focus", "bc01-field-focus"),
      ),
  );

const focus = async (selector) => {
  await clearFocus();
  const locator = page.locator(selector).first();
  await locator.scrollIntoViewIfNeeded();
  await locator.evaluate((element) => element.classList.add("bc01-focus"));
};

const moveCursor = async (locator) => {
  const box = await locator.boundingBox();
  if (!box) return;
  await page.evaluate(({ x, y }) => {
    let cursor = document.querySelector(".bc01-cursor");
    if (!cursor) {
      cursor = document.createElement("div");
      cursor.className = "bc01-cursor";
      document.body.appendChild(cursor);
    }
    cursor.style.left = `${x}px`;
    cursor.style.top = `${y}px`;
  }, { x: box.x + box.width / 2, y: box.y + box.height / 2 });
  await page.waitForTimeout(600);
};

const clickWithCursor = async (locator) => {
  await locator.scrollIntoViewIfNeeded();
  await moveCursor(locator);
  await page.evaluate(() =>
    document.querySelector(".bc01-cursor")?.classList.add("clicking"),
  );
  await page.waitForTimeout(180);
  await locator.click();
  await page.evaluate(() =>
    document.querySelector(".bc01-cursor")?.classList.remove("clicking"),
  );
  await page.waitForTimeout(550);
};

const focusField = async (label) => {
  await clearFocus();
  const control = page.getByLabel(label, { exact: false }).first();
  await control.scrollIntoViewIfNeeded();
  const wrapper = control.locator("xpath=ancestor::label[1]");
  await wrapper.evaluate((element) => element.classList.add("bc01-field-focus"));
  await moveCursor(control);
};

const focusFields = async (labels, dwellMilliseconds = 1150) => {
  for (const label of labels) {
    await focusField(label);
    await page.waitForTimeout(dwellMilliseconds);
  }
};

const openRoute = async (hash) => {
  await page.goto(baseUrl + "/#" + hash, { waitUntil: "domcontentloaded" });
  await page.locator("main#main-content").waitFor({ state: "visible" });
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
};

const highlightDfd = async (index) => {
  await page.evaluate((activeIndex) => {
    const articles = [
      ...document.querySelectorAll(".v32-dfd-canvas article"),
    ];
    articles.forEach((article, articleIndex) => {
      article.classList.remove("bc01-active");
      article.classList.toggle("bc01-complete", articleIndex < activeIndex);
      article.querySelector(".bc01-flow-token")?.remove();
    });
    const active = articles[activeIndex];
    active?.classList.add("bc01-active");
    if (active && !active.classList.contains("expanded"))
      active.querySelector("button")?.click();
    if (active) {
      const token = document.createElement("span");
      token.className = "bc01-flow-token";
      token.setAttribute("aria-hidden", "true");
      active.appendChild(token);
    }
    active?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, index);
};

const handlers = {
  opening: async () => showSlide(false),
  "dfd-intro": async () => {
    await clearSlide();
    await clickWithCursor(page.getByRole("tab", { name: "dfd" }));
    await focus(".v32-dfd");
  },
  "dfd-1": async () => highlightDfd(0),
  "dfd-2": async () => highlightDfd(1),
  "dfd-3": async () => highlightDfd(2),
  "dfd-4": async () => highlightDfd(3),
  "dfd-5": async () => highlightDfd(4),
  "manager-demand": async () => {
    await openRoute("/manager/recruiting/REQ-DEMO-001");
    await focusFields([
      "Workforce plan",
      "Position",
      "Location",
      "Approved openings",
      "Target start",
      "Budget reference",
      "Business justification",
    ], 950);
    await focus(".manager-privacy");
  },
  "requisition-submit": async () => {
    await openRoute("/demo/workbench/uc-01?feature=WF-P0-03");
    await page.getByLabel("Active persona").selectOption("Hiring Manager");
    await focusFields([
      "Workforce plan",
      "Position",
      "Openings",
      "Budget",
      "Compensation band",
      "Target start",
    ], 800);
    await page.waitForTimeout(2200);
    await clickWithCursor(
      page.getByRole("button", { name: /Submit exact requisition version/i }),
    );
    await focus(".v32-receipt-card");
  },
  "finance-approval": async () => {
    const persona = page.getByLabel("Active persona");
    await moveCursor(persona);
    await persona.selectOption("Finance Approver");
    await focusField("Budget");
    await page.waitForTimeout(2600);
    await clickWithCursor(
      page.getByRole("button", { name: /Record Finance approval/i }),
    );
    await focus(".v32-receipt-card");
  },
  "compensation-approval": async () => {
    const persona = page.getByLabel("Active persona");
    await moveCursor(persona);
    await persona.selectOption("Compensation Approver");
    await focusField("Compensation band");
    await page.waitForTimeout(2600);
    await clickWithCursor(
      page.getByRole("button", { name: /Record Compensation approval/i }),
    );
    await focus(".v32-receipt-card");
  },
  "job-edit": async () => {
    await openRoute("/hr/jobs/JOB-DEMO-001/edit");
    await focusFields([
      "Job title",
      "Team",
      "Job location",
      "Approved openings",
      "Compensation range",
      "Public URL slug",
      "Role summary",
      "Structured requirements",
    ], 1800);
    await page.waitForTimeout(6500);
    await clickWithCursor(
      page.getByRole("button", { name: /Save job changes/i }),
    );
    await page.locator(".job-workspace-grid").waitFor();
  },
  "job-readiness": async () => {
    const scenario = page.getByLabel("Choose synthetic scenario");
    await moveCursor(scenario);
    await scenario.selectOption("SCN-001");
    await focus(".context-strip");
    await page.waitForTimeout(2600);
    await focus(".job-workspace-grid");
  },
  "publication-prep": async () => {
    await openRoute("/demo/workbench/uc-01?feature=WF-P0-04");
    await page.getByLabel("Active persona").selectOption("Recruiter");
    await focusFields([
      "Requisition",
      "Job",
      "Openings",
      "Posting",
      "Posting version",
      "Channels",
    ], 800);
    await focus(".v32-channel-ledger");
  },
  publication: async () => {
    await clickWithCursor(
      page.getByRole("button", { name: /Publish posting version 7/i }),
    );
    await focus(".v32-receipt-card");
    await page.waitForTimeout(3600);
    await focus(".v32-channel-ledger");
    await page.waitForTimeout(2600);
    await openRoute("/hr/jobs/JOB-DEMO-001");
    await focus(".context-strip");
  },
  "candidate-outcome": async () => {
    await clickWithCursor(
      page.getByRole("button", { name: /Preview public job/i }),
    );
    await page.locator(".job-detail-grid").waitFor();
    await focus(".job-detail-heading");
    await page.waitForTimeout(2400);
    await focus(".job-facts");
    await page.waitForTimeout(2400);
    await focus(".apply-card");
  },
  "channel-failure": async () => {
    await openRoute("/demo/workbench/uc-01?feature=WF-P0-04");
    await clickWithCursor(
      page.getByRole("button", { name: /Simulate channel mismatch/i }),
    );
    const linkedIn = page
      .locator(".v32-channel-ledger > div")
      .filter({ hasText: "LinkedIn" });
    await linkedIn.scrollIntoViewIfNeeded();
    await clearFocus();
    await linkedIn.evaluate((element) => element.classList.add("bc01-focus"));
  },
  "channel-recovery": async () => {
    await clickWithCursor(
      page.getByRole("button", { name: /Reconcile failed channel/i }),
    );
    const linkedIn = page
      .locator(".v32-channel-ledger > div")
      .filter({ hasText: "LinkedIn" });
    await clearFocus();
    await linkedIn.evaluate((element) => element.classList.add("bc01-focus"));
    await page.waitForTimeout(2800);
    await focus(".v32-receipt-card");
  },
  analytics: async () => {
    await openRoute("/demo/control-center");
    await focus(".v32-kpi-grid");
    await page.waitForTimeout(2600);
    const publicationRow = page
      .getByRole("row")
      .filter({ hasText: "WF-P0-04" });
    await clearFocus();
    await publicationRow.evaluate((element) => element.classList.add("bc01-focus"));
    await page.waitForTimeout(3000);
    await clickWithCursor(publicationRow.getByRole("link", { name: "Open" }));
    await focus(".v32-receipt-card");
  },
  handoff: async () => {
    await openRoute("/demo/handoffs");
    const recruiterHandoff = page
      .locator(".v32-handoff-grid article")
      .filter({ hasText: "Recruiter receives approved demand" })
      .first();
    await clearFocus();
    await recruiterHandoff.evaluate((element) =>
      element.classList.add("bc01-focus"),
    );
    await page.waitForTimeout(3000);
    await clickWithCursor(
      recruiterHandoff.getByRole("button", { name: /Acknowledge/i }),
    );
  },
  closing: async () => showSlide(true),
};

// Prime the first frame with the use-case slide, then trim browser setup time
// from the mastered recording so narration and visuals begin together.
await showSlide(false);
const visualStartOffsetSeconds = (Date.now() - pageCreatedAt) / 1000;

try {
  for (const [index, scene] of config.scenes.entries()) {
    console.log(
      "[scene " +
        (index + 1) +
        "/" +
        config.scenes.length +
        "] " +
        scene.title +
        " · " +
        durations[index].toFixed(1) +
        "s",
    );
    const sceneStartedAt = Date.now();
    await showChapter(scene);
    const handler = handlers[scene.id];
    if (!handler) throw new Error("No visual handler for " + scene.id);
    await handler();
    const visualActionMilliseconds = Date.now() - sceneStartedAt;
    await page.waitForTimeout(
      Math.max(250, durations[index] * 1000 - visualActionMilliseconds),
    );
  }
} finally {
  await context.close();
  await browser.close();
  server.kill("SIGTERM");
  serverLog.end();
}

const recordedPath = await video.path();
const rawVideo = join(workingDir, "business-case-01-v2-raw.webm");
await rename(recordedPath, rawVideo);
console.log("[mastering] Muxing narration, video and captions");
run("/opt/homebrew/bin/ffmpeg", [
  "-y",
  "-ss",
  visualStartOffsetSeconds.toFixed(3),
  "-i",
  rawVideo,
  "-i",
  narrationAudio,
  "-i",
  subtitles,
  "-f",
  "ffmetadata",
  "-i",
  chapterMetadata,
  "-map",
  "0:v:0",
  "-map",
  "1:a:0",
  "-map",
  "2:0",
  "-map_metadata",
  "3",
  "-map_chapters",
  "3",
  "-c:v",
  "libx264",
  "-preset",
  "medium",
  "-crf",
  "18",
  "-vf",
  "scale=1920:1080:flags=lanczos,fps=30",
  "-pix_fmt",
  "yuv420p",
  "-c:a",
  "aac",
  "-af",
  "aresample=48000,loudnorm=I=-16:TP=-1.5:LRA=11",
  "-ar",
  "48000",
  "-b:a",
  "160k",
  "-c:s",
  "mov_text",
  "-metadata",
  "title=Recruitment System - Business Case 01 - Client Demo v2",
  "-metadata:s:s:0",
  "language=eng",
  "-movflags",
  "+faststart",
  "-shortest",
  finalVideo,
]);
run("/opt/homebrew/bin/ffmpeg", [
  "-y",
  "-ss",
  "00:00:03",
  "-i",
  finalVideo,
  "-frames:v",
  "1",
  thumbnail,
]);

const finalDuration = Number(
  run("/opt/homebrew/bin/ffprobe", [
    "-v",
    "error",
    "-show_entries",
    "format=duration",
    "-of",
    "default=noprint_wrappers=1:nokey=1",
    finalVideo,
  ]).trim(),
);
await writeFile(
  metadata,
  JSON.stringify(
    {
      id: config.id,
      title: config.title,
      generatedAt: new Date().toISOString(),
      video: finalVideo.replace(root + "/", ""),
      subtitles: subtitles.replace(root + "/", ""),
      transcript: transcript.replace(root + "/", ""),
      thumbnail: thumbnail.replace(root + "/", ""),
      voice: config.voice,
      narrationRate: config.rate,
      durationSeconds: Number(finalDuration.toFixed(3)),
      scenes: config.scenes.map((scene, index) => ({
        id: scene.id,
        chapter: scene.chapter,
        title: scene.title,
        durationSeconds: Number(durations[index].toFixed(3)),
      })),
      resolution: "1920x1080",
      frameRate: 30,
      audioSampleRate: 48000,
      captionCues: captionNumber,
      embeddedChapters: config.scenes.length,
      productionBoundary:
        "Synthetic browser-memory wireframe; no external job publication or production effect.",
    },
    null,
    2,
  ) + "\n",
);
await rm(workingDir, { recursive: true, force: true });
console.log("[complete] " + finalVideo);
