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
  { from: /Üdvözöljük a Zima Auto Kft-nél!/g, to: 'Üdvözöljük az AT Group-nál!' },
  { from: /Üdvözöljük a Zima Auto-nál!/g, to: 'Üdvözöljük az AT Group-nál!' },
  { from: /Zima Auto Korlátolt Felelősségű Társaság/g, to: 'AT Group Korlátolt Felelősségű Társaság' },
  { from: /Zima Autó Korlátolt Felelősségű Társaság/g, to: 'AT Group Korlátolt Felelősségű Társaság' },
  { from: /Zima Auto Kft\./g, to: 'AT Group Kft.' },
  { from: /Zima Autó Kft\./g, to: 'AT Group Kft.' },
  { from: /Zima Auto/g, to: 'AT Group' },
  { from: /Zima Autó/g, to: 'AT Group' },
  { from: /ZIMA AUTO/g, to: 'AT GROUP' },
  // Be careful with simple "Zima" to not mess up variable names if any, but it's safe for text.
  { from: /Zima/g, to: 'AT Group' },
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
    // Only process specific text files
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
