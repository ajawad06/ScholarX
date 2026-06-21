import { Program } from '../models/Program.js';
import { Scholarship } from '../models/Scholarship.js';
import { ExchangeApplication } from '../models/ExchangeApplication.js';
import { ScholarshipApplication } from '../models/ScholarshipApplication.js';

// Returns today's date as a YYYY-MM-DD string, matching how startDate/deadline
// are stored. Lexicographic comparison on this format is chronologically correct.
export function todayString() {
  return new Date().toISOString().slice(0, 10);
}

// Mongo query for an expired ISO date field (strictly before today). The
// `$type: 'string'` + `$gt: ''` guards avoid matching null/empty values.
export function expiredDateQuery(field, today = todayString()) {
  return { [field]: { $type: 'string', $gt: '', $lt: today } };
}

// Permanently delete expired programs/scholarships, BUT only the ones that no
// application still references. Expired items that are still tied to a student
// application are kept so their names continue to resolve while instructors
// process those applications (which usually happens after the deadline). They
// will be cleaned up automatically once no application points to them anymore.
export async function purgeExpiredOpportunities() {
  const today = todayString();

  const [expiredPrograms, expiredScholarships] = await Promise.all([
    Program.find(expiredDateQuery('startDate', today)),
    Scholarship.find(expiredDateQuery('deadline', today))
  ]);

  let programsRemoved = 0;
  for (const program of expiredPrograms) {
    const inUse = await ExchangeApplication.exists({ programId: program.id });
    if (!inUse) {
      await Program.deleteOne({ id: program.id });
      programsRemoved += 1;
    }
  }

  let scholarshipsRemoved = 0;
  for (const scholarship of expiredScholarships) {
    const inUse = await ScholarshipApplication.exists({
      scholarshipId: scholarship.id
    });
    if (!inUse) {
      await Scholarship.deleteOne({ id: scholarship.id });
      scholarshipsRemoved += 1;
    }
  }

  if (programsRemoved || scholarshipsRemoved) {
    console.log(
      `Purged expired, unreferenced opportunities: ${programsRemoved} program(s), ` +
        `${scholarshipsRemoved} scholarship(s).`
    );
  }

  return { programsRemoved, scholarshipsRemoved };
}
