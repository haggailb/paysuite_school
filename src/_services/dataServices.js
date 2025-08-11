import { FaLinesLeaning } from "react-icons/fa6";


  export const samplePrograms = [
  { 
    programId: 1,
    programCode: "BSC-CS",
    programName: "Bachelor of Science in Computer Science",
    programDesc: "Focuses on programming, algorithms, software development, and data structures.",
    facultyName: "Faculty Science and Technology"
  },
  {
    programId: 2,
    programCode: "BA-BA",
    programName: "Bachelor of Arts in Business Administration",
    programDesc: "Covers business operations, management principles, and organizational leadership.",
    facultyName: "Faculty Business and Economics"
  },
  {
    programId: 3,
    programCode: "BSC-NUR",
    programName: "Bachelor of Science in Nursing",
    programDesc: "Equips students with clinical and theoretical nursing knowledge.",
    facultyName: "Faculty Health Sciences"
  },
  {
    programId: 4,
    programCode: "BA-LAW",
    programName: "Bachelor of Arts in Law",
    programDesc: "Prepares students for legal professions with a foundation in legal theory and practice.",
    facultyName: "Faculty Law"
  },
  {
    programId: 5,
    programCode: "BSC-ENG",
    programName: "Bachelor of Science in Mechanical Engineering",
    programDesc: "Focuses on mechanical systems, design, thermodynamics, and materials science.",
    facultyName: "Faculty Engineering"
  },
  {
    programId: 6,
    programCode: "BA-MKT",
    programName: "Bachelor of Arts in Marketing",
    programDesc: "Explores market research, branding, digital marketing, and consumer behavior.",
    facultyName: "Faculty Business and Economics"
  },
  {
    programId: 7,
    programCode: "BSC-ECON",
    programName: "Bachelor of Science in Economics",
    programDesc: "Studies economic theory, modeling, statistics, and financial systems.",
    facultyName: "Faculty Social Sciences"
  },
  {
    programId: 8,
    programCode: "BSC-BIO",
    programName: "Bachelor of Science in Biology",
    programDesc: "Provides an understanding of living organisms, genetics, and ecosystems.",
    facultyName: "Faculty Science and Technology"
  },
  {
    programId: 9,
    programCode: "BSC-MATH",
    programName: "Bachelor of Science in Mathematics",
    programDesc: "Offers in-depth studies in calculus, algebra, statistics, and applied mathematics.",
    facultyName: "Faculty Science and Technology"
  },
  {
    programId: 10,
    programCode: "BSC-IT",
    programName: "Bachelor of Science in Information Technology",
    programDesc: "Focuses on IT infrastructure, networking, security, and system administration.",
    facultyName: "Faculty Science and Technology"
  }
];


export const sampleStudents = [
  {
    studentId: 'STU001',
    nationalId: '123456/78/9',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+260977123456',
    gender: 'Male',
    dob: '2002-04-15',
    address: 'Plot 10, Kafue Estates, Lusaka',
    program: 'Computer Science',
    classCode: 'CS101',
    profileImage: 'https://placehold.co/400',
    status: 'Active',
  },
  {
    studentId: 'STU002',
    nationalId: '987654/32/1',
    firstName: 'Jane',
    lastName: 'Mwamba',
    email: 'jane.mwamba@example.com',
    phone: '+260976654321',
    gender: 'Female',
    dob: '2003-01-25',
    address: 'House 5, Woodlands, Lusaka',
    program: 'Business Administration',
    classCode: 'BA201',
    profileImage: 'https://placehold.co/400',
    status: 'Active',
  },
  {
    studentId: 'STU003',
    nationalId: '112233/44/5',
    firstName: 'Peter',
    lastName: 'Zimba',
    email: 'peter.zimba@example.com',
    phone: '+260955223344',
    gender: 'Male',
    dob: '2001-11-05',
    address: 'Flat 3, Kabwata, Lusaka',
    program: 'Accounting',
    classCode: 'AC301',
    status: 'Suspended',
  },
  {
    studentId: 'STU004',
    nationalId: '556677/88/9',
    firstName: 'Lilian',
    lastName: 'Chileshe',
    email: 'lilian.chileshe@example.com',
    phone: '+260972112233',
    gender: 'Female',
    dob: '2004-06-10',
    address: 'Plot 77, Chelstone, Lusaka',
    program: 'Information Technology',
    classCode: 'IT401',
    status: 'Active',
  },
  {
    studentId: 'STU005',
    nationalId: '334455/66/7',
    firstName: 'Martin',
    lastName: 'Ngoma',
    email: 'martin.ngoma@example.com',
    phone: '+260973334455',
    gender: 'Male',
    dob: '2002-09-19',
    address: 'House 22, Matero, Lusaka',
    program: 'Human Resource Management',
    classCode: 'HR501',
    status: 'Inactive',
  }
];

