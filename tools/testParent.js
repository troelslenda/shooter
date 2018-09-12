// Load and configure Firebase Admin SDK to facilitate Firestore DB.
var admin = require("firebase-admin");
const serviceAccount = require('../.private/shooter-f5600-firebase-adminsdk-j3sx4-13d4b06b52.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore()
db.settings({
  timestampsInSnapshots: true
})

const sumShots = (total, shot) => total + (shot.toLowerCase() == 'x' ? 10 : parseInt(shot));

db.doc('/sessions/4HRo3XxeTUxAwVi8xKKs/round/a3vcmM3rtzguCxm4wmqS').get().then(snapshot =>{
    let score = 0;
    let tot = snapshot.data().shots.reduce(sumShots, 0)
    
    const updateData = {scores : []}
    updateData.scores.push({ type: snapshot.data().type, score: tot })

    snapshot.ref.parent.parent.set(updateData, {merge: true})
})
