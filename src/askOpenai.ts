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
  const model = process.env.model || "gpt-4o-mini";
  const token = process.env.token;
  const host = process.env.host;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const data = {
    model,
    messages,
  };
  return axios
    .post(`${host}/v1/chat/completions`, data, { headers })
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
