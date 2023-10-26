import * as fs from 'fs';

const toDelete: Array<string> = ['style.css', 'style.js', 'index.js', 'main.js'];

function replaceHtml(pattern: RegExp, content: string) {
  const html :string = './dist/index.html';
  fs.writeFileSync(html, fs.readFileSync(html, 'utf-8').replace(pattern, content), 'utf-8')
}

replaceHtml(/<link rel="stylesheet" href="style.css">/, '')
replaceHtml(/<script src="main.js"><\/script>/, '')
replaceHtml(/<\/body>/, `</body><script>${fs.readFileSync('./dist/main.js', 'utf-8')}</script>`)
replaceHtml(/<\/body>/, `</body><style>${fs.readFileSync('./dist/style.css', 'utf-8')}</style>`)

toDelete.forEach((file: string) => {
  fs.unlink(`./dist/${file}`, () => {})
})
