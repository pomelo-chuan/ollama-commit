#!/usr/bin/env node

const { execSync } = require("child_process");
const readline = require("readline");
const path = require("path");
const os = require("os");
const dotenv = require("dotenv");
const { askOllama } = require("./askOllama");
const { showLoadingIndicator, stopLoadingIndicator } = require("./misc");

const diff = execSync("git diff --staged").toString();

// 加载配置文件
dotenv.config({ path: path.join(os.homedir(), ".ollama-commit") });

if (!diff) {
  console.log(
    "🤔 No changes to commit, please use `git add` to stage your changes before.",
  );
  process.exit(0);
}

const loadingInterval = showLoadingIndicator("⭐️ Asking ollama");
const timeStart = Date.now();

askOllama(diff, { useEmoji: process.env.useEmoji === "true" }).then((data) => {
  const timeEnd = Date.now();
  stopLoadingIndicator(
    loadingInterval,
    `😄 Asking ollama finish in ${(timeEnd - timeStart) / 1000} s`,
  );

  console.log(data);

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
});
