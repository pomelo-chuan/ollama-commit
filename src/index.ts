#!/usr/bin/env node

const { execSync } = require("child_process");
const readline = require("readline");
const path = require("path");
const os = require("os");
const dotenv = require("dotenv");
const picocolors = require("picocolors");
const { askOllama } = require("./askOllama");
const { askOpenai } = require("./askOpenai");
const { showLoadingIndicator, stopLoadingIndicator } = require("./misc");
const { defaultCommitPrompt } = require("./config");
const diff = execSync("git diff --staged").toString();

dotenv.config({ path: path.join(os.homedir(), ".ollama-commit") });

if (!diff) {
  console.log(
    picocolors.yellow(
      "🤔 No changes to commit, please use `git add` to stage your changes before.",
    ),
  );
  process.exit(0);
}

const stagedFileLists = execSync("git diff --staged --name-only")
  .toString()
  .split("\n")
  .map((item) => item.trim())
  .filter((item) => item);

console.log("📄 Staged files:");
console.log(
  picocolors.cyan(
    stagedFileLists.map((it) => `\u00A0\u00A0-\u00A0${it}`).join("\n"),
  ),
);

const loadingInterval = showLoadingIndicator(
  `Asking ${process.env.useOpenai === "true" ? "openai" : "ollama"}...`,
);
const timeStart = Date.now();

if (process.env.useOpenai === "true") {
  askOpenai(diff, {
    useEmoji: process.env.useEmoji === "true",
  })
    .then((data) => {
      const timeEnd = Date.now();
      stopLoadingIndicator(
        loadingInterval,
        `😄 Asking openai finish in ${(timeEnd - timeStart) / 1000} s`,
      );

      console.log(picocolors.green("✔") + " generated commit message: ");
      console.log("\u00A0\u00A0" + picocolors.green(data));

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        "Do you want to use this as the git commit message? (y/n) ",
        (answer) => {
          if (answer.toLowerCase() === "y") {
            execSync(`git commit -m "${data}"`, { stdio: "inherit" });
          }
          rl.close();
        },
      );
    })
    .catch((error) => {
      stopLoadingIndicator(loadingInterval, "😄 Asking openai failed");
      console.error(error.message);
    });
} else {
  askOllama(diff, {
    useEmoji: process.env.useEmoji === "true",
    prompt: (process.env.prompt || defaultCommitPrompt).replace(
      "__LANGUAGE__",
      process.env.language || "English",
    ),
  })
    .then((data) => {
      const timeEnd = Date.now();
      stopLoadingIndicator(
        loadingInterval,
        `😄 Asking ollama finish in ${(timeEnd - timeStart) / 1000} s`,
      );

      console.log(picocolors.green("✔") + " generated commit message: ");
      console.log("\u00A0\u00A0" + picocolors.green(data));

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      rl.question(
        "Do you want to use this as the git commit message? (y/n) ",
        (answer) => {
          if (answer.toLowerCase() === "y") {
            execSync(`git commit -m "${data}"`, { stdio: "inherit" });
          }
          rl.close();
        },
      );
    })
    .catch((error) => {
      stopLoadingIndicator(loadingInterval, "😅 Asking ollama failed");
      console.error(error.message);
    });
}
