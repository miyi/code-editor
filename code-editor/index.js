require.config({
  paths: {
    vs: "https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs",
  },
});

require(["vs/editor/editor.main"], function () {
  monaco.languages.register({ id: "daggerJs" });
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
        [/\s+/, "white"],
        [/\$[\w\-:]+/, "directives"],
        [/[\w\-:]+/, "attribute.name"],
        [/\+[\w\-:]+/, "lifecycle"],
        [/=/, "delimiter", "@value"],
      ],

      value: [
        [/"[^"]*"/, "attribute.value", "@pop"],
        [/'[^']*'/, "attribute.value", "@pop"],
        [/[\w\-]+/, "attribute.value", "@pop"],
      ],
    },
  });
  // Define custom theme rules
  monaco.editor.defineTheme("myCustomTheme", {
    base: "vs",
    inherit: true,
    rules: [
      { token: "keyword", foreground: "808080" },
      { token: "comment", foreground: "008800", fontStyle: "italic underline" },
      { token: "tag", foreground: "ff00ff", fontStyle: "bold" },
      { token: "attribute.name", foreground: "FFA500" },
      { token: "directives", foreground: "373bFF" },
      { token: "lifecycle", foreground: "00A5FF" },
      { token: "attribute.value", foreground: "008800" },
    ],
    colors: {
      "editor.foreground": "#000000",
    },
  });

  window.editor = monaco.editor.create(document.getElementById("container"), {
    value: [
      "<body>",
      `     <div class="card" +loading="{a: '123', b: 1}" $watch="b++">`,
      "             ${a}",
      "             ${b}",
      `     </div>`,
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
