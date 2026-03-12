import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const PROJECT_ROOT = new URL('../', import.meta.url);
const SCRIPT_PATH = fileURLToPath(new URL('../scripts/build-site.mjs', import.meta.url));

function createFixture({ includeOptionalAssets = false } = {}) {
  const rootDir = mkdtempSync(path.join(tmpdir(), 'signal-snake-build-'));

  mkdirSync(path.join(rootDir, 'src'), { recursive: true });
  mkdirSync(path.join(rootDir, 'docs', 'plans'), { recursive: true });
  mkdirSync(path.join(rootDir, 'tests'), { recursive: true });
  mkdirSync(path.join(rootDir, 'dist'), { recursive: true });

  writeFileSync(path.join(rootDir, 'index.html'), '<!doctype html><script type="module" src="./src/main.js"></script>');
  writeFileSync(path.join(rootDir, 'style.css'), 'body { color: #fff; }');
  writeFileSync(path.join(rootDir, 'src', 'main.js'), 'console.log("snake");');
  writeFileSync(path.join(rootDir, 'src', 'config.js'), 'export const SPEED = 180;');
  writeFileSync(path.join(rootDir, 'src', 'game.js'), 'export const status = "idle";');
  writeFileSync(path.join(rootDir, 'docs', 'plans', 'note.md'), '# ignored');
  writeFileSync(path.join(rootDir, 'tests', 'ignored.test.js'), 'export {};');
  writeFileSync(path.join(rootDir, 'dist', 'stale.txt'), 'remove me');

  if (includeOptionalAssets) {
    mkdirSync(path.join(rootDir, 'assets'), { recursive: true });
    writeFileSync(path.join(rootDir, 'assets', 'spark.txt'), 'spark');
    writeFileSync(path.join(rootDir, 'favicon.ico'), 'ico');
  }

  return rootDir;
}

function listRelativeFiles(rootDir, prefix = '') {
  return readdirSync(rootDir, { withFileTypes: true }).flatMap((entry) => {
    const relativePath = path.join(prefix, entry.name);

    if (entry.isDirectory()) {
      return listRelativeFiles(path.join(rootDir, entry.name), relativePath);
    }

    return [relativePath.replaceAll('\\', '/')];
  });
}

test('build-site creates a clean dist directory with only runtime assets', () => {
  const fixtureRoot = createFixture();

  try {
    const result = spawnSync(process.execPath, [SCRIPT_PATH, fixtureRoot], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.deepEqual(
      listRelativeFiles(path.join(fixtureRoot, 'dist')).sort(),
      ['index.html', 'src/config.js', 'src/game.js', 'src/main.js', 'style.css'],
    );
    assert.equal(
      readFileSync(path.join(fixtureRoot, 'dist', 'index.html'), 'utf8'),
      '<!doctype html><script type="module" src="./src/main.js"></script>',
    );
    assert.equal(readFileSync(path.join(fixtureRoot, 'dist', 'style.css'), 'utf8'), 'body { color: #fff; }');
    assert.equal(readFileSync(path.join(fixtureRoot, 'dist', 'src', 'main.js'), 'utf8'), 'console.log("snake");');
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test('build-site also includes common optional public assets when present', () => {
  const fixtureRoot = createFixture({ includeOptionalAssets: true });

  try {
    const result = spawnSync(process.execPath, [SCRIPT_PATH, fixtureRoot], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
    });

    assert.equal(result.status, 0, result.stderr || result.stdout);
    assert.deepEqual(
      listRelativeFiles(path.join(fixtureRoot, 'dist')).sort(),
      [
        'assets/spark.txt',
        'favicon.ico',
        'index.html',
        'src/config.js',
        'src/game.js',
        'src/main.js',
        'style.css',
      ],
    );
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});
