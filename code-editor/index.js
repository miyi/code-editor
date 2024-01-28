require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {
  // monaco.languages.register({id: 'daggerJs'});
  monaco.languages.register({
    id: "daggerJs",
    extensions: [".html"],
    aliases: ["dagger", "daggerjs", "dagger-js"],
    mimetypes: ["text/html"],
  });
  monaco.languages.setMonarchTokensProvider("daggerJs", {
    tokenizer: {
      root: [
        [/<!DOCTYPE/, "keyword", "@doctype"],
        [/<!--/, "comment", "@comment"],
        [/<[\/!]?[a-zA-Z_\-:0-9]+/, "tag", "@tag"],
        [/&\w+;/, "string.escape"],
      ],

      doctype: [
        [/>/, "keyword", "@pop"],
        [/[a-zA-Z]+/, "keyword"],
      ],

      comment: [
        [/-->/, "comment", "@pop"],
        [/[^-]+/, "comment.content"],
        [/./, "comment.content"],
      ],

      tag: [
        [/\/?>/, "tag", "@pop"],
        [/\$[\w\-:]+/, "dollar"],
        [/[\w\-:]+/, "attribute.name"],
        [/\+[\w\-:]+/, "plus"],
        [/=/, "delimiter", "@value"],
      ],

      value: [
        [/"[^"]*"/, "attribute.value", "@pop"],
        [/'[^']*'/, "attribute.value", "@pop"],
        [/[\w\-]+/, "attribute.value", "@pop"],
      ],
      checkStatement: [
        // Add rules to detect and mark JavaScript statements as an error
        [/;/, { token: "javascript-error", next: "@pop" }],
      ],
    },
  });
  // Define custom theme rules
  monaco.editor.defineTheme("myCustomTheme", {
    base: "vs",
    inherit: false,
    rules: [
      { token: "keyword", foreground: "808080" },
      { token: "comment", foreground: "008800", fontStyle: "italic underline" },
      { token: "tag", foreground: "ff00ff", fontStyle: "bold" },
      { token: "attribute.name", foreground: "FFA500" },
      { token: "dollar", foreground: "373bFF" },
      { token: "plus", foreground: "00A5FF" },
      { token: "attribute.value", foreground: "008800" },
    ],
    colors: {
      "editor.foreground": "#000000",
    },
  });

  window.editor = monaco.editor.create(document.getElementById("container"), {
    value: [
      "<body>",
      `<div +loading="{a: 'string', b: 1}" $watch="b++">`,
      `\${a}`,
      `\${b}`,
      `</div>`,
      "</body>",
    ].join("\n"),
    language: "daggerJs",
    theme: "myCustomTheme",
  });
  window.editor.getModel().onDidChangeContent((event) => {
    updateIframe();
  });
});

function updateIframe() {
  document.getElementById("htmlOutput").src = getGeneratedPageURL({
    html: window.editor.getValue(0),
  });
}

const getGeneratedPageURL = ({ html }) => {
  const getBlobURL = (code, type) => {
    const blob = new Blob([code], { type });
    return URL.createObjectURL(blob);
  };

  const jsURL = getBlobURL(window.dgjs, "text/javascript");

  const source = `
    <html>
      <head>
        <script type="module" crossorigin="anonymous" src="${jsURL}" defer></script><script type="dagger/modules"></script>
      </head>
      <body>
        ${html || ""}
      </body>
    </html>
  `;

  return getBlobURL(source, "text/html");
};
