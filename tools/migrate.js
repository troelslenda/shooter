var admin = require("firebase-admin");
const serviceAccount = require('..private.json')

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

console.log('hest', process.argv[2]);

let inventory = {};


for (i = 1; i <= process.argv[4]; i++) {
  inventory[i] = {}
}

admin.firestore().collection("stands").doc(process.argv[2]).set({
    name : `Stand: ${process.argv[2]}`,
    lastIndexAt: new Date(),
    requireDeposit: true,
    standGroup: admin.firestore().doc('standGroups/global'),
    inventory : inventory,
    particleId: process.argv[3]
});