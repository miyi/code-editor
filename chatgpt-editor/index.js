require("https://cdn.jsdelivr.net/npm/monaco-editor@0.45.0/min/vs/editor/editor.main");

export const initMonaco = () =>
  monaco.editor.create(document.getElementById("container"), {
    value: "function hello() {\n\talert('Hello world!');\n}",
    language: "javascript",
  });
