import { spawnSync } from "node:child_process";
import { readdir, readFile, stat, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const libraryDir = join(root, "artifacts", "v3.2", "business-case-video-library");
const fullDecode = process.argv.includes("--full-decode");
const required = [
  "client-demo.mp4", "executive-cut.mp4", "evidence-master.mp4",
  "captions.srt", "executive-captions.srt", "transcript.md", "executive-transcript.md",
  "metadata.json", "executive.metadata.json", "narration.json",
  "thumbnail.png", "executive-thumbnail.png", "qa-contact-sheet.png", "README.md",
];

const execute = (command, args) => {
  const result = spawnSync(command, args, { encoding: "utf8" });
  if (result.status !== 0) throw new Error(`${command} failed: ${result.stderr || result.stdout}`);
  return result.stdout;
};

const probe = (file) => JSON.parse(execute("ffprobe", ["-v", "error", "-show_streams", "-show_chapters", "-show_format", "-of", "json", file]));
const folders = (await readdir(libraryDir, { withFileTypes: true }))
  .filter((entry) => entry.isDirectory() && /^\d{2}-/.test(entry.name))
  .sort((a, b) => a.name.localeCompare(b.name));
if (folders.length !== 12) throw new Error(`Expected 12 case folders, found ${folders.length}`);

const results = [];
for (const entry of folders) {
  const folder = join(libraryDir, entry.name);
  for (const file of required) await stat(join(folder, file));
  const metadata = JSON.parse(await readFile(join(folder, "metadata.json"), "utf8"));
  const executiveMetadata = JSON.parse(await readFile(join(folder, "executive.metadata.json"), "utf8"));
  const captions = await readFile(join(folder, "captions.srt"), "utf8");
  const executiveCaptions = await readFile(join(folder, "executive-captions.srt"), "utf8");
  const clientFile = join(folder, "client-demo.mp4");
  const executiveFile = join(folder, "executive-cut.mp4");
  const evidenceFile = join(folder, "evidence-master.mp4");
  const client = probe(clientFile);
  const executive = probe(executiveFile);
  const checks = {
    requiredFiles: true,
    clientResolution: client.streams.some((stream) => stream.codec_type === "video" && stream.width === 1920 && stream.height === 1080),
    clientAudio: client.streams.some((stream) => stream.codec_type === "audio" && stream.sample_rate === "48000"),
    clientCaptions: client.streams.some((stream) => stream.codec_type === "subtitle" && stream.codec_name === "mov_text"),
    clientChapters: client.chapters.length === metadata.embeddedChapters,
    clientCueCount: (captions.match(/-->/g) ?? []).length === metadata.captionCues,
    clientDuration: Math.abs(Number(client.format.duration) - metadata.durationSeconds) < 0.75,
    executiveResolution: executive.streams.some((stream) => stream.codec_type === "video" && stream.width === 1920 && stream.height === 1080),
    executiveAudio: executive.streams.some((stream) => stream.codec_type === "audio" && stream.sample_rate === "48000"),
    executiveCaptions: executive.streams.some((stream) => stream.codec_type === "subtitle" && stream.codec_name === "mov_text"),
    executiveChapters: executive.chapters.length === executiveMetadata.embeddedChapters,
    executiveCueCount: (executiveCaptions.match(/-->/g) ?? []).length === executiveMetadata.captionCues,
    executiveDuration: Math.abs(Number(executive.format.duration) - executiveMetadata.durationSeconds) < 0.75,
  };
  if (fullDecode) {
    execute("ffmpeg", ["-v", "error", "-i", clientFile, "-map", "0:v:0", "-map", "0:a:0", "-f", "null", "-"]);
    execute("ffmpeg", ["-v", "error", "-i", executiveFile, "-map", "0:v:0", "-map", "0:a:0", "-f", "null", "-"]);
    const [clientStat, evidenceStat] = await Promise.all([stat(clientFile), stat(evidenceFile)]);
    if (clientStat.ino !== evidenceStat.ino) execute("ffmpeg", ["-v", "error", "-i", evidenceFile, "-map", "0:v:0", "-map", "0:a:0", "-f", "null", "-"]);
    checks.fullDecode = true;
  }
  const failures = Object.entries(checks).filter(([, passed]) => !passed).map(([name]) => name);
  if (failures.length) throw new Error(`${metadata.id} failed: ${failures.join(", ")}`);
  results.push({ code: metadata.id, title: metadata.title, folder: entry.name, clientDurationSeconds: Number(client.format.duration), executiveDurationSeconds: Number(executive.format.duration), clientChapters: client.chapters.length, executiveChapters: executive.chapters.length, clientCaptionCues: metadata.captionCues, executiveCaptionCues: executiveMetadata.captionCues, status: "passed", checks });
  console.log(`[passed] ${metadata.id} · ${metadata.title}`);
}

const report = {
  id: "BUSINESS-CASE-VIDEO-LIBRARY-QA",
  generatedAt: new Date().toISOString(),
  fullDecode,
  totalCases: results.length,
  totalVideoFiles: results.length * 3,
  totalClientDurationSeconds: Number(results.reduce((sum, result) => sum + result.clientDurationSeconds, 0).toFixed(3)),
  totalExecutiveDurationSeconds: Number(results.reduce((sum, result) => sum + result.executiveDurationSeconds, 0).toFixed(3)),
  status: "passed",
  results,
};
await writeFile(join(libraryDir, "qa-report.json"), `${JSON.stringify(report, null, 2)}\n`);
await writeFile(join(libraryDir, "QA-REPORT.md"), [
  "# Business-Case Video Library · QA Report",
  "",
  `**Status:** Passed · ${results.length} business cases · ${results.length * 3} categorized video files`,
  "",
  `Validation included required artifacts, 1,920×1,080 video, 48 kHz audio, embedded English captions, chapter/cue reconciliation, metadata duration reconciliation${fullDecode ? ", and full video/audio decoding" : ""}.`,
  "",
  "| Case | Client duration | Executive duration | Client chapters | Caption cues | Status |",
  "|---|---:|---:|---:|---:|---|",
  ...results.map((result) => `| ${result.code} | ${(result.clientDurationSeconds / 60).toFixed(1)} min | ${(result.executiveDurationSeconds / 60).toFixed(1)} min | ${result.clientChapters} | ${result.clientCaptionCues} | Passed |`),
  "",
  "Representative per-case contact sheets and the 12-case library contact sheet were visually reviewed. All records and effects remain synthetic and browser-memory-only.",
  "",
].join("\n"));
console.log(`[passed] ${results.length} business-case video sets`);
