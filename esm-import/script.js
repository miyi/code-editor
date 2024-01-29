import * as monaco from "https://esm.sh/monaco-editor";

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
