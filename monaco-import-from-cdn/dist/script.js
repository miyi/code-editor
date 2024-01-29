import * as monaco from "https://esm.sh/monaco-editor";
import editorWorker from "https://esm.sh/monaco-editor/esm/vs/editor/editor.worker?worker";
import jsonWorker from "https://esm.sh/monaco-editor/esm/vs/language/json/json.worker?worker";
import cssWorker from "https://esm.sh/monaco-editor/esm/vs/language/css/css.worker?worker";
import htmlWorker from "https://esm.sh/monaco-editor/esm/vs/language/html/html.worker?worker";

self.MonacoEnvironment = {
  getWorker(_, label) {
    if (label === "json") {
      return new jsonWorker();
    }
    if (label === "css" || label === "scss" || label === "less") {
      return new cssWorker();
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return new htmlWorker();
    }
    return new editorWorker();
  },
};

export const editor = monaco.editor;

export const initMonaco = (editor, $node) => {
  if (monaco) {
    editor.create($node, {
      value: "function hello() {\n\talert('Hello world!');\n}",
      language: "javascript",
    });
  }
};
