const esbuild = require('esbuild');
const extensibilityMap = require("@neos-project/neos-ui-extensibility/extensibilityMap.json");
const isWatch = process.argv.includes('--watch');
const isAnalyze = process.argv.includes('--analyze');

/** @type {import("esbuild").BuildOptions} */
const options = {
    logLevel: "info",
    bundle: true,
    minify: !isWatch,
    sourcemap: "linked",
    legalComments: "linked",
    target: "es2020",
    entryPoints: { "Plugin": "./src/index.js" },
    outdir: "../../Resources/Public/JavaScript",
    alias: extensibilityMap,
    metafile: isAnalyze,
}

if (isWatch) {
    esbuild.context(options).then((ctx) => ctx.watch())
} else {
    esbuild.build(options).then(result => {
        if (isAnalyze) {
            require("fs").writeFileSync('meta.json', JSON.stringify(result.metafile))
            console.log("\nUpload './meta.json' to https://esbuild.github.io/analyze/ to analyze the bundle.")
        }
    })
}
