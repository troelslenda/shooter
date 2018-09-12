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

/**
 * Validate the data in a session
 * 
 * Required properties:
 * - type
 * - name
 * - time
 * - shots
 * 
 * @param {*} data 
 */
const isValidSession = data => !!(
  data &&
  data.type &&
  data.name &&
  data.time &&
  data.shots &&
  data.shots.length > 0
)

/**
 * Add one session to Firestore
 * 
 * @param {*} data 
 */
const addSession = async data => {
  try {
    // Save session and get the refrence to the document.
    const savedSessionRef = await db.collection("sessions").add({
      name: data.name,
      date: data.time
    })
    // The refference dosen't directly contain the identifier so
    // we need to load the document first.
    const savedSessionDoc = await savedSessionRef.get()
    // Nest the score as a round document under sessions.
    // This will make further migration easier when grouping
    // multiple rounds in a session.
    await db.collection(`sessions/${savedSessionDoc.id}/round`).add({
      type: data.type,
      time: data.time,
      shots: data.shots
    })
  } catch (e) {
    console.log(e.message)
  }
  // Just log to console to show some kind of progress in the
  // terminal.
  finally {
    console.log(`Session processed for ${data.name}`)
  }
}

const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array)
  }
}

const waitFor = (ms) => new Promise(r => setTimeout(r, ms))

// Load the data to migrate, loop through, validate and process it.
const migrateData = require('./migratedata.json')
// Throttle down the migration since Spark Firebase plan has a limit
// of cloud function executions pr second.
const startMigrate = async () => {
  await asyncForEach(migrateData, async (row) => {
    if (isValidSession(row)) {
      console.log(row.shots.length)
     await addSession(row)
    }
    await waitFor(100)
  })
  console.log('Done')
}
startMigrate()

