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
    aliases: ["Custom HTML", "custom-html"],
    mimetypes: ["text/html"],
  });

  monaco.languages.setMonarchTokensProvider("daggerJs", {
    tokenizer: {
      root: [
        [/<!DOCTYPE/, "keyword", "@doctype"],
        [/<!--/, "comment", "@comment"],
        [/\<\w+/, { token: "html-tag", next: "@tag" }],
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
        [/\w+\=/, "html-attribute"],
        [/\>/, "@pop"],
        [/\$[\w#\-:]+/, "dollar"],
        [/\+[\w#\-:]+/, "plus"],
        [/\s+/, "white"],
        [/=/, "delimiter", "@value"],
      ],

      value: [
        [/"[^"]*"/, "javascript-expression", "@pop"],
        [/'[^']*'/, "attribute.value", "@pop"],
        [/[\w\-]+/, "attribute.value", "@pop"],
      ],
      assignment: [[/=/, "delimiter", "@jsExpression"]],
      jsExpression: [
        [/"[^"]*"/, "javascript-expression", "@checkStatement"],
        [/'[^']*'/, "javascript-expression", "@checkStatement"],
        [/`[^`]*`/, "javascript-expression", "@checkStatement"],
      ],
      checkStatement: [
        // Add rules to detect and mark JavaScript statements as an error
        [/;/, { token: "javascript-error", next: "@pop" }],
        [/.*/, { token: "javascript-expression", next: "@pop" }],
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
      `     <div class="card" +loading="{a: '123', b: 1}" $watch="b++">`,
      "             ${a}",
      "             ${b}",
      `     </div>`,
      "</body>",
    ].join("\n"),
    language: "daggerJs",
    theme: "myCustomTheme",
    minimap: {
      enabled: false,
    },
  });
  updateIframe();
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
