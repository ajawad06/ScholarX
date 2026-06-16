// Canonical list of NUST departments shared across students and instructors.
// Students belong to exactly one; instructors can oversee one or more.
export const DEPARTMENTS = [
  'Computer Science',
  'Data Science',
  'Artificial Intelligence',
  'Computer Engineering',
  'Software Engineering',
  'Electrical Engineering'
];

export function isValidDepartment(value) {
  return DEPARTMENTS.includes(value);
}

export function sanitizeDepartments(value) {
  const list = Array.isArray(value) ? value : [value];
  return [...new Set(list.filter((dept) => DEPARTMENTS.includes(dept)))];
}
