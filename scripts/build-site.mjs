import { access, cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const REQUIRED_ENTRIES = ['index.html', 'style.css', 'src'];
const OPTIONAL_ENTRIES = ['assets', 'audio', 'favicon.ico', 'images', 'manifest.webmanifest', 'robots.txt'];

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

export async function buildSite(rootDir = process.cwd()) {
  const outputDir = path.join(rootDir, 'dist');
  const runtimeEntries = [...REQUIRED_ENTRIES];

  await rm(outputDir, { recursive: true, force: true });
  await mkdir(outputDir, { recursive: true });

  for (const entry of OPTIONAL_ENTRIES) {
    if (await pathExists(path.join(rootDir, entry))) {
      runtimeEntries.push(entry);
    }
  }

  await Promise.all(
    runtimeEntries.map((entry) =>
      cp(path.join(rootDir, entry), path.join(outputDir, entry), { recursive: true }),
    ),
  );

  return outputDir;
}

const isDirectRun = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirectRun) {
  const targetRoot = process.argv[2] ? path.resolve(process.argv[2]) : process.cwd();
  await buildSite(targetRoot);
}
