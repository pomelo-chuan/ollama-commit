#!/usr/bin/env node

const { execSync } = require("child_process");
const { askOllama } = require("./askOllama");

const diff = execSync("git diff --staged").toString();

askOllama(diff, { useEmoji: true }).then((data) => {
  console.log(data);
});
