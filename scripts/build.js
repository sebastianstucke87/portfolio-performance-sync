import * as esbuild from 'esbuild';
import {copyFileSync, cpSync, mkdirSync} from 'fs';

const isWatch = process.argv.includes('--watch');
const browsers = ['chrome', 'firefox'];

const entryPoints = [
    ['src/presentation/background/service-worker.ts', 'background/service-worker.js'],
    ['src/presentation/content/content-script.ts', 'content/content-script.js'],
];

for (const browser of browsers) {
    const outDir = `dist/${browser}`;
    mkdirSync(outDir, {recursive: true});
    copyFileSync(`browsers/${browser}/manifest.json`, `${outDir}/manifest.json`);
    cpSync('browsers/icons', `${outDir}/icons`, {recursive: true});

    for (const [entry, out] of entryPoints) {
        const config = {
            entryPoints: [entry],
            outfile: `${outDir}/${out}`,
            bundle: true,
            sourcemap: true,
            target: 'es2022',
            format: 'esm',
        };

        if (isWatch) {
            const ctx = await esbuild.context(config);
            await ctx.watch();
            console.log(`Watching ${entry}...`);
        } else {
            await esbuild.build(config);
        }
    }
    console.log(`Built ${browser}`);
}
