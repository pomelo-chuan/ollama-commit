const axios = require("axios");
const { processCommitMessage } = require("./misc");
const { EMOJI_MAP } = require("./config");

export const askOpenai = (
  diff: string,
  option: { useEmoji?: boolean; prompt?: string } = {},
) => {
  const messages = [
    {
      role: "system",
      content: option.prompt,
    },
    {
      role: "user",
      content: `Here is the \`git diff\`: ${diff}`,
    },
  ];
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.openAiToken}`,
  };
  return axios
    .post(
      `${process.env.openAiHost}/v1/chat/completions`,
      {
        model: process.env.openAiModel || "gpt-4o-mini",
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
      throw new Error(
        "Failed to get commit message from OpenAI: " + err.message,
      );
    });
};
