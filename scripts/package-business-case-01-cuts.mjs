import { execFileSync } from "node:child_process";
import { readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const projectDir = dirname(scriptDir);
const outputDir = join(projectDir, "artifacts", "v3.2", "videos");
const sourceVideo = join(outputDir, "business-case-01-v2-client-demo.mp4");
const sourceCaptions = join(outputDir, "business-case-01-v2-full-captions.srt");
const narration = JSON.parse(readFileSync(join(scriptDir, "business-case-01-v2.narration.json"), "utf8"));
const sourceMetadata = JSON.parse(readFileSync(join(outputDir, "business-case-01-v2.metadata.json"), "utf8"));

const executiveSceneIds = [
  "opening",
  "dfd-intro",
  "manager-demand",
  "publication",
  "candidate-outcome",
  "channel-failure",
  "channel-recovery",
  "closing",
];

let sourceCursor = 0;
const sourceScenes = sourceMetadata.scenes.map((scene) => {
  const start = sourceCursor;
  sourceCursor += scene.durationSeconds;
  return { ...scene, start, end: sourceCursor };
});
const selected = executiveSceneIds.map((id) => {
  const scene = sourceScenes.find((candidate) => candidate.id === id);
  if (!scene) throw new Error(`Missing source scene: ${id}`);
  return scene;
});

const run = (args) => execFileSync("ffmpeg", args, { stdio: "inherit" });
const executiveBase = join(outputDir, "business-case-01-v2-executive");
const avTemp = `${executiveBase}.av-temp.mp4`;
const executiveVideo = `${executiveBase}-cut.mp4`;
const executiveCaptions = `${executiveBase}-captions.srt`;
const executiveTranscript = `${executiveBase}-transcript.md`;
const executiveThumbnail = `${executiveBase}-thumbnail.png`;
const executiveMetadata = `${executiveBase}.metadata.json`;
const chapterMetadata = `${executiveBase}.chapters.txt`;
const evidenceVideo = join(outputDir, "business-case-01-v2-evidence-master.mp4");

const filterParts = [];
const concatInputs = [];
selected.forEach((scene, index) => {
  filterParts.push(`[0:v]trim=start=${scene.start}:end=${scene.end},setpts=PTS-STARTPTS[v${index}]`);
  filterParts.push(`[0:a]atrim=start=${scene.start}:end=${scene.end},asetpts=PTS-STARTPTS[a${index}]`);
  concatInputs.push(`[v${index}][a${index}]`);
});
filterParts.push(`${concatInputs.join("")}concat=n=${selected.length}:v=1:a=1[v][a]`);

run([
  "-y", "-v", "warning", "-i", sourceVideo,
  "-filter_complex", filterParts.join(";"),
  "-map", "[v]", "-map", "[a]",
  "-c:v", "libx264", "-preset", "medium", "-crf", "18", "-pix_fmt", "yuv420p",
  "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-movflags", "+faststart",
  avTemp,
]);

const parseClock = (value) => {
  const match = value.match(/(\d+):(\d+):(\d+),(\d+)/);
  if (!match) throw new Error(`Invalid SRT timestamp: ${value}`);
  return Number(match[1]) * 3600 + Number(match[2]) * 60 + Number(match[3]) + Number(match[4]) / 1000;
};
const formatClock = (seconds) => {
  const totalMs = Math.max(0, Math.round(seconds * 1000));
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const secs = Math.floor((totalMs % 60_000) / 1000);
  const ms = totalMs % 1000;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")},${String(ms).padStart(3, "0")}`;
};
const cues = readFileSync(sourceCaptions, "utf8").trim().split(/\r?\n\r?\n/).map((block) => {
  const lines = block.split(/\r?\n/);
  const [start, end] = lines[1].split(" --> ").map(parseClock);
  return { start, end, text: lines.slice(2).join("\n") };
});

let executiveCursor = 0;
let cueNumber = 1;
const remappedCues = [];
const chapterLines = [
  ";FFMETADATA1",
  "title=Business Case 01 · Executive cut",
  "comment=Synthetic browser-memory wireframe; no external effect.",
];
const executiveScenes = [];
for (const scene of selected) {
  const duration = scene.end - scene.start;
  const executiveStart = executiveCursor;
  const executiveEnd = executiveStart + duration;
  const narrationScene = narration.scenes.find((candidate) => candidate.id === scene.id);
  executiveScenes.push({ ...scene, start: executiveStart, end: executiveEnd });
  chapterLines.push(
    "[CHAPTER]",
    "TIMEBASE=1/1000",
    `START=${Math.round(executiveStart * 1000)}`,
    `END=${Math.round(executiveEnd * 1000)}`,
    `title=${narrationScene.chapter}: ${narrationScene.title}`,
  );
  for (const cue of cues) {
    if (cue.end <= scene.start || cue.start >= scene.end) continue;
    const start = executiveStart + Math.max(0, cue.start - scene.start);
    const end = executiveStart + Math.min(duration, cue.end - scene.start);
    remappedCues.push(`${cueNumber++}\n${formatClock(start)} --> ${formatClock(end)}\n${cue.text}`);
  }
  executiveCursor = executiveEnd;
}
writeFileSync(executiveCaptions, `${remappedCues.join("\n\n")}\n`);
writeFileSync(chapterMetadata, `${chapterLines.join("\n")}\n`);
writeFileSync(executiveTranscript, [
  "# Business Case 01 · Executive cut",
  "",
  "> Synthetic browser-memory wireframe. No database, API, identity provider or external delivery is used.",
  "",
  ...selected.flatMap((scene) => {
    const source = narration.scenes.find((candidate) => candidate.id === scene.id);
    return [`## ${source.chapter} · ${source.title}`, "", source.text, ""];
  }),
].join("\n"));

run([
  "-y", "-v", "warning", "-i", avTemp, "-i", executiveCaptions, "-i", chapterMetadata,
  "-map", "0:v:0", "-map", "0:a:0", "-map", "1:0",
  "-map_metadata", "2", "-map_chapters", "2",
  "-c:v", "copy", "-c:a", "copy", "-c:s", "mov_text", "-metadata:s:s:0", "language=eng",
  "-movflags", "+faststart", executiveVideo,
]);
run(["-y", "-v", "warning", "-ss", "8", "-i", executiveVideo, "-frames:v", "1", "-update", "1", executiveThumbnail]);
run([
  "-y", "-v", "warning", "-i", sourceVideo, "-map", "0", "-map_metadata", "0", "-map_chapters", "0",
  "-c", "copy", "-metadata", "title=Business Case 01 · Detailed evidence master", evidenceVideo,
]);

writeFileSync(executiveMetadata, `${JSON.stringify({
  id: "BC-01-V2-EXEC",
  title: "Hiring demand to published job · executive cut",
  generatedAt: new Date().toISOString(),
  source: "business-case-01-v2-client-demo.mp4",
  video: executiveVideo.replace(`${projectDir}/`, ""),
  subtitles: executiveCaptions.replace(`${projectDir}/`, ""),
  transcript: executiveTranscript.replace(`${projectDir}/`, ""),
  thumbnail: executiveThumbnail.replace(`${projectDir}/`, ""),
  durationSeconds: Number(executiveCursor.toFixed(3)),
  scenes: executiveScenes,
  captionCues: remappedCues.length,
  embeddedChapters: selected.length,
  productionBoundary: sourceMetadata.productionBoundary,
}, null, 2)}\n`);

rmSync(avTemp, { force: true });
rmSync(chapterMetadata, { force: true });
console.log(`[complete] ${executiveVideo}`);
console.log(`[complete] ${evidenceVideo}`);
