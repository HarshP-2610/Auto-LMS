// Mock Data for AutoLMS

// User Data
export const currentUser = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  role: "student",
  avatar: "https://i.pravatar.cc/150?u=1",
  joinedDate: "2024-01-15",
};

// Courses Data
export const courses = [
  {
    id: "1",
    title: "Complete Web Development Bootcamp",
    description: "Learn HTML, CSS, JavaScript, React, Node.js and more in this comprehensive course.",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    instructor: {
      id: "101",
      name: "Sarah Johnson",
      avatar: "https://i.pravatar.cc/150?u=101",
      bio: "Senior Full Stack Developer with 10+ years of experience",
    },
    price: 89.99,
    originalPrice: 199.99,
    rating: 4.8,
    reviewCount: 245,
    category: "Development",
    level: "Beginner",
    duration: "42 hours",
    lessonsCount: 156,
    enrolledStudents: 1250,
    approved: true,
    createdAt: "2024-01-10",
    tags: ["Web Development", "JavaScript", "React", "Node.js"],
    lessons: [
      { id: "l1", title: "Introduction to Web Development", duration: "15:00", order: 1 },
      { id: "l2", title: "HTML5 Fundamentals", duration: "45:00", order: 2 },
      { id: "l3", title: "CSS3 Styling", duration: "50:00", order: 3 },
      { id: "l4", title: "JavaScript Basics", duration: "60:00", order: 4 },
    ],
  },
  {
    id: "2",
    title: "Python for Data Science Masterclass",
    description: "Master Python programming and learn data analysis, visualization, and machine learning.",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    instructor: {
      id: "102",
      name: "Michael Chen",
      avatar: "https://i.pravatar.cc/150?u=102",
      bio: "Data Scientist at Google with PhD in Machine Learning",
    },
    price: 94.99,
    originalPrice: 249.99,
    rating: 4.9,
    reviewCount: 189,
    category: "Data Science",
    level: "Intermediate",
    duration: "38 hours",
    lessonsCount: 124,
    enrolledStudents: 980,
    approved: true,
    createdAt: "2024-01-15",
    tags: ["Python", "Data Science", "Machine Learning", "Pandas"],
    lessons: [
      { id: "l5", title: "Python Basics", duration: "30:00", order: 1 },
      { id: "l6", title: "NumPy and Pandas", duration: "55:00", order: 2 },
      { id: "l7", title: "Data Visualization", duration: "45:00", order: 3 },
    ],
  },
  {
    id: "3",
    title: "UI/UX Design Professional",
    description: "Learn to design beautiful user interfaces and create amazing user experiences.",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    instructor: {
      id: "103",
      name: "Emily Davis",
      avatar: "https://i.pravatar.cc/150?u=103",
      bio: "Lead UX Designer at Apple with 8 years of experience",
    },
    price: 79.99,
    originalPrice: 179.99,
    rating: 4.7,
    reviewCount: 312,
    category: "Design",
    level: "Beginner",
    duration: "28 hours",
    lessonsCount: 89,
    enrolledStudents: 1560,
    approved: true,
    createdAt: "2024-01-20",
    tags: ["UI Design", "UX Design", "Figma", "Prototyping"],
    lessons: [
      { id: "l8", title: "Design Principles", duration: "25:00", order: 1 },
      { id: "l9", title: "Figma Basics", duration: "40:00", order: 2 },
      { id: "l10", title: "User Research", duration: "35:00", order: 3 },
    ],
  },
  {
    id: "4",
    title: "Mobile App Development with Flutter",
    description: "Build beautiful native apps for iOS and Android with a single codebase.",
    thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
    instructor: {
      id: "104",
      name: "David Wilson",
      avatar: "https://i.pravatar.cc/150?u=104",
      bio: "Mobile Developer and Flutter Google Developer Expert",
    },
    price: 84.99,
    originalPrice: 189.99,
    rating: 4.6,
    reviewCount: 156,
    category: "Mobile Development",
    level: "Intermediate",
    duration: "32 hours",
    lessonsCount: 98,
    enrolledStudents: 720,
    approved: true,
    createdAt: "2024-02-01",
    tags: ["Flutter", "Dart", "Mobile", "iOS", "Android"],
    lessons: [
      { id: "l11", title: "Flutter Setup", duration: "20:00", order: 1 },
      { id: "l12", title: "Widgets Overview", duration: "50:00", order: 2 },
      { id: "l13", title: "State Management", duration: "45:00", order: 3 },
    ],
  },
  {
    id: "5",
    title: "AWS Cloud Practitioner",
    description: "Prepare for AWS Cloud Practitioner certification with hands-on labs.",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800",
    instructor: {
      id: "105",
      name: "Robert Taylor",
      avatar: "https://i.pravatar.cc/150?u=105",
      bio: "AWS Solutions Architect with 5+ certifications",
    },
    price: 69.99,
    originalPrice: 149.99,
    rating: 4.8,
    reviewCount: 423,
    category: "Cloud Computing",
    level: "Beginner",
    duration: "24 hours",
    lessonsCount: 67,
    enrolledStudents: 2100,
    approved: true,
    createdAt: "2024-02-05",
    tags: ["AWS", "Cloud", "DevOps", "Certification"],
    lessons: [
      { id: "l14", title: "Cloud Concepts", duration: "30:00", order: 1 },
      { id: "l15", title: "AWS Core Services", duration: "60:00", order: 2 },
      { id: "l16", title: "Security and Compliance", duration: "40:00", order: 3 },
    ],
  },
  {
    id: "6",
    title: "Digital Marketing Mastery",
    description: "Learn SEO, social media marketing, email marketing, and paid advertising.",
    thumbnail: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    instructor: {
      id: "106",
      name: "Lisa Anderson",
      avatar: "https://i.pravatar.cc/150?u=106",
      bio: "Marketing Director with 12 years of digital marketing experience",
    },
    price: 59.99,
    originalPrice: 129.99,
    rating: 4.5,
    reviewCount: 278,
    category: "Marketing",
    level: "Beginner",
    duration: "20 hours",
    lessonsCount: 56,
    enrolledStudents: 1890,
    approved: true,
    createdAt: "2024-02-10",
    tags: ["Marketing", "SEO", "Social Media", "Google Ads"],
    lessons: [
      { id: "l17", title: "Marketing Fundamentals", duration: "25:00", order: 1 },
      { id: "l18", title: "SEO Strategies", duration: "45:00", order: 2 },
      { id: "l19", title: "Social Media Marketing", duration: "40:00", order: 3 },
    ],
  },
];

