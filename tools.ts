import { z } from "zod";
import { tool } from "ai";
import { simpleGit } from "simple-git";

const fileChange = z.object({
    rootDir: z.string().min(1).describe("The root directory"),
})

type FileChange = z.infer<typeof fileChange>;


const excludeFiles = ["dist", "bun.lock"];

async function getFileChangesInDirectory({ rootDir }: FileChange) {
    const git = simpleGit(rootDir);
    const summary = await git.diffSummary();
    const diffs: {file: sting; diff: string}[] = [];

    for(const file of summary.files) {

        if(excludeFiles.includes(file.file)) continue;

        const diff = await git.diff(["--", file.file]);
        diffs.push({file: file.file, diff});
    }
    return diffs;
}




const commitMessageInput = z.object({
  diffs: z.array(z.object({
    file: z.string(),
    diff: z.string(),
  })),
});

type CommitMessageInput = z.infer<typeof commitMessageInput>;

async function generateCommitMessage({ diffs }: CommitMessageInput) {
  
  const changedFiles = diffs.map(d => d.file).join(", ");
  return `chore: update ${changedFiles}`;
}

export const generateCommitMessageTool = tool({
  description: "Generates a commit message based on code diffs",
  inputSchema: commitMessageInput,
  execute: generateCommitMessage,
});


const writeReviewInput = z.object({
  review: z.string(),
  outputPath: z.string().default("code-review.md"),
});

type WriteReviewInput = z.infer<typeof writeReviewInput>;

import { promises as fs } from "fs";

async function writeReviewToMarkdown({ review, outputPath }: WriteReviewInput) {
  await fs.writeFile(outputPath, review, "utf8");
  return `Review written to ${outputPath}`;
}

export const writeReviewToMarkdownTool = tool({
  description: "Writes the code review to a markdown file",
  inputSchema: writeReviewInput,
  execute: writeReviewToMarkdown,
});



export const getFileChangesInDirectoryTool = tool({
  description: "Gets the code changes made in given directory",
  inputSchema: fileChange,
  execute: getFileChangesInDirectory,
});