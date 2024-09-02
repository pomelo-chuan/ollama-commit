# ollama-commit

# before all

1. install [ollama](https://ollama.com/) in your mac or pc.
2. pull [llama3.1](https://ollama.com/library/llama3.1) first:

```bash
ollama pull llama3.1:latest
```

# feature

- use `ollama` to generate commit message
- no api key required, use local LLM model
  
# install

```bash
npm i -g @miaos/ollama-commit
```

# usage

1. edit some files in your project
2. use `git add` to add some changes
3. run `ollama-commit` in the root of your project

![demo](./doc/demo.png)