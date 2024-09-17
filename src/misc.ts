const readline = require("readline");

/**
 * Displays a loading indicator with a rotating moon phase animation.
 *
 * @param text - The text to display alongside the loading indicator.
 * @returns A NodeJS.Timeout object that can be used to clear the interval.
 */
export const showLoadingIndicator = (text: string): NodeJS.Timeout => {
  const frames = ["🌕", "🌖", "🌗", "🌘", "🌑", "🌒", "🌓", "🌔"];
  let i = 0;

  return setInterval(() => {
    readline.cursorTo(process.stdout, 0);
    process.stdout.write(`${frames[i++ % frames.length]} ${text}`);
  }, 200);
};

/**
 * Stops the loading indicator by clearing the interval, resetting the cursor position,
 * clearing the current line, and logging a message.
 *
 * @param loadingInterval - The interval ID returned by setInterval that needs to be cleared.
 * @param message - The message to be logged after stopping the loading indicator.
 * @returns void
 */
export const stopLoadingIndicator = (
  loadingInterval: NodeJS.Timeout,
  message: string,
): void => {
  clearInterval(loadingInterval);
  readline.cursorTo(process.stdout, 0);
  readline.clearLine(process.stdout, 0);
  console.log(message);
};

/**
 * Processes a commit message by optionally replacing certain keywords with emojis and removing specific characters.
 *
 * @param commit_message - The original commit message to be processed.
 * @param option - An object containing options for processing the commit message.
 * @param option.useEmoji - A boolean indicating whether to replace keywords with emojis.
 * @param option.EMOJI_MAP - A mapping of keywords to their corresponding emojis.
 * 
 * @returns The processed commit message with specified transformations applied.
 */
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
