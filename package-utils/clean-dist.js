const fs = require('fs');
const path = require('path');

const distPath = path.join(__dirname, '../dist'); // Adjust the path to the dist directory

if (fs.existsSync(distPath)) {
  fs.rmSync(distPath, { recursive: true, force: true });
  console.log('dist folder removed');
} else {
  console.log('dist folder does not exist');
}
