const axios = require("axios");
const { defaultCommitPrompt } = require("./config");

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
  const url = process.env.url;
  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
  const data = {
    model,
    messages,
  };
  return axios
    .post(url, data, { headers })
    .then((res) => {
      return res?.data?.choices[0]?.message?.content;
    })
    .catch((err) => {
      throw err;
    });
};
