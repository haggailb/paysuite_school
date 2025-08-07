

  export const samplePrograms = [
  {
    programCode: "BSC-CS",
    name: "Bachelor of Science in Computer Science",
    description: "Focuses on programming, algorithms, software development, and data structures.",
    faculty: "Faculty of Science and Technology"
  },
  {
    programCode: "BA-BA",
    name: "Bachelor of Arts in Business Administration",
    description: "Covers business operations, management principles, and organizational leadership.",
    faculty: "Faculty of Business and Economics"
  },
  {
    programCode: "BSC-NUR",
    name: "Bachelor of Science in Nursing",
    description: "Equips students with clinical and theoretical nursing knowledge.",
    faculty: "Faculty of Health Sciences"
  },
  {
    programCode: "BA-LAW",
    name: "Bachelor of Arts in Law",
    description: "Prepares students for legal professions with a foundation in legal theory and practice.",
    faculty: "Faculty of Law"
  },
  {
    programCode: "BSC-ENG",
    name: "Bachelor of Science in Mechanical Engineering",
    description: "Focuses on mechanical systems, design, thermodynamics, and materials science.",
    faculty: "Faculty of Engineering"
  },
  {
    programCode: "BA-MKT",
    name: "Bachelor of Arts in Marketing",
    description: "Explores market research, branding, digital marketing, and consumer behavior.",
    faculty: "Faculty of Business and Economics"
  },
  {
    programCode: "BSC-ECON",
    name: "Bachelor of Science in Economics",
    description: "Studies economic theory, modeling, statistics, and financial systems.",
    faculty: "Faculty of Social Sciences"
  },
  {
    programCode: "BSC-BIO",
    name: "Bachelor of Science in Biology",
    description: "Provides an understanding of living organisms, genetics, and ecosystems.",
    faculty: "Faculty of Science and Technology"
  },
  {
    programCode: "BSC-MATH",
    name: "Bachelor of Science in Mathematics",
    description: "Offers in-depth studies in calculus, algebra, statistics, and applied mathematics.",
    faculty: "Faculty of Science and Technology"
  },
  {
    programCode: "BSC-IT",
    name: "Bachelor of Science in Information Technology",
    description: "Focuses on IT infrastructure, networking, security, and system administration.",
    faculty: "Faculty of Science and Technology"
  }
];


export const sampleStudents = [
    {
        id: 'STU001',
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
        id: 'STU002',
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
        id: 'STU003',
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
        id: 'STU004',
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
        id: 'STU005',
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

export const sampleProgramStructures = [
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
    id: 1001,
    name: "Faculty of Science",
    code: "SCI",
    description: "Covers all scientific programs including Biology, Physics, and Chemistry.",
    dean: "Dr. Alice Mwansa",
    email: "science@university.edu",
    phone: "+260 211 123456",
    office_location: "Block A, Main Campus"
  },
  {
    id: 1002,
    name: "School of Engineering",
    code: "ENG",
    description: "Covers all scientific programs in engineering including Civil, Mechanical, and Electrical.",
    dean: "Dr. Mabumbula",
    email: "engineering@university.edu",
    phone: "+260 211 123456",
    office_location: "Block A, Main Campus"
  },
];

  export const sampleStaffMembers = [
    {
      employeeId: 'EMP1001',
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
      employeeId: 'EMP1002',
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

  export const sampleProgramOutline = [
    {
      structuredCode: 'BSC-CS-CS001-1-1',
      programCode: 'BSC-CS',
      courseCode: 'CS001',
      studyLevel: 1,
      semester: 1,
      programName: 'Bachelor of Science in Computer Science',
      courseName: 'Intro to Programming',
    },
    {
      structuredCode: 'BSC-CS-BA001-1-1',
      programCode: 'BA-BA',
      courseCode: 'BA001',
      studyLevel: 1,
      semester: 1,
      programName: 'Bachelor of Science in Computer Science',
      courseName: 'Communication Skills',
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
    { levelId: 'AL001', levelName: 'Admin', levelDesc: 'Full access to all system modules.' },
    { levelId: 'AL002', levelName: 'Staff', levelDesc: 'Access to staff management and course modules.' },
    { levelId: 'AL003', levelName: 'Student', levelDesc: 'Access to personal information and course materials.' },
    { levelId: 'AL004', levelName: 'Guest', levelDesc: 'Limited access to public resources.' }
  ];

  export const sampleAccessLevelModules = [
    { levelId: 'AL001', levelName:'Admin', moduleId: 'MOD001', moduleName: 'Student Management' },
    { levelId: 'AL001', levelName:'Admin', moduleId: 'MOD002', moduleName: 'Course Management' }
  ];

export const sampleUsers = [
  { fullName: 'Alice Banda', email: 'alice@example.com', role: 'Tutor' },
  { fullName: 'Brian Mwale', email: 'brian@example.com', role: 'Administrator' },
  { fullName: 'Chanda Zulu', email: 'chanda@example.com', role: 'Student' },
];