// Student's Enrolled Courses
export const enrolledCourses = [
  {
    id: "e1",
    courseId: "1",
    title: "Complete Web Development Bootcamp",
    thumbnail: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800",
    instructor: "Sarah Johnson",
    progress: 65,
    totalLessons: 156,
    completedLessons: 101,
    lastAccessed: "2024-03-15",
    enrolledDate: "2024-02-01",
    completed: false,
  },
  {
    id: "e2",
    courseId: "2",
    title: "Python for Data Science Masterclass",
    thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800",
    instructor: "Michael Chen",
    progress: 30,
    totalLessons: 124,
    completedLessons: 37,
    lastAccessed: "2024-03-14",
    enrolledDate: "2024-02-15",
    completed: false,
  },
  {
    id: "e3",
    courseId: "3",
    title: "UI/UX Design Professional",
    thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800",
    instructor: "Emily Davis",
    progress: 100,
    totalLessons: 89,
    completedLessons: 89,
    lastAccessed: "2024-03-10",
    enrolledDate: "2024-01-20",
    completed: true,
  },
];

// Quiz Data
export const quizzes = [
  {
    id: "q1",
    courseId: "1",
    courseTitle: "Complete Web Development Bootcamp",
    title: "HTML & CSS Fundamentals Quiz",
    description: "Test your knowledge of HTML and CSS basics",
    duration: 20,
    passingMarks: 70,
    totalQuestions: 10,
    questions: [
      {
        id: "ques1",
        question: "What does HTML stand for?",
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Hyper Transfer Markup Language",
          "Home Tool Markup Language",
        ],
        correctAnswer: 0,
      },
      {
        id: "ques2",
        question: "Which CSS property is used to change the text color?",
        options: ["text-color", "color", "font-color", "text-style"],
        correctAnswer: 1,
      },
      {
        id: "ques3",
        question: "What is the correct HTML element for the largest heading?",
        options: ["<h6>", "<heading>", "<h1>", "<head>"],
        correctAnswer: 2,
      },
    ],
  },
  {
    id: "q2",
    courseId: "2",
    courseTitle: "Python for Data Science Masterclass",
    title: "Python Basics Quiz",
    description: "Test your Python programming fundamentals",
    duration: 15,
    passingMarks: 75,
    totalQuestions: 8,
    questions: [
      {
        id: "ques4",
        question: "Which function is used to print output in Python?",
        options: ["echo()", "print()", "console.log()", "write()"],
        correctAnswer: 1,
      },
      {
        id: "ques5",
        question: "What is the correct file extension for Python files?",
        options: [".py", ".python", ".pt", ".p"],
        correctAnswer: 0,
      },
    ],
  },
];

