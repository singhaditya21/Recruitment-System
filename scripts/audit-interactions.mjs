import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const componentRoot = path.join(root, "src", "components");
const files = fs.readdirSync(componentRoot).filter((name) => name.endsWith(".tsx"));
const defects = [];
const totals = { files: files.length, buttons: 0, handlerBacked: 0, submitBacked: 0, intentionallyDisabled: 0, links: 0, routeDeclarations: 0 };

function openingTags(source, tag) {
  const tags = [];
  const pattern = new RegExp(`<${tag}(?=[\\s>])`, "g");
  for (let match = pattern.exec(source); match; match = pattern.exec(source)) {
    const start = match.index;
    let quote = "";
    let braces = 0;
    let end = start;
    for (; end < source.length; end += 1) {
      const char = source[end];
      const previous = source[end - 1];
      if (quote) {
        if (char === quote && previous !== "\\") quote = "";
      } else if (char === "\"" || char === "'" || char === "`") quote = char;
      else if (char === "{") braces += 1;
      else if (char === "}") braces -= 1;
      else if (char === ">" && braces === 0) break;
    }
    tags.push({ start, text: source.slice(start, end + 1) });
    pattern.lastIndex = end + 1;
  }
  return tags;
}

function lineAt(source, index) {
  return source.slice(0, index).split("\n").length;
}

for (const filename of files) {
  const source = fs.readFileSync(path.join(componentRoot, filename), "utf8");
  for (const tag of openingTags(source, "button")) {
    totals.buttons += 1;
    const onClick = /\bonClick\s*=/.test(tag.text);
    const submit = /\btype\s*=\s*["']submit["']/.test(tag.text);
    const disabled = /\bdisabled(?:\s|=|>)/.test(tag.text);
    const before = source.slice(0, tag.start);
    const insideForm = before.lastIndexOf("<form") > before.lastIndexOf("</form>");
    if (onClick) totals.handlerBacked += 1;
    else if (submit || insideForm) totals.submitBacked += 1;
    else if (disabled) totals.intentionallyDisabled += 1;
    else defects.push(`${filename}:${lineAt(source, tag.start)} enabled button has no click or form-submit contract`);
  }
  for (const name of ["NavLink", "Link", "a"]) {
    for (const tag of openingTags(source, name)) {
      totals.links += 1;
      const target = name === "a" ? /\bhref\s*=\s*(["'][^"']*["'])/.exec(tag.text)?.[1] : /\bto\s*=\s*(["'][^"']*["'])/.exec(tag.text)?.[1];
      const handledAnchor = name === "a" && /\bonClick\s*=/.test(tag.text);
      const hasTarget = name === "a" ? /\bhref\s*=/.test(tag.text) : /\bto\s*=/.test(tag.text);
      if (!handledAnchor && !hasTarget) defects.push(`${filename}:${lineAt(source, tag.start)} link has no destination attribute`);
      if (!handledAnchor && ["\"\"", "''", "\"#\"", "'#'", "\"javascript:void(0)\"", "\"#main-content\"", "\"#candidate-support\"", "\"#privacy\"", "\"#role-support\""].includes(target ?? "")) defects.push(`${filename}:${lineAt(source, tag.start)} non-destination link ${target}`);
    }
  }
}

const appSource = fs.readFileSync(path.join(root, "src", "App.tsx"), "utf8");
totals.routeDeclarations = [...appSource.matchAll(/<Route\s+path=/g)].length;
console.log(JSON.stringify({ totals, defects }, null, 2));
if (defects.length) process.exit(1);
