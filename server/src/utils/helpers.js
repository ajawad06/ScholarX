import { Counter } from '../models/Counter.js';
import { University } from '../models/University.js';

export async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { name: sequenceName },
    { $inc: { value: 1 } },
    { new: true, upsert: true }
  );
  return sequenceDocument.value;
}

export async function formatPublicStudent(student) {
  const university = await University.findOne({ id: Number(student.universityId) });
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    dob: student.dob,
    nationality: student.nationality,
    contact: student.contact,
    universityId: Number(student.universityId),
    university: university?.name || 'Unknown',
    department: student.department,
    gpa: Number(student.gpa),
    profilePic: student.profilePic
  };
}

export function formatPublicInstructor(instructor) {
  return {
    id: instructor.id,
    universityId: Number(instructor.universityId),
    name: [instructor.fname, instructor.mname, instructor.lname].filter(Boolean).join(' '),
    fname: instructor.fname,
    mname: instructor.mname,
    lname: instructor.lname,
    email: instructor.email,
    contact: instructor.contact,
    departments: Array.isArray(instructor.departments) ? instructor.departments : [],
    profilePic: instructor.profilePic
  };
}

export function formatPublicAdmin(admin) {
  return {
    id: admin.id,
    name: admin.name,
    email: admin.email
  };
}

