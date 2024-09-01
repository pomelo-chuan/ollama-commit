import * as readline from "readline";

export const showLoadingIndicator = (text: string): NodeJS.Timeout => {
  const frames = ["-", "\\", "|", "/"];
  let i = 0;

  return setInterval(() => {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${text} ${frames[i++ % frames.length]}`);
  }, 200);
};

export const stopLoadingIndicator = (
  loadingInterval: NodeJS.Timeout,
  message: string,
): void => {
  clearInterval(loadingInterval);
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 0);
  console.log(message);
};
