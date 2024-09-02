const axios = require("axios");
const { defaultCommitPrompt } = require("./config");
const { processCommitMessage } = require("./misc");
const { EMOJI_MAP } = require("./config");

export const askOpenai = (
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
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.openai_token}`,
  };
  return axios
    .post(
      `${process.env.openai_host}/v1/chat/completions`,
      {
        model: process.env.openai__model || "gpt-4o-mini",
        messages: messages,
      },
      { headers },
    )
    .then((res) => {
      const commit_message = res?.data?.choices[0]?.message?.content;
      return processCommitMessage(commit_message, {
        useEmoji: option.useEmoji,
        EMOJI_MAP,
      });
    })
    .catch((err) => {
      throw err;
    });
};