// Quiz Results
export const quizResults = [
  {
    id: "r1",
    quizId: "q1",
    quizTitle: "HTML & CSS Fundamentals Quiz",
    courseTitle: "Complete Web Development Bootcamp",
    score: 85,
    passed: true,
    date: "2024-03-12",
    timeTaken: 15,
  },
  {
    id: "r2",
    quizId: "q2",
    quizTitle: "Python Basics Quiz",
    courseTitle: "Python for Data Science Masterclass",
    score: 60,
    passed: false,
    date: "2024-03-14",
    timeTaken: 12,
  },
];

// Certificates
export const certificates = [
  {
    id: "cert1",
    courseId: "3",
    courseTitle: "UI/UX Design Professional",
    studentName: "John Doe",
    certificateId: "AUT-LMS-2024-001",
    issuedDate: "2024-03-10",
    instructor: "Emily Davis",
    grade: "A",
  },
];

// Instructor Analytics
export const instructorAnalytics = {
  totalStudents: 3240,
  totalCourses: 5,
  totalRevenue: 45280,
  monthlyRevenue: [
    { month: "Jan", revenue: 3200 },
    { month: "Feb", revenue: 4500 },
    { month: "Mar", revenue: 5800 },
    { month: "Apr", revenue: 4200 },
    { month: "May", revenue: 5100 },
    { month: "Jun", revenue: 6800 },
  ],
  studentEnrollment: [
    { month: "Jan", students: 420 },
    { month: "Feb", students: 580 },
    { month: "Mar", students: 720 },
    { month: "Apr", students: 510 },
    { month: "May", students: 640 },
    { month: "Jun", students: 890 },
  ],
  coursePerformance: [
    { name: "Web Development", students: 1250, rating: 4.8 },
    { name: "Python Data Science", students: 980, rating: 4.9 },
    { name: "UI/UX Design", students: 1560, rating: 4.7 },
    { name: "Flutter", students: 720, rating: 4.6 },
    { name: "AWS", students: 2100, rating: 4.8 },
  ],
};

// Admin Analytics
export const adminAnalytics = {
  totalUsers: 15420,
  totalStudents: 12800,
  totalInstructors: 320,
  totalCourses: 850,
  pendingApprovals: 24,
  totalRevenue: 1256800,
  monthlyRevenue: [
    { month: "Jan", revenue: 85000 },
    { month: "Feb", revenue: 92000 },
    { month: "Mar", revenue: 108000 },
    { month: "Apr", revenue: 95000 },
    { month: "May", revenue: 112000 },
    { month: "Jun", revenue: 128000 },
  ],
  userGrowth: [
    { month: "Jan", students: 8200, instructors: 180 },
    { month: "Feb", students: 9200, instructors: 210 },
    { month: "Mar", students: 10500, instructors: 250 },
    { month: "Apr", students: 11200, instructors: 280 },
    { month: "May", students: 12000, instructors: 300 },
    { month: "Jun", students: 12800, instructors: 320 },
  ],
  topCourses: [
    { name: "AWS Cloud Practitioner", enrollments: 2100, revenue: 146979 },
    { name: "UI/UX Design Professional", enrollments: 1560, revenue: 124784 },
    { name: "Web Development Bootcamp", enrollments: 1250, revenue: 112488 },
  ],
};

