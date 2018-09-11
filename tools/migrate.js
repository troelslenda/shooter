var admin = require("firebase-admin");
const serviceAccount = require('../.private/shooter-f5600-firebase-adminsdk-j3sx4-13d4b06b52.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore()

db.settings({
  timestampsInSnapshots: true
})

const isValidSession = data => !!(
  data &&
  data.type &&
  data.name &&
  data.time &&
  data.shots &&
  data.shots.length > 0
)

const addSession = async data => {
  try {
    const savedSessionRef = await db.collection("sessions").add({
      name: data.name,
      ts: data.time
    })
    const savedSessionDoc = await savedSessionRef.get()
    db.collection(`sessions/${savedSessionDoc.id}/round`).add({
      type: data.type,
      ts: data.time,
      shots: data.shots
    })
  } catch (e) {
    console.log(e.message)
  }
  finally {
    console.log(`Session processed for ${data.name}`)
  }
}

const migrateData = require('./migratedata.json')

for (i in migrateData) {
  let row = migrateData[i]
  if (isValidSession(row)) {
    addSession(row)
  }
}