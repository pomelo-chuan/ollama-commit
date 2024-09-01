#!/usr/bin/env node

const { execSync } = require("child_process");
const readline = require("readline");
const { askOllama } = require("./askOllama");
const { showLoadingIndicator, stopLoadingIndicator } = require("./misc");

const diff = execSync("git diff --staged").toString();

const loadingInterval = showLoadingIndicator("⭐️ Asking ollama");
const timeStart = Date.now();

askOllama(diff, { useEmoji: false }).then((data) => {
  const timeEnd = Date.now();
  stopLoadingIndicator(
    loadingInterval,
    `😄 Asking ollama finish in ${timeEnd - timeStart} ms`,
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
