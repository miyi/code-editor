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

export const monacoEditor = monaco.editor;

export const initMonaco = (monaco, $node) => {
  if (monaco) {
    return monaco.create($node, {
      value: [
        "<body>",
        `     <div class="card" +loading="{a: '123', b: 1}" $watch="b++">`,
        "             ${a}",
        "             ${b}",
        `     </div>`,
        "</body>",
      ].join("\n"),
      language: "html",
      minimap: {
        enabled: false,
      },
    });
  }
};

export const getGeneratedPageURL = ( html ) => {
  const getBlobURL = (code, type) => {
    const blob = new Blob([code], { type });
    return URL.createObjectURL(blob);
  };

  const source = `
    <html>
      <head>
        <script type="module" crossorigin="anonymous" src="https://cdn.jsdelivr.net/npm/@miyi/dagger.js" defer></script><script type="dagger/modules"></script>
      </head>
      <body>
        ${html || ""}
      </body>
    </html>
  `;

  return getBlobURL(source, "text/html");
};
