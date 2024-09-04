const { Ollama } = require("ollama");
const { EMOJI_MAP } = require("./config");
const { defaultCommitPrompt } = require("./config");
const ollama = new Ollama({ host: "http://localhost:11434" });
const { processCommitMessage } = require("./misc");

export const askOllama = async (
  diff: string,
  option: { useEmoji?: boolean } = {},
) => {
  const messages = [
    {
      role: "system",
      content: process.env.prompt || defaultCommitPrompt,
    },
    {
      role: "user",
      content: `Here is the \`git diff\`: ${diff}`,
    },
  ];

  console.log(messages);

  return ollama
    .chat({
      options: {
        temperature: 0.2,
        num_predict: 100,
      },
      model: "llama3.1",
      messages,
    })
    .then((data) => {
      const commit_message = data.message.content;

      return processCommitMessage(commit_message, {
        useEmoji: option.useEmoji,
        EMOJI_MAP,
      });
    })
    .catch((error) => {
      throw error;
    });
};
