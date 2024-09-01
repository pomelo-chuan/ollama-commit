const { Ollama } = require("ollama");
const { EMOJI_MAP } = require("./config");

const ollama = new Ollama({ host: "http://localhost:11434" });

const defaultCommitPrompt = `You are a professional developer specializing in creating git commit messages.
Your only goal is to generate a single commit message.
Based on the provided user changes, combine them into ONE SINGLE commit message that captures the global idea, following these strict rules:
- Determine the commit {type} according to \`Semantic Commit Messages\`:
  \`build\`: Changes affecting the build system or external dependencies (e.g., npm, webpack, rollup, umirc, next.config).
  \`chore\`: Non-code changes (e.g., updating tasks, configurations).
  \`ci\`: Changes related to CI configuration and scripts (e.g., TravisCI, CircleCI, gitlab-ci).
  \`docs\`: Documentation-only changes (e.g., README, API documentation).
  \`feat\`: A new feature or enhancement (e.g., adding new functionality).
  \`fix\`: A bug fix (e.g., resolving issues, correcting errors).
  \`perf\`: A performance improvement (e.g., optimizing algorithms, reducing load times).
  \`refactor\`: Code changes that neither fix a bug nor add a feature (e.g., restructuring code).
  \`revert\`: Reverts a previous commit.
  \`style\`: Code style changes (e.g., formatting, fixing indentation).
  \`test\`: Adding or updating tests (e.g., unit tests, integration tests).

- Do NOT include issue numbers, explanations, or any introduction.
- Your output MUST be a single commit message in the format: \`{type}: {commit_message}\`.
- The commit message MUST be concise, under 50 characters.`;

export const askOllama = async (
  diff: string,
  option: { useEmoji?: boolean } = {},
) => {
  const messages = [
    {
      role: "system",
      content: defaultCommitPrompt,
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
      model: "codegemma:latest",
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
      return commit_message;
    })
    .catch((error) => {
      throw error;
    });
};
