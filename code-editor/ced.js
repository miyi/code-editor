fetch("../js/dagger.js")
    .then((res) => res.text())
    .then((text) => {
        // console.log(text)
        // do something with "text"
        window.dgjs = text
    }).catch((e) => console.error(e));

require.config({paths: {'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.33.0/min/vs'}});

require(['vs/editor/editor.main'], function () {
    monaco.languages.register({id: 'daggerJs'});
    monaco.languages.setMonarchTokensProvider('daggerJs', {
        tokenizer: {
            root: [
                [/<!DOCTYPE/, 'keyword', '@doctype'],
                [/<!--/, 'comment', '@comment'],
                [/<[\/!]?[a-zA-Z_\-:0-9]+/, 'tag', '@tag'],
                [/&\w+;/, 'string.escape'],
            ],

            doctype: [
                [/>/, 'keyword', '@pop'],
                [/[a-zA-Z]+/, 'keyword'],
            ],

            comment: [
                [/-->/, 'comment', '@pop'],
                [/[^-]+/, 'comment.content'],
                [/./, 'comment.content']
            ],

            tag: [
                [/\/?>/, 'tag', '@pop'],
                [/\s+/, 'white'],
                [/[$\+]?[\w\-:]+/, 'attribute.name'],
                [/=/, 'delimiter', '@value']
            ],

            value: [
                [/"[^"]*"/, 'attribute.value', '@pop'],
                [/'[^']*'/, 'attribute.value', '@pop'],
                [/[\w\-]+/, 'attribute.value', '@pop']
            ]
        }

    });
    // Define custom theme rules
    monaco.editor.defineTheme('myCustomTheme', {
        base: 'vs',
        inherit: false,
        rules: [
            {token: 'keyword', foreground: '808080'},
            {token: 'comment', foreground: '008800', fontStyle: 'italic underline'},
            {token: 'tag', foreground: 'ff00ff', fontStyle: 'bold'},
            {token: 'attribute.name', foreground: 'FFA500'},
            {token: 'attribute.value', foreground: '008800'},
        ],
        colors: {
            "editor.foreground": "#000000",
        }
    });
    // Create the editor with HTML language
    window.editor = monaco.editor.create(document.getElementById('container'), {
        value: ['<body>','<!-- Write your own code here -->', '</body>'].join('\n'),
        language: 'daggerJs',
        theme: 'myCustomTheme'
    });
    window.editor.getModel().onDidChangeContent((event) => {
        updateIframe()
    });
});

function getCode() {
    const header = '<html lang="en">\n' +
    '<head>\n' +
    '    <meta charset="utf-8"/>\n' +
    '    <script\n' +
    '            type="module"\n' +
    '            crossorigin="anonymous"\n' +
    '            src="../js/dagger.js"\n' +
    '            defer\n' +
    '    ></script>\n' +
    '    <script type="dagger/modules"></script>\n' +
    '    <title>dagger js</title>\n' +
    '</head>'
    return window.editor.getValue();
    // return header + window.editor.getValue();
    // return [
    //     '<!DOCTYPE html>',
    //     '<html>',
    //     '<head>',
    //     '    <title>Hello World</title>',
    //     '</head>',
    //     '<body +loading="{ a: []}">',
    //     '    <h1>Hello, world!</h1>',
    //     '</body>',
    //     '</html>'
    // ].join('\n')
}



function updateIframe() {
    document.getElementById('htmlOutput').src = getGeneratedPageURL({
        html: getCode(),
        css: ""
    })
    // var htmlCode = getCode();
    // var iframe = document.getElementById('htmlOutput');
    // var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
    //
    // iframeDoc.open();
    // iframeDoc.write(htmlCode);
    // iframeDoc.close();
}

// document.getElementById('htmlInput').addEventListener('input', updateIframe);

const getGeneratedPageURL = ({ html, css }) => {
    const getBlobURL = (code, type) => {
        const blob = new Blob([code], { type })
        return URL.createObjectURL(blob)
    }

    const cssURL = getBlobURL(css, 'text/css')
    const jsURL = getBlobURL(window.dgjs, 'text/javascript')

    const source = `
    <html>
      <head>
        ${css && `<link rel="stylesheet" type="text/css" href="${cssURL}" />`}
        <script type="module" crossorigin="anonymous" src="${jsURL}" defer></script><script type="dagger/modules"></script>
      </head>
      <body>
        ${html || ''}
      </body>
    </html>
  `

    return getBlobURL(source, 'text/html')
}