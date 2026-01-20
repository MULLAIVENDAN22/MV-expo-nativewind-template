#!/usr/bin/env node

const degit = require("degit");
const fs = require("fs-extra");
const path = require("path");

const appNameInput = process.argv.slice(2).join(" ");

if (!appNameInput) {
  console.log("❌ Please provide an app name");
  console.log("Example:");
  console.log("  npx create-mv-expo-app my-app");
  process.exit(1);
}

// convert name → lowercase + hyphen
const appName = appNameInput
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/(^-|-$)/g, "");

const targetDir = path.join(process.cwd(), appName);

if (fs.existsSync(targetDir)) {
  console.log("❌ Folder already exists:", appName);
  process.exit(1);
}

console.log("🚀 Creating app:", appName);

// copy local template folder
fs.copySync(path.join(__dirname, "template"), targetDir);

// update package.json inside template
const pkgPath = path.join(targetDir, "package.json");
const pkg = fs.readJsonSync(pkgPath);

pkg.name = appName;

fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });

// update app.json (Expo config)
const appJsonPath = path.join(targetDir, "app.json");

if (fs.existsSync(appJsonPath)) {
  const appJson = fs.readJsonSync(appJsonPath);

  // Update Expo config
  if (appJson.expo) {
    appJson.expo.name = appNameInput.trim();
    appJson.expo.slug = appName;
  }

  // Also update top-level name if it exists
  if (appJson.name) {
    appJson.name = appNameInput.trim();
  }

  fs.writeJsonSync(appJsonPath, appJson, { spaces: 2 });
}


console.log("✅ App created successfully!");
console.log("");
console.log("Next steps:");
console.log(`  cd ${appName}`);
console.log("  npm install");
console.log("  npx expo start");
