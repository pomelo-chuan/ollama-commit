const readline = require("readline");

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

export const processCommitMessage = (
  commit_message: string,
  option: {
    useEmoji: boolean;
    EMOJI_MAP: { [key: string]: string };
  },
) => {
  let result = commit_message.replace(/["`]/g, "");

  if (option.useEmoji) {
    const emojiRegex = new RegExp(
      `^(${Object.keys(option.EMOJI_MAP).join("|")}):`,
    );
    result = commit_message.replace(emojiRegex, (match, p1) => {
      return `${option.EMOJI_MAP[p1]}:`;
    });
  }

  return result.replace(/\n$/, "");
};