// Users for Admin Management
export const users = [
  { id: "1", name: "John Doe", email: "john@example.com", role: "student", status: "active", joinedDate: "2024-01-15" },
  { id: "2", name: "Sarah Johnson", email: "sarah@example.com", role: "instructor", status: "active", joinedDate: "2024-01-10" },
  { id: "3", name: "Michael Chen", email: "michael@example.com", role: "instructor", status: "active", joinedDate: "2024-01-12" },
  { id: "4", name: "Emily Davis", email: "emily@example.com", role: "instructor", status: "active", joinedDate: "2024-01-18" },
  { id: "5", name: "David Wilson", email: "david@example.com", role: "instructor", status: "pending", joinedDate: "2024-03-15" },
  { id: "6", name: "Lisa Anderson", email: "lisa@example.com", role: "instructor", status: "pending", joinedDate: "2024-03-18" },
  { id: "7", name: "Alex Brown", email: "alex@example.com", role: "student", status: "active", joinedDate: "2024-02-01" },
  { id: "8", name: "Maria Garcia", email: "maria@example.com", role: "student", status: "blocked", joinedDate: "2024-02-10" },
];

// Pending Course Approvals
export const pendingCourses = [
  {
    id: "c1",
    title: "Advanced React Patterns",
    instructor: "David Wilson",
    instructorId: "104",
    category: "Development",
    level: "Advanced",
    submittedDate: "2024-03-15",
    lessonsCount: 45,
    duration: "18 hours",
  },
  {
    id: "c2",
    title: "Machine Learning A-Z",
    instructor: "Lisa Anderson",
    instructorId: "106",
    category: "Data Science",
    level: "Advanced",
    submittedDate: "2024-03-18",
    lessonsCount: 72,
    duration: "28 hours",
  },
];

// Testimonials
export const testimonials = [
  {
    id: "t1",
    quote: "This platform completely transformed my career. The courses are well-structured and the instructors are amazing!",
    author: "Jennifer Lee",
    role: "Software Developer",
    company: "Tech Corp",
    image: "https://i.pravatar.cc/150?u=201",
    rating: 5,
  },
  {
    id: "t2",
    quote: "I went from zero coding knowledge to a full-time developer job in just 6 months. Thank you AutoLMS!",
    author: "Mark Thompson",
    role: "Frontend Developer",
    company: "Startup Inc",
    image: "https://i.pravatar.cc/150?u=202",
    rating: 5,
  },
  {
    id: "t3",
    quote: "The best investment I've ever made in my education. The certificate helped me land my dream job.",
    author: "Anna Martinez",
    role: "UX Designer",
    company: "Design Studio",
    image: "https://i.pravatar.cc/150?u=203",
    rating: 5,
  },
];

// Categories
export const categories = [
  { id: "all", name: "All Courses", count: 850 },
  { id: "development", name: "Development", count: 245 },
  { id: "data-science", name: "Data Science", count: 128 },
  { id: "design", name: "Design", count: 156 },
  { id: "mobile", name: "Mobile Development", count: 89 },
  { id: "cloud", name: "Cloud Computing", count: 67 },
  { id: "marketing", name: "Marketing", count: 94 },
  { id: "business", name: "Business", count: 71 },
];

// Student Dashboard Stats
export const studentStats = {
  totalEnrolled: 3,
  completedCourses: 1,
  inProgressCourses: 2,
  certificatesEarned: 1,
  averageProgress: 65,
  quizAttempts: 5,
  quizPassed: 3,
  quizFailed: 2,
  weeklyProgress: [
    { day: "Mon", progress: 45 },
    { day: "Tue", progress: 52 },
    { day: "Wed", progress: 48 },
    { day: "Thu", progress: 60 },
    { day: "Fri", progress: 65 },
    { day: "Sat", progress: 70 },
    { day: "Sun", progress: 68 },
  ],
};

// How It Works Steps
export const howItWorks = [
  {
    id: 1,
    title: "Choose Your Course",
    description: "Browse our extensive library of courses and find the perfect one for your goals.",
    icon: "Search",
  },
  {
    id: 2,
    title: "Learn at Your Pace",
    description: "Study anytime, anywhere with lifetime access to course materials.",
    icon: "Clock",
  },
  {
    id: 3,
    title: "Practice & Quiz",
    description: "Test your knowledge with interactive quizzes and hands-on projects.",
    icon: "Brain",
  },
  {
    id: 4,
    title: "Get Certified",
    description: "Earn industry-recognized certificates to boost your career.",
    icon: "Award",
  },
];
