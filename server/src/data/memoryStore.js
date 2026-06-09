import bcrypt from 'bcryptjs';

const today = () => new Date().toISOString().slice(0, 10);

const studentPassword = bcrypt.hashSync('student123', 10);
const instructorPassword = bcrypt.hashSync('instructor123', 10);

export const db = {
  universities: [
    { id: 1, name: 'NUST', city: 'Islamabad', country: 'Pakistan', address: 'Sector H-12' },
    { id: 2, name: 'MIT', city: 'Cambridge', country: 'USA', address: '77 Massachusetts Ave' }
  ],
  programs: [
    {
      id: 1,
      name: 'Fall Exchange',
      duration: '6 months',
      requirements: 'GPA > 3.0',
      startDate: '2025-09-01',
      universityId: 2
    }
  ],
  scholarships: [
    {
      id: 1,
      name: 'Merit Scholarship',
      description: 'Awarded to top students',
      criteria: 'GPA > 3.7',
      fundingOrganization: 'HEC',
      coverage: 'Tuition + Accommodation',
      amount: 5000,
      deadline: '2025-08-01'
    }
  ],
  students: [
    {
      id: 1,
      name: 'Demo Student',
      email: 'student@nust.edu.pk',
      dob: '2005-12-29',
      nationality: 'Pakistani',
      contact: '03239850976',
      universityId: 1,
      gpa: 3.4,
      password: studentPassword,
      profilePic: null
    }
  ],
  instructors: [
    {
      id: 101,
      universityId: 1,
      fname: 'Dr.',
      mname: 'Naeem',
      lname: 'Zafar',
      email: 'naeem.zafar@nust.edu.pk',
      contact: '03001239876',
      department: 'AI & Data Science',
      password: instructorPassword,
      profilePic: null
    }
  ],
  exchangeApplications: [],
  scholarshipApplications: []
};

export function nextId(collection) {
  return collection.reduce((max, item) => Math.max(max, Number(item.id) || 0), 0) + 1;
}

export function publicStudent(student) {
  const university = db.universities.find((item) => item.id === Number(student.universityId));
  return {
    id: student.id,
    name: student.name,
    email: student.email,
    dob: student.dob,
    nationality: student.nationality,
    contact: student.contact,
    universityId: Number(student.universityId),
    university: university?.name || 'Unknown',
    gpa: Number(student.gpa),
    profilePic: student.profilePic
  };
}

export function publicInstructor(instructor) {
  return {
    id: instructor.id,
    universityId: Number(instructor.universityId),
    name: [instructor.fname, instructor.mname, instructor.lname].filter(Boolean).join(' '),
    fname: instructor.fname,
    mname: instructor.mname,
    lname: instructor.lname,
    email: instructor.email,
    contact: instructor.contact,
    department: instructor.department,
    profilePic: instructor.profilePic
  };
}

export function buildStudentDashboard(studentId) {
  const student = db.students.find((item) => item.id === Number(studentId));
  if (!student) return null;

  return {
    student: publicStudent(student),
    exchangeApplications: db.exchangeApplications
      .filter((item) => item.studentId === Number(studentId))
      .map((item) => ({
        ...item,
        programName: db.programs.find((program) => program.id === item.programId)?.name || 'Unknown'
      })),
    scholarshipApplications: db.scholarshipApplications
      .filter((item) => item.studentId === Number(studentId))
      .map((item) => ({
        ...item,
        scholarshipName: db.scholarships.find((scholarship) => scholarship.id === item.scholarshipId)?.name || 'Unknown'
      }))
  };
}

export function listPendingApplications(search = '') {
  const term = search.trim().toLowerCase();
  const matches = (...values) => !term || values.some((value) => String(value || '').toLowerCase().includes(term));

  return {
    exchangeApplications: db.exchangeApplications
      .filter((item) => item.status === 'Pending')
      .map((item) => {
        const student = db.students.find((entry) => entry.id === item.studentId);
        const program = db.programs.find((entry) => entry.id === item.programId);
        const university = db.universities.find((entry) => entry.id === student?.universityId);
        return {
          ...item,
          studentName: student?.name,
          gpa: student?.gpa,
          university: university?.name,
          programName: program?.name
        };
      })
      .filter((item) => matches(item.studentName, item.programName)),
    scholarshipApplications: db.scholarshipApplications
      .filter((item) => item.status === 'Pending')
      .map((item) => {
        const student = db.students.find((entry) => entry.id === item.studentId);
        const scholarship = db.scholarships.find((entry) => entry.id === item.scholarshipId);
        const university = db.universities.find((entry) => entry.id === student?.universityId);
        return {
          ...item,
          studentName: student?.name,
          gpa: student?.gpa,
          university: university?.name,
          scholarshipName: scholarship?.name
        };
      })
      .filter((item) => matches(item.studentName, item.scholarshipName))
  };
}

export function createApplication(type, studentId, selectedId) {
  if (type === 'exchange') {
    const application = {
      id: nextId(db.exchangeApplications),
      studentId: Number(studentId),
      programId: Number(selectedId),
      status: 'Pending',
      applicationDate: today(),
      approvalDate: null
    };
    db.exchangeApplications.push(application);
    return application;
  }

  const application = {
    id: nextId(db.scholarshipApplications),
    studentId: Number(studentId),
    scholarshipId: Number(selectedId),
    status: 'Pending',
    applicationDate: today(),
    approvalDate: null
  };
  db.scholarshipApplications.push(application);
  return application;
}