export const sampleProgramCourseStructures = [
  {
    programCode: "BSC-CS",
    programName: "Bachalor of Science in Computer Science",
    structure: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: ["Intro to Programming", "Discrete Math"]
          },
          {
            semester: 2,
            courses: ["Web Development", "Linear Algebra"]
          }
        ]
      },
      {
        year: 2,
        semesters: [
          {
            semester: 1,
            courses: ["Data Structures", "Computer Networks"]
          },
          {
            semester: 2,
            courses: ["Database Systems"]
          }
        ]
      }
    ]
  },
  {
    programName: "ZICA Diploma in Accounting",
    structure: [
      {
        year: 1,
        semesters: [
          {
            semester: 1,
            courses: ["Intro to Accounting", "Business Math"]
          }
        ]
      }
    ]
  }
];


  export const sampleCourses = [
  {
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    courseDesc: 'Fundamental concepts of computer systems, programming, and algorithms.',
  },
  {
    courseCode: 'BA201',
    courseName: 'Principles of Business Administration',
    courseDesc: 'Overview of business operations, management, and organizational behavior.',
  },
  {
    courseCode: 'ACC102',
    courseName: 'Financial Accounting',
    courseDesc: 'Basic principles of accounting, financial statements, and bookkeeping.',
  },
  {
    courseCode: 'BIO105',
    courseName: 'General Biology',
    courseDesc: 'Introduction to cellular biology, genetics, and human biology systems.',
  },
  {
    courseCode: 'PHY110',
    courseName: 'Physics for Engineers',
    courseDesc: 'Mechanics, thermodynamics, and electromagnetism principles.',
  },
  {
    courseCode: 'MAT120',
    courseName: 'Calculus I',
    courseDesc: 'Limits, derivatives, and integrals of single-variable functions.',
  },
  {
    courseCode: 'ENG103',
    courseName: 'English Composition',
    courseDesc: 'Essay writing, grammar, and academic writing techniques.',
  },
  {
    courseCode: 'IT210',
    courseName: 'Web Development Basics',
    courseDesc: 'HTML, CSS, JavaScript fundamentals for web design and development.',
  },
  {
    courseCode: 'MKT205',
    courseName: 'Marketing Strategies',
    courseDesc: 'Principles of marketing, market analysis, and branding strategies.',
  },
  {
    courseCode: 'LAW300',
    courseName: 'Business Law',
    courseDesc: 'Legal environment of business, contracts, and regulatory compliance.',
  }
];


  export const sampleFaculties = [
  {
    facultyId: 1001,
    facultyName: "Faculty Science",
    facultyCode: "SCI",
    facultyDesc: "Covers all scientific programs including Biology, Physics, and Chemistry.",
    deanName: "Dr. Alice Mwansa",
    facultyEmail: "science@university.edu",
    facultyPhone: "+260 211 123456",
    office_location: "Block A, Main Campus"
  },
  {
    facultyId: 1002,
    facultyName: "School of Engineering",
    facultyCode: "ENG",
    facultyDesc: "Covers all scientific programs in engineering including Civil, Mechanical, and Electrical.",
    deanName: "Dr. Mabumbula",
    facultyEmail: "engineering@university.edu",
    facultyPhone: "+260 211 123456",
    office_location: "Block A, Main Campus"
  },
];

  export const sampleStaffMembers = [
    {
      staffId: 'EMP1001',
      nationalId: '123456/78/9',
      title: 'Dr.',
      firstName: 'Chitenge',
      lastName: 'Chishimba',
      gender: 'Male',
      dob: '2002-04-15',
      maritalStatus: 'Single',
      nationality: 'Zambian',
      phone: '+260977123456',
      email: 'john.doe@example.com',
      address: 'Plot 10, Kafue Estates, Lusaka',
      jobTitle: 'Lecturer',
      facultyName: 'School of Engineering',
      status: 'Active',
      profileImage: '/images/avatar.jpg'
    },
    {
      staffId: 'EMP1002',
      nationalId: '123456/78/9',
      title: 'Mr.',
      firstName: 'John',
      lastName: 'Doe',
      gender: 'Male',
      dob: '1990-01-01',
      maritalStatus: 'Single',
      nationality: 'Zambian',
      phone: '+260977123456',
      email: 'john.doe@example.com',
      address: 'Plot 10, Kafue Estates, Lusaka',
      jobTitle: 'Lecturer',
      facultyName: 'School of Natural Sciences',
      status: 'Active',
      profileImage: '/images/avatar.jpg'
    }
  ];

  export const sampleSystemModules = [
    { moduleId: 'MOD001', moduleName: 'Student Management', moduleDesc: 'Manage student records, registrations, and academic performance.' },
    { moduleId: 'MOD002', moduleName: 'Course Management', moduleDesc: 'Manage course offerings, schedules, and academic resources.' },
    { moduleId: 'MOD003', moduleName: 'Financial Management', moduleDesc: 'Handle financial transactions, invoicing, and payment processing.' },
    { moduleId: 'MOD004', moduleName: 'Library Management', moduleDesc: 'Manage library resources, book lending, and cataloging.' },
    { moduleId: 'MOD005', moduleName: 'Examination Management', moduleDesc: 'Manage examination schedules, results, and grading.' },
    { moduleId: 'MOD006', moduleName: 'Human Resource Management', moduleDesc: 'Manage staff records, payroll, and human resources operations.' },
  ];

  export const sampleAccessLevels = [
    { levelId: 'AL001', levelName: 'Administrator', levelDesc: 'Full access to all system modules.' },
    { levelId: 'AL002', levelName: 'Lecturer', levelDesc: 'Access to staff management and course modules.' },
    { levelId: 'AL003', levelName: 'Finance', levelDesc: 'Access to personal information and course materials.' },
    { levelId: 'AL004', levelName: 'Data Entry', levelDesc: 'Limited to data capturing.' }
  ];

  export const sampleAccessLevelModules = [
    { levelId: 'AL001', levelName:'Admin', moduleId: 'MOD001', moduleName: 'Student Management' },
    { levelId: 'AL001', levelName:'Admin', moduleId: 'MOD002', moduleName: 'Course Management' }
  ];

