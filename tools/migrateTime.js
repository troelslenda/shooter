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

const migrateTime = async () => {
  const sessions = await db.collection('sessions').get()
  sessions.forEach(doc => {
    if (doc.data().date) {
      doc.ref.update({
        sessionDate: new Date(doc.data().date * 1000),
        date: admin.firestore.FieldValue.delete()
      })
    }
  })
}

migrateTime()