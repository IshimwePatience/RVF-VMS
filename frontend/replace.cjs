const fs = require('fs');
const path = require('path');

function replaceInFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let newContent = content
        .replace(/'\/api\//g, "'/rvf-api/")
        .replace(/"\/api\//g, "\"/rvf-api/")
        .replace(/`\/api\//g, "`/rvf-api/");
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent, 'utf8');
        console.log(`Updated: ${filePath}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
            replaceInFile(fullPath);
        }
    }
}

// Replace in src directory
walkDir(path.join(__dirname, 'src'));

// Also replace in vite.config.js
const viteConfigPath = path.join(__dirname, 'vite.config.js');
if (fs.existsSync(viteConfigPath)) {
    let viteContent = fs.readFileSync(viteConfigPath, 'utf8');
    let newViteContent = viteContent.replace(/'\/api':/g, "'/rvf-api':");
    if (viteContent !== newViteContent) {
        fs.writeFileSync(viteConfigPath, newViteContent, 'utf8');
        console.log(`Updated: ${viteConfigPath}`);
    }
}

console.log("Replacement complete!");