export const sampleUsers = [
  { fullprogramName: 'Alice Banda', email: 'alice@example.com', role: 'Tutor' },
  { fullprogramName: 'Brian Mwale', email: 'brian@example.com', role: 'Administrator' },
  { fullprogramName: 'Chanda Zulu', email: 'chanda@example.com', role: 'Student' },
];

export const sampleDeanAllocations = [
  { facultyId: 1001, facultyCode: 'SCI', facultyName: 'Faculty Science', staffId: 'STA001', staffName: 'Dr. Chitenge Chishimba' },
  { facultyId: 1002, facultyCode: 'ENG', facultyName: 'School of Engineering', staffId: 'STA002', staffName: 'Mr. John Doe' },
];

export const sampleProgramDirectors = [
  { programId: 1, programCode: 'BSC-CS', programName: 'Bachelor of Science in Computer Science', staffId: 'STA001', staffName: 'Dr. Chitenge Chishimba' },
  { programId: 2, programCode: 'BA-BA', programName: 'Bachelor of Arts in Business Administration', staffId: 'STA002', staffName: 'Mr. John Doe' },
];

export const sampleCourseDirectors = [
  { courseId: 1, courseCode: 'CS101', courseName: 'Introduction to Computer Science', staffId: 'STA001', staffName: 'Dr. Chitenge Chishimba' },
  { courseId: 2, courseCode: 'BA201', courseName: 'Principles of Business Administration', staffId: 'STA002', staffName: 'Mr. John Doe' },
];

