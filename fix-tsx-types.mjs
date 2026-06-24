/**
 * fix-tsx-types.mjs
 * Auto-adds explicit React.JSX.Element | null return type to exported default
 * function/arrow-function components that are missing one.
 *
 * Fixes: TS2742 "inferred type cannot be named without a reference to @types/react"
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

// Files + line numbers reported by tsc (1-indexed)
const targets = [
  // [filePath, lineNumber, componentName]
  ["apps/web/src/app/(authenticated)/my-tournaments/page.tsx", 27, null],
  ["apps/web/src/app/(authenticated)/organizer/tournaments/[id]/_components/CreateMatchForm.tsx", 17, null],
  ["apps/web/src/app/(authenticated)/organizer/tournaments/[id]/_components/MatchRoomManager.tsx", 37, null],
  ["apps/web/src/app/(authenticated)/organizer/tournaments/[id]/_components/ParticipantsTable.tsx", 22, null],
  ["apps/web/src/app/(authenticated)/organizer/tournaments/[id]/_components/PublishRoomButton.tsx", 25, null],
  ["apps/web/src/app/(authenticated)/organizer/tournaments/[id]/_components/RoomSettingsForm.tsx", 28, null],
  ["apps/web/src/app/(authenticated)/organizer/tournaments/[id]/page.tsx", 29, null],
  ["apps/web/src/app/contact/page.tsx", 3, null],
  ["apps/web/src/app/not-found.tsx", 3, null],
  ["apps/web/src/app/onboarding/page.tsx", 13, null],
  ["apps/web/src/app/page.tsx", 13, null],
  ["apps/web/src/app/tournaments/[id]/page.tsx", 19, null],
  ["apps/web/src/app/tournaments/_components/ActionPanel.tsx", 136, null],
  ["apps/web/src/app/tournaments/_components/CountdownCard.tsx", 12, null],
  ["apps/web/src/app/tournaments/_components/JoinTournamentModal.tsx", 51, null],
  ["apps/web/src/app/tournaments/_components/StatusBadge.tsx", 62, null],
  ["apps/web/src/app/tournaments/_components/TournamentDetailSkeleton.tsx", 4, null],
  ["apps/web/src/components/Tournaments/MyTournamentsCard.tsx", 35, null],
  ["apps/web/src/components/ui/marquee-demo.tsx", 118, null],
  ["apps/web/src/providers/query-provider/index.tsx", 6, null],
];

const ROOT = "/home/ravinder/Personal_Projects/dethroits";

// Regex patterns to match function/arrow component declarations
// Group 1: everything before the closing paren/brace of params
// We need to insert ": React.JSX.Element | null" before the opening brace

const FUNC_DECL = /^(export\s+(?:default\s+)?function\s+\w+\s*(?:<[^>]*>)?\s*\([^)]*\))\s*\{/;
const ARROW_DECL = /^((?:export\s+(?:default\s+)?)?(?:const|let)\s+\w+\s*(?:=\s*(?:<[^>]*>)?\s*\([^)]*\))\s*)=>/;

let fixed = 0;
let skipped = 0;

for (const [rel, lineNum, _] of targets) {
  const filePath = resolve(ROOT, rel);
  let src;
  try {
    src = readFileSync(filePath, "utf8");
  } catch {
    console.warn(`  SKIP (not found): ${rel}`);
    skipped++;
    continue;
  }

  const lines = src.split("\n");
  const idx = lineNum - 1; // 0-indexed
  const line = lines[idx];

  if (!line) {
    console.warn(`  SKIP (line ${lineNum} empty): ${rel}`);
    skipped++;
    continue;
  }

  // Already has a return type annotation
  if (/\)\s*:\s*\S/.test(line)) {
    console.log(`  ALREADY OK: ${rel}:${lineNum}`);
    skipped++;
    continue;
  }

  let newLine = null;

  // 1. "export default function Foo(...) {"
  const funcMatch = line.match(/^(export\s+(?:default\s+)?function\s+\w+\s*(?:<[^>]*>)?\s*\([^)]*\))\s*(\{.*)$/);
  if (funcMatch) {
    newLine = `${funcMatch[1]}: React.JSX.Element | null ${funcMatch[2]}`;
  }

  // 2. Multi-line function declaration: line ends with params but no brace yet
  if (!newLine && /^export\s+(?:default\s+)?function\s+\w+/.test(line) && !line.includes("{")) {
    // Look ahead for the closing paren line
    // The error line IS the function name line — params may span multiple lines
    // Find the line with the closing ) and add the return type after it
    // For now handle single-line params ending with "{"
    // or "}) {" on same line
  }

  // 3. "const Foo = () => {" or "const Foo = (...) => {"
  if (!newLine) {
    const arrowMatch = line.match(/^((?:export\s+(?:default\s+)?)?(?:const|let)\s+\w+\s*=\s*(?:<[^>]*>)?\s*\([^)]*\))\s*=>\s*(\{.*)$/);
    if (arrowMatch) {
      newLine = `${arrowMatch[1]}: React.JSX.Element | null => ${arrowMatch[2]}`;
    }
  }

  // 4. Arrow fn where params are on previous line: "}) => {" pattern won't match — skip
  // 5. "export function Foo({" multi-line params (params on multiple lines, closing ) on later line)
  if (!newLine) {
    // Check if this is a function declaration line with opening paren but no closing paren
    const openFuncMatch = line.match(/^(export\s+(?:default\s+)?function\s+\w+\s*(?:<[^>]*>)?\s*\()(.*)$/);
    if (openFuncMatch && !line.includes(")")) {
      // Multi-line params: scan ahead for closing ) {
      for (let i = idx + 1; i < lines.length; i++) {
        const nextLine = lines[i];
        const closingMatch = nextLine.match(/^(\s*\}?\s*\))\s*(\{.*)$/);
        if (closingMatch) {
          lines[i] = `${closingMatch[1]}: React.JSX.Element | null ${closingMatch[2]}`;
          newLine = "__multiline__";
          break;
        }
        // also handle }: PropsType) { pattern
        const closingMatch2 = nextLine.match(/^(.*\))\s*\{(.*)$/);
        if (closingMatch2) {
          lines[i] = `${closingMatch2[1]}: React.JSX.Element | null {${closingMatch2[2]}`;
          newLine = "__multiline__";
          break;
        }
      }
    }
  }

  if (!newLine) {
    console.warn(`  COULD NOT PATCH (${lineNum}): ${rel}`);
    console.warn(`    Line: ${line}`);
    skipped++;
    continue;
  }

  if (newLine !== "__multiline__") {
    lines[idx] = newLine;
  }

  // Ensure React is imported
  const srcJoined = lines.join("\n");
  let finalSrc = srcJoined;
  if (!srcJoined.includes("import React") && !srcJoined.includes("React.JSX")) {
    // Add React import after first line if 'use client' / 'use server', else at top
    const firstImportIdx = lines.findIndex((l) => l.startsWith("import "));
    if (firstImportIdx >= 0) {
      lines.splice(firstImportIdx, 0, 'import React from "react";');
    } else {
      lines.unshift('import React from "react";');
    }
    finalSrc = lines.join("\n");
  }

  writeFileSync(filePath, finalSrc, "utf8");
  console.log(`  FIXED: ${rel}:${lineNum}`);
  fixed++;
}

console.log(`\nDone. Fixed: ${fixed}, Skipped: ${skipped}`);
