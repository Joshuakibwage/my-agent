import { stepCountIs, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./prompts";
import { getFileChangesInDirectoryTool } from "./tools";
import { generateCommitMessageTool } from "./tools"; // New tool import
import { writeReviewToMarkdownTool } from "./tools"; // New tool import

const codeReviewAgent = async (prompt: string) => {
  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    prompt,
    system: SYSTEM_PROMPT,
    tools: {
      getFileChangesInDirectoryTool: getFileChangesInDirectoryTool,
      generateCommitMessageTool: generateCommitMessageTool, // Added tool
      writeReviewToMarkdownTool: writeReviewToMarkdownTool, // Added tool
    },
    stopWhen: stepCountIs(10),
  });

  for await (const chunk of result.textStream) {
    process.stdout.write(chunk);
  }
};

// Specify which directory the code review agent should review changes in your prompt
await codeReviewAgent(
  "Review the code changes in '../my-agent' directory, make your reviews and suggestions file by file. Generate a commit message for the changes and write the review to a markdown file.",
);