export const samplePassGrading = [
  { grade: 'A', minPercentage: 80, maxPercentage: 100 },
  { grade: 'B', minPercentage: 70, maxPercentage: 79 },
  { grade: 'C', minPercentage: 60, maxPercentage: 69 },
  { grade: 'D', minPercentage: 50, maxPercentage: 59 },
  { grade: 'E', minPercentage: 40, maxPercentage: 49 },
  { grade: 'F', minPercentage: 0, maxPercentage: 39 }
];

export const sampleCOA = [
  // ---------- General Fund Income ----------
  {
    account_code: "4000",
    account_type: "Income",
    account_name: "Tuition - Undergraduate",
    description: "Tuition fees from undergraduate students",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4001",
    account_type: "Income",
    account_name: "Tuition - Postgraduate",
    description: "Tuition fees from postgraduate students",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4002",
    account_type: "Income",
    account_name: "Registration Fees",
    description: "One-time registration/enrolment fees",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4003",
    account_type: "Income",
    account_name: "Examination Fees",
    description: "Fees charged per exam or assessment",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4004",
    account_type: "Income",
    account_name: "Application Fees",
    description: "Fees for application processing",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4010",
    account_type: "Income",
    account_name: "Government Subventions",
    description: "Operational grants from government or ministry",
    applicable_to_students: false,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4040",
    account_type: "Income",
    account_name: "Consultancy Income",
    description: "Fees from consultancy services",
    applicable_to_students: false,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4050",
    account_type: "Income",
    account_name: "Short Courses & Workshops",
    description: "Income from non-degree courses",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4051",
    account_type: "Income",
    account_name: "Training & Professional Development",
    description: "Corporate trainings income",
    applicable_to_students: false,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4080",
    account_type: "Income",
    account_name: "Investment & Interest Income",
    description: "Bank deposits & investments income",
    applicable_to_students: false,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4090",
    account_type: "Income",
    account_name: "Service Charges Recovered",
    description: "Lab, clinic & service charges",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4100",
    account_type: "Income",
    account_name: "Student Fees - Miscellaneous",
    description: "Other student fees",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "4140",
    account_type: "Income",
    account_name: "Other Income",
    description: "Non-categorised income",
    applicable_to_students: false,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },

  // ---------- General Fund Expenses ----------
  {
    account_code: "5000",
    account_type: "Expense",
    account_name: "Salaries - Academic",
    description: "Academic staff salaries",
    applicable_to_students: false,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "5001",
    account_type: "Expense",
    account_name: "Salaries - Administrative",
    description: "Admin staff salaries",
    applicable_to_students: false,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "5002",
    account_type: "Expense",
    account_name: "Wages - Casual / Temporary",
    description: "Casual labour wages",
    applicable_to_students: false,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "5040",
    account_type: "Expense",
    account_name: "Utilities - Electricity",
    description: "Electricity for campus facilities",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "5041",
    account_type: "Expense",
    account_name: "Utilities - Water",
    description: "Water supply for campus",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "5050",
    account_type: "Expense",
    account_name: "Telecommunications & Internet",
    description: "Phone and internet services",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "5060",
    account_type: "Expense",
    account_name: "Repairs & Maintenance",
    description: "Maintenance of buildings and equipment",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "5070",
    account_type: "Expense",
    account_name: "Security Services",
    description: "Security guards and safety measures",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  },
  {
    account_code: "5080",
    account_type: "Expense",
    account_name: "Cleaning & Janitorial Supplies",
    description: "Campus cleaning services",
    applicable_to_students: true,
    q1_budgeted: 0, q2_budgeted: 0, q3_budgeted: 0, q4_budgeted: 0
  }
];

