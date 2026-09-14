#!/usr/bin/env node
/**
 * Usage: npm run hash-password -- "your-chosen-password"
 * Prints a bcrypt hash to paste into ADMIN_PASSWORD_HASH in your .env file.
 */
const bcrypt = require("bcryptjs");

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "your-chosen-password"');
  process.exit(1);
}

bcrypt.hash(password, 12).then((hash) => {
  console.log("\nAdd this to your .env file:\n");
  console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);
});
