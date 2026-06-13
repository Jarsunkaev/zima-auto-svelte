const fs = require('fs');
const path = require('path');

const directories = [
  'src',
  'public',
  'zima-parking-frontend/src',
  'zima-parking-frontend/public',
  'zima-service-frontend/src',
  'zima-service-frontend/public',
  'zima-auto-backend/templates'
];

const replacements = [
  { from: /AT Group/g, to: 'A&T Group' },
  { from: /AT GROUP/g, to: 'A&T GROUP' },
  { from: /AT Repülőtéri/g, to: 'A&T Repülőtéri' },
  { from: /AT Airport/g, to: 'A&T Airport' },
  { from: /AT Szerviz/g, to: 'A&T Szerviz' },
  { from: /AT Car/g, to: 'A&T Car' },
  { from: /az AT /g, to: 'az A&T ' },
  { from: /a AT /g, to: 'az A&T ' }, // Grammar fix: az A&T
  { from: /az A&T Group/g, to: 'az A&T Group' }, // in case it gets weird
];

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (isDirectory) {
      if (f !== 'node_modules' && f !== 'build' && f !== 'dist') {
        walkDir(dirPath, callback);
      }
    } else {
      callback(dirPath);
    }
  });
}

let count = 0;

directories.forEach(dir => {
  walkDir(dir, filePath => {
    if (/\.(svelte|js|ts|html|json|md|css)$/.test(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');
      let originalContent = content;
      
      for (const {from, to} of replacements) {
        content = content.replace(from, to);
      }
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Updated ${filePath}`);
        count++;
      }
    }
  });
});

console.log(`Finished updating ${count} files.`);
