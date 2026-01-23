#!/usr/bin/env node

const fs = require("fs-extra");
const path = require("path");
const readline = require("readline");

/* ---------- helpers ---------- */

function askQuestion(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/* ---------- main ---------- */

async function main() {
  let appNameInput = process.argv.slice(2).join(" ").trim();

  // Ask app name if not provided
  if (!appNameInput) {
    appNameInput = await askQuestion("📦 What is your app name? ");
  }

  if (!appNameInput.trim()) {
    console.log("❌ App name cannot be empty");
    process.exit(1);
  }

  const appName = normalizeName(appNameInput);
  const targetDir = path.join(process.cwd(), appName);

  if (fs.existsSync(targetDir)) {
    console.log(`❌ Folder already exists: ${appName}`);
    process.exit(1);
  }

  console.log(`🚀 Creating Expo app with NativeWind + Gluestack: ${appName}`);

  /* ---------- copy template ---------- */

  const templateDir = path.join(__dirname, "template");
  fs.copySync(templateDir, targetDir);

  /* ---------- update package.json ---------- */

  const pkgPath = path.join(targetDir, "package.json");
  if (fs.existsSync(pkgPath)) {
    const pkg = fs.readJsonSync(pkgPath);
    pkg.name = appName;
    fs.writeJsonSync(pkgPath, pkg, { spaces: 2 });
  }

  /* ---------- update app.json ---------- */

  const appJsonPath = path.join(targetDir, "app.json");
  if (fs.existsSync(appJsonPath)) {
    const appJson = fs.readJsonSync(appJsonPath);

    if (appJson.expo) {
      appJson.expo.name = appNameInput.trim(); // Display name
      appJson.expo.slug = appName;             // URL-safe name
    }

    fs.writeJsonSync(appJsonPath, appJson, { spaces: 2 });
  }

  /* ---------- done ---------- */

  console.log("\n✅ App created successfully!");
  console.log("\nIncluded:");
  console.log("  • Expo");
  console.log("  • TypeScript");
  console.log("  • NativeWind (Tailwind CSS for React Native)");
  console.log("  • Gluestack UI (provider only)");
  console.log("  • NO Expo Router");

  console.log("\nNext steps:");
  console.log(`  cd ${appName}`);
  console.log("  npm install");
  console.log("  npx expo start");

  console.log("\nAdd Gluestack components manually:");
  console.log("  npx gluestack-ui add box");
  console.log("  npx gluestack-ui add text");
  console.log("  npx gluestack-ui add button");
}

main();
