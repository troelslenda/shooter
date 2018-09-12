
import * as functions from 'firebase-functions';
import { isEqual, reduce } from 'lodash'

/**
 * Summerize the score treating X as 10.
 * 
 * @param total 
 * @param shot 
 */
const sumShots = (total: number, shot: any) => total + (shot.toLowerCase() == 'x' ? 10 : parseInt(shot));
const sumScore = (results, value, key) => {
    return results + value.score
}

export const roundCreated = functions.firestore
  .document('sessions/{sessionId}/round/{roundId}')
  .onCreate((snap, context) => {
    const data = snap.data();
    const score = data.shots.reduce(sumShots, 0)

    const updateData = {scores : []}
    updateData.scores.push({ type: data.type, score: score })

    return snap.ref.parent.parent.set(updateData, {merge: true})
  });

  export const calculateScore = functions.firestore
  .document('sessions/{sessionId}')
  .onUpdate((change, context) => {
    const prev = change.before.data();
    const next = change.after.data();
    
    if (next.scores && !isEqual(prev.scores, next.scores)) {
        const total = reduce(next.scores, sumScore, 0);
        return change.after.ref.update({totalScore : total})
    }
    return false;
 });