export const sampleExams = [
  {
    examId: 109,
    examCode: '202501BSC-CSY1S1',
    examName: '2025 Semester 1 Final',
    examYear: 2025,
    studyLevel: 1,
    semester: '1',
    programName: 'Bachelor of Science in Computer Science',
    programCode: 'BSC-CS',
    status: 'Scheduled'
  },
  {
    examId: 110,
    examCode: '202501BA-BAY1S1',
    examName: '2025 Semester 1 Final',
    examYear: 2025,
    studyLevel: 1,
    semester: '1',
    programName: 'Bachelor of Arts in Business Administration',
    programCode: 'BA-BA',
    status: 'Scheduled'
  },
  {
    examId: 111,
    examCode: '202501BSC-NURY1S1',
    examName: '2025 Semester 1 Final',
    examYear: 2025,
    studyLevel: 1,
    semester: '1',
    programName: 'Bachelor of Science in Nursing',
    programCode: 'BSC-NUR',
    status: 'Scheduled'
  }
];

export const sampleSchedules = [
  {
    scheduleId: 1,
    examCode: '202501BSCCSY1S1CS001',
    courseCode: 'CS101',
    courseName: 'Introduction to Computer Science',
    scheduledDate: '2025-06-15',
    startTime: '09:00',
    endTime: '12:00',
    examVenue: 'Main Auditorium',
    invigilator: 'Dr. Chitenge Chishimba'
  },
  {
    scheduleId: 2,
    examCode: '202501BSCCSY1S1CS001',
    courseCode: 'BA102',
    courseName: 'Principles of Business Administration',
    scheduledDate: '2025-06-16',
    startTime: '10:00',
    endTime: '13:00',
    examVenue: 'Lecture Hall 2',
    invigilator: 'Mr. John Doe'
  },
  {
    scheduleId: 3,
    examCode: '202501BSCCSY1S1CS001',
    courseCode: 'BA101',
    courseName: 'Communication Skills',
    scheduledDate: '2025-06-17',
    startTime: '11:00',
    endTime: '14:00',
    examVenue: 'Nursing Lab 1',
    invigilator: 'Ms. Lillian Chileshe'
  } 
];

export const sampleStudentExams = [
  {
    studentExamId: 1,
    examCode: '202501BSC-CSY1S1',
    courseCode: 'CS101',
    studentId: 'STU001',
    scheduledDate: '2025-06-15',
    startTime: '09:00',
    endTime: '12:00',
    totalMarks: 100,
    marksObtained: 85,
    attendance: 'Present',
  },
  {
    studentExamId: 2,
    examCode: '202501BA-BAY1S1',
    courseCode: 'BA201',
    studentId: 'STU002',
    scheduledDate: '2025-06-16',
    startTime: '10:00',
    endTime: '13:00',
    totalMarks: 100,
    marksObtained: 0,
    attendance: 'Absent',
  }
];

