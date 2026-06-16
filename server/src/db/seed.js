import bcrypt from "bcryptjs";
import { Counter } from "../models/Counter.js";
import { Instructor } from "../models/Instructor.js";
import { Program } from "../models/Program.js";
import { Scholarship } from "../models/Scholarship.js";
import { Student } from "../models/Student.js";
import { University } from "../models/University.js";
import { Admin } from "../models/Admin.js";

export async function seedDatabase() {
  const adminCount = await Admin.countDocuments();
  if (adminCount === 0) {
    const adminPassword = await bcrypt.hash("admin123", 10);
    await Admin.create({
      id: 1,
      name: "ScholarX Admin",
      email: "admin@scholarx.com",
      password: adminPassword,
    });
    await Counter.updateOne(
      { name: "admins" },
      { $setOnInsert: { value: 1 } },
      { upsert: true },
    );
  }

  const universityCount = await University.countDocuments();
  // Check if NUST uses the old address or if count is low
  const nust = await University.findOne({ id: 1 });
  if (universityCount <= 2 || nust?.address === "Sector H-12") {
    // Force refresh to update addresses
    await University.deleteMany({});
    await University.insertMany([
      {
        id: 1,
        name: "NUST",
        city: "Islamabad",
        country: "Pakistan",
        address: "https://nust.edu.pk",
      },
      {
        id: 2,
        name: "MIT",
        city: "Cambridge",
        country: "USA",
        address: "https://www.mit.edu",
      },
      // Top 10 USA (besides MIT)
      {
        id: 3,
        name: "Harvard University",
        city: "Cambridge",
        country: "USA",
        address: "https://www.harvard.edu",
      },
      {
        id: 4,
        name: "Stanford University",
        city: "Stanford",
        country: "USA",
        address: "https://www.stanford.edu",
      },
      {
        id: 5,
        name: "UC Berkeley",
        city: "Berkeley",
        country: "USA",
        address: "https://www.berkeley.edu",
      },
      {
        id: 6,
        name: "Caltech",
        city: "Pasadena",
        country: "USA",
        address: "https://www.caltech.edu",
      },
      {
        id: 7,
        name: "Columbia University",
        city: "New York",
        country: "USA",
        address: "https://www.columbia.edu",
      },
      {
        id: 8,
        name: "Princeton University",
        city: "Princeton",
        country: "USA",
        address: "https://www.princeton.edu",
      },
      {
        id: 9,
        name: "Yale University",
        city: "New Haven",
        country: "USA",
        address: "https://www.yale.edu",
      },
      {
        id: 10,
        name: "Cornell University",
        city: "Ithaca",
        country: "USA",
        address: "https://www.cornell.edu",
      },
      {
        id: 11,
        name: "University of Chicago",
        city: "Chicago",
        country: "USA",
        address: "https://www.uchicago.edu",
      },
      {
        id: 12,
        name: "Johns Hopkins University",
        city: "Baltimore",
        country: "USA",
        address: "https://www.jhu.edu",
      },
      // Top 5 Canada
      {
        id: 13,
        name: "University of Toronto",
        city: "Toronto",
        country: "Canada",
        address: "https://www.utoronto.ca",
      },
      {
        id: 14,
        name: "UBC",
        city: "Vancouver",
        country: "Canada",
        address: "https://www.ubc.ca",
      },
      {
        id: 15,
        name: "McGill University",
        city: "Montreal",
        country: "Canada",
        address: "https://www.mcgill.ca",
      },
      {
        id: 16,
        name: "University of Alberta",
        city: "Edmonton",
        country: "Canada",
        address: "https://www.ualberta.ca",
      },
      {
        id: 17,
        name: "University of Waterloo",
        city: "Waterloo",
        country: "Canada",
        address: "https://uwaterloo.ca",
      },
      // Top 5 UK
      {
        id: 18,
        name: "University of Oxford",
        city: "Oxford",
        country: "UK",
        address: "https://www.ox.ac.uk",
      },
      {
        id: 19,
        name: "University of Cambridge",
        city: "Cambridge",
        country: "UK",
        address: "https://www.cam.ac.uk",
      },
      {
        id: 20,
        name: "Imperial College London",
        city: "London",
        country: "UK",
        address: "https://www.imperial.ac.uk",
      },
      {
        id: 21,
        name: "UCL",
        city: "London",
        country: "UK",
        address: "https://www.ucl.ac.uk",
      },
      {
        id: 22,
        name: "University of Edinburgh",
        city: "Edinburgh",
        country: "UK",
        address: "https://www.ed.ac.uk",
      },
      // Top 5 Australia
      {
        id: 23,
        name: "University of Melbourne",
        city: "Melbourne",
        country: "Australia",
        address: "https://www.unimelb.edu.au",
      },
      {
        id: 24,
        name: "University of Sydney",
        city: "Sydney",
        country: "Australia",
        address: "https://www.sydney.edu.au",
      },
      {
        id: 25,
        name: "University of Queensland",
        city: "Brisbane",
        country: "Australia",
        address: "https://www.uq.edu.au",
      },
      {
        id: 26,
        name: "ANU",
        city: "Canberra",
        country: "Australia",
        address: "https://www.anu.edu.au",
      },
      {
        id: 27,
        name: "UNSW Sydney",
        city: "Sydney",
        country: "Australia",
        address: "https://www.unsw.edu.au",
      },
      // Top 2 Chinese
      {
        id: 28,
        name: "Tsinghua University",
        city: "Beijing",
        country: "China",
        address: "https://www.tsinghua.edu.cn",
      },
      {
        id: 29,
        name: "Peking University",
        city: "Beijing",
        country: "China",
        address: "https://www.pku.edu.cn",
      },
      // Top 2 Malaysian
      {
        id: 30,
        name: "Universiti Malaya",
        city: "Kuala Lumpur",
        country: "Malaysia",
        address: "https://www.um.edu.my",
      },
      {
        id: 31,
        name: "Universiti Teknologi Malaysia",
        city: "Johor Bahru",
        country: "Malaysia",
        address: "https://www.utm.my",
      },
      // Top 2 UAE
      {
        id: 32,
        name: "UAE University",
        city: "Al Ain",
        country: "UAE",
        address: "https://www.uaeu.ac.ae",
      },
      {
        id: 33,
        name: "Khalifa University",
        city: "Abu Dhabi",
        country: "UAE",
        address: "https://www.ku.ac.ae",
      },
      // Top 2 Turkish
      {
        id: 34,
        name: "Koç University",
        city: "Istanbul",
        country: "Turkey",
        address: "https://www.ku.edu.tr",
      },
      {
        id: 35,
        name: "Sabancı University",
        city: "Istanbul",
        country: "Turkey",
        address: "https://www.sabanciuniv.edu",
      },
    ]);
    await Counter.updateOne(
      { name: "universities" },
      { $setOnInsert: { value: 35 } },
      { upsert: true },
    );
  }

  const programCount = await Program.countDocuments();
  if (programCount === 0) {
    await Program.create({
      id: 1,
      name: "Fall Exchange",
      duration: "6 months",
      requirements: "GPA > 3.0",
      startDate: "2025-09-01",
      universityId: 2,
    });
    await Counter.updateOne(
      { name: "programs" },
      { $setOnInsert: { value: 1 } },
      { upsert: true },
    );
  }

  const scholarshipCount = await Scholarship.countDocuments();
  if (scholarshipCount === 0) {
    await Scholarship.create({
      id: 1,
      name: "Merit Scholarship",
      description: "Awarded to top students",
      criteria: "GPA > 3.7",
      fundingOrganization: "HEC",
      coverage: "Tuition + Accommodation",
      amount: 5000,
      deadline: "2025-08-01",
    });
    await Counter.updateOne(
      { name: "scholarships" },
      { $setOnInsert: { value: 1 } },
      { upsert: true },
    );
  }

  // Remove legacy students created before the department field existed.
  await Student.deleteMany({ department: { $exists: false } });

  const studentCount = await Student.countDocuments();
  if (studentCount === 0) {
    const studentPassword = await bcrypt.hash("student123", 10);
    await Student.create({
      id: 1,
      name: "Demo Student",
      email: "student@nust.edu.pk",
      dob: "2005-12-29",
      nationality: "Pakistani",
      contact: "03239850976",
      universityId: 1,
      department: "Computer Science",
      gpa: 3.4,
      password: studentPassword,
      profilePic: null,
    });
    await Counter.updateOne(
      { name: "students" },
      { $setOnInsert: { value: 1 } },
      { upsert: true },
    );
  }

  // Remove legacy instructors created before the departments array existed.
  await Instructor.deleteMany({ departments: { $exists: false } });

  const instructorCount = await Instructor.countDocuments();
  if (instructorCount === 0) {
    const instructorPassword = await bcrypt.hash("instructor123", 10);
    await Instructor.create({
      id: 101,
      universityId: 1,
      fname: "Dr.",
      mname: "Naeem",
      lname: "Zafar",
      email: "naeem.zafar@nust.edu.pk",
      contact: "03001239876",
      departments: [
        "Computer Science",
        "Data Science",
        "Artificial Intelligence",
      ],
      password: instructorPassword,
      profilePic: null,
    });
    await Counter.updateOne(
      { name: "instructors" },
      { $setOnInsert: { value: 101 } },
      { upsert: true },
    );
  }

}
