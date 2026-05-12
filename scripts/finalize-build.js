import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const client = path.resolve(dist, 'client');
const server = path.resolve(dist, 'server');

function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach(file => copyRecursive(path.join(src, file), path.join(dest, file)));
  } else {
    fs.copyFileSync(src, dest);
  }
}

console.log('Finalizing build for standard deployment...');

try {
  // Clean up dist root except for client/server
  if (fs.existsSync(dist)) {
    console.log('Cleaning up old build artifacts...');
    fs.readdirSync(dist).forEach(file => {
      if (file !== 'client' && file !== 'server') {
        const p = path.join(dist, file);
        try {
          fs.rmSync(p, { recursive: true, force: true });
          console.log(`- Removed: ${file}`);
        } catch (e) {
          console.warn(`- Skip remove ${file}: ${e.message}`);
        }
      }
    });
  }

  // Move everything from client to dist root
  if (fs.existsSync(client)) {
    console.log('Processing client bundle...');
    fs.readdirSync(client).forEach(file => {
      const srcPath = path.join(client, file);
      const destPath = path.join(dist, file);
      console.log(`- Moving: ${file}`);
      if (fs.statSync(srcPath).isDirectory()) {
          copyRecursive(srcPath, destPath);
      } else {
          fs.copyFileSync(srcPath, destPath);
      }
    });
    // Remove the client folder
    fs.rmSync(client, { recursive: true, force: true });
    console.log('Successfully moved client bundle to dist root.');
  } else {
    console.warn('Warning: dist/client directory not found!');
  }

  // Copy vercel.json to dist root
  const vercelJsonPath = path.resolve('vercel.json');
  if (fs.existsSync(vercelJsonPath)) {
    fs.copyFileSync(vercelJsonPath, path.join(dist, 'vercel.json'));
    console.log('Copied vercel.json to dist root.');
  }

  // Rename _shell.html to index.html if it exists (common in TanStack Start)
  const shellPath = path.join(dist, '_shell.html');
  const indexPath = path.join(dist, 'index.html');
  if (fs.existsSync(shellPath)) {
    fs.renameSync(shellPath, indexPath);
    console.log('Renamed _shell.html to index.html.');
  }

  // Create 404.html fallback
  if (fs.existsSync(indexPath)) {
    fs.copyFileSync(indexPath, path.join(dist, '404.html'));
    console.log('Created 404.html fallback.');
  }

  // Remove the server folder
  if (fs.existsSync(server)) {
    fs.rmSync(server, { recursive: true, force: true });
    console.log('Cleaned up SSR server artifacts.');
  }

  console.log('\x1b[32m%s\x1b[0m', 'Build finalized successfully and is ready for Vercel.');
} catch (error) {
  console.error('\x1b[31m%s\x1b[0m', 'Build finalization failed:');
  console.error(error);
  process.exit(1);
}