export const sampleProgramOutline = [
  {
    levelId:20001,
    programCode: 'BSC-CS',
    programName: 'Bachelor of Science in Computer Science',
    levelNumber: 1,
    levelName: 'Year 1 Sem 1',
    description: 'Foundation courses in computer science including programming and mathematics.',
    studyYear: 1,
    semester: 1,
    levelCode: 'BSC-CS-Y1S1',
    courses: [
      { courseCode: 'CS101', courseName: 'Introduction to Computer Science', credits: 3 },
      { courseCode: 'MATH101', courseName: 'Calculus I', credits: 3 },
      { courseCode: 'ENG101', courseName: 'English Composition', credits: 3 },
      { courseCode: 'PHY101', courseName: 'Physics for Engineers', credits: 3 },
      { courseCode: 'CS102', courseName: 'Web Development Basics', credits: 3 },
    ]
  },
  {
    levelId: 20002,
    programCode: 'BSC-CS',
    programName: 'Bachelor of Science in Computer Science',
    levelNumber: 2,
    levelName: 'Year 1 Sem 2',
    description: 'Introduction to business principles and management practices.',
    studyYear: 1,
    semester: 2,
    levelCode: 'BSC-CS-Y1S2',
    courses: [
      { courseCode: 'CS201', courseName: 'Data Structures', credits: 3 },
      { courseCode: 'MATH102', courseName: 'Linear Algebra', credits: 3 },
      { courseCode: 'BA101', courseName: 'Principles of Business Administration', credits: 3 },
      { courseCode: 'ENG102', courseName: 'Advanced English Composition', credits: 3 },
      { courseCode: 'CS202', courseName: 'Database Systems', credits: 3 },
    ]
  },
  {
    levelId: 20003,
    programCode: 'BSC-CS',
    programName: 'Bachelor of Science in Computer Science',
    levelNumber: 3,
    levelName: 'Year 2 Sem 1',
    description: 'Basic nursing theory and practice for aspiring nurses.',
    studyYear: 2,
    semester: 1,
    levelCode: 'BSC-CS-Y2S1',
    courses: [
      { courseCode: 'CS301', courseName: 'Computer Networks', credits: 3 },
      { courseCode: 'MATH201', courseName: 'Statistics', credits: 3 },
      { courseCode: 'BA201', courseName: 'Marketing Strategies', credits: 3 },
      { courseCode: 'ENG201', courseName: 'Technical Writing', credits: 3 },
      { courseCode: 'CS302', courseName: 'Software Engineering', credits: 3 },
    ]
  },
  {
    levelId: 20004,
    programCode: 'BSC-CS',
    programName: 'Bachelor of Science in Computer Science',
    levelNumber: 4,
    levelName: 'Year 2 Sem 2',
    description: 'Basic nursing theory and practice for aspiring nurses.',
    studyYear: 2,
    semester: 2,
    levelCode: 'BSC-CS-Y2S2',
    courses: [
      { courseCode: 'CS401', courseName: 'Operating Systems', credits: 3 },
      { courseCode: 'MATH202', courseName: 'Discrete Mathematics', credits: 3 },
      { courseCode: 'BA202', courseName: 'Financial Accounting', credits: 3 },
      { courseCode: 'ENG202', courseName: 'Business Communication', credits: 3 },
      { courseCode: 'CS402', courseName: 'Mobile App Development', credits: 3 },
    ]
  }
];

export const sampleLevelCourses = [
  { levelCourseId: 1, levelCourseCode: 'BSC-CS-Y1S1-CS101', courseCode: 'CS101', courseName: 'Introduction to Computer Science', credits: 3 },
  { levelCourseId: 2, levelCourseCode: 'BSC-CS-Y1S1-CS101', courseCode: 'MATH101', courseName: 'Calculus I', credits: 3 },
  { levelCourseId: 3, levelCourseCode: 'BSC-CS-Y1S1-CS101', courseCode: 'ENG101', courseName: 'English Composition', credits: 3 },
  { levelCourseId: 4, levelCourseCode: 'BSC-CS-Y1S1-CS101', courseCode: 'PHY101', courseName: 'Physics for Engineers', credits: 3 },
  { levelCourseId: 5, levelCourseCode: 'BSC-CS-Y1S1-CS101', courseCode: 'CS102', courseName: 'Web Development Basics', credits: 3 },
];

export const sampleLevelFees = [
  {
    feeId: 1001,
    feeCode: 'BSC-CS-Y1S1-4001',
    coaCode: '4001',
    coaName: 'Tuition Fee',
    amount: 5000
  }
];
