const { Ollama } = require("ollama");
const { EMOJI_MAP } = require("./config");
const { defaultCommitPrompt } = require("./config");
const ollama = new Ollama({ host: "http://localhost:11434" });

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

  return ollama
    .chat({
      options: {
        temperature: 0.8,
        num_predict: 100,
      },
      model: "llama3.1",
      messages,
    })
    .then((data) => {
      let commit_message = data.message.content.replace(/["`]/g, "");
      if (option.useEmoji) {
        commit_message = commit_message.replace(
          new RegExp(`^(${Object.keys(EMOJI_MAP).join("|")}):`),
          (match, p1) => {
            return `${EMOJI_MAP[p1]}:`;
          },
        );
      }
      return commit_message.replace(/\n$/, "");
    })
    .catch((error) => {
      throw error;
    });
};
