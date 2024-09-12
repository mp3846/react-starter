import { readFileSync, readdirSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const fileName = fileURLToPath(import.meta.url)
const rootDir = dirname(fileName)

const packageJson = JSON.parse(readFileSync(join(rootDir, 'package.json'), 'utf8'))
const projectName = packageJson.name || 'project'

const findFile = (dir, pattern) => readdirSync(dir).find((file) => pattern.test(file))

const cssDir = join(rootDir, 'build/static/css')
const jsDir = join(rootDir, 'build/static/js')

// Find the CSS and JS files with hashes
const cssFileName = findFile(cssDir, /^main\..+\.css$/)
const jsFileName = findFile(jsDir, /^main\..+\.js$/)

let htmlContent = readFileSync(join(rootDir, 'build/index.html'), 'utf8')

if (cssFileName) {
	const cssFilePath = join(cssDir, cssFileName)
	const cssContent = readFileSync(cssFilePath, 'utf8')
	htmlContent = htmlContent.replace('</head>', `<style>${cssContent}</style></head>`)
} else {
	console.error('CSS file not found!')
}

if (jsFileName) {
	const jsFilePath = join(jsDir, jsFileName)
	const jsContent = readFileSync(jsFilePath, 'utf8')
	htmlContent = htmlContent.replace('</body>', `<script>${jsContent}</script></body>`)
} else {
	console.error('JS file not found!')
}

const outputFilePath = join(rootDir, `build/${projectName}.html`)
writeFileSync(outputFilePath, htmlContent)

console.log(`HTML file with embedded JS and CSS created as ${projectName}.html`)
