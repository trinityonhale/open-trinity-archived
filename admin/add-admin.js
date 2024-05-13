#!/usr/bin/env node
const { program, Option } = require('commander');
const app = require('./firebase');
const { getAuth } = require('firebase-admin/auth');

program
  .usage('add-admin <uid> [--revoke]')
  .description('Add an admin user to the Firebase project')
  .addOption(new Option('--revoke', 'Revoke admin privileges from the user').default(false))
  .parse(process.argv);

const [uid] = program.args;

const isRevoke = program.opts().revoke;

if (!uid) {
  console.error('Error: No UID provided');
  process.exit(1);
}

const auth = getAuth(app);
auth.setCustomUserClaims(uid, { admin: !isRevoke }).then(() => {
  if (isRevoke) {
    console.log(`Successfully revoked admin privileges from user ${uid}`);
  }
  else {
    console.log(`Successfully granted admin privileges to user ${uid}`);
  }

  auth.getUser(uid).then((user) => {
    console.log('User custom claims:', user.customClaims);
    process.exit(0);
  })
})
