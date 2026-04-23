// AppRoutes.tsx handles the main routing for the application.
import { Routes, Route } from 'react-router-dom';

// Public Pages
import { Home } from '@/pages/public/Home';
import { Courses } from '@/pages/public/Courses';
import { CourseDetails } from '@/pages/public/CourseDetails';
import { About } from '@/pages/public/About';
import { Contact } from '@/pages/public/Contact';
import { CourseConfirmation } from '@/pages/checkout/CourseConfirmation';
import { PaymentPage } from '@/pages/checkout/PaymentPage';
import { PaymentSuccess } from '@/pages/checkout/PaymentSuccess';
import { VerifyPage } from '@/pages/checkout/VerifyPage';

// Auth Pages
import { Login } from '@/pages/auth/Login';
import { Register } from '@/pages/auth/Register';
import { InstructorLogin } from '@/pages/auth/InstructorLogin';
import { InstructorRegister } from '@/pages/auth/InstructorRegister';
import { AdminLogin } from '@/pages/auth/AdminLogin';
import { AuthSuccess } from '@/pages/auth/AuthSuccess';
import { PendingDetails } from '@/pages/instructor/PendingDetails';
import { ApplicationStatus } from '@/pages/instructor/ApplicationStatus';

// Student Dashboard
import { StudentDashboard } from '@/dashboards/student/StudentDashboard';
import { MyCourses } from '@/dashboards/student/MyCourses';
import { QuizPage } from '@/dashboards/student/QuizPage';
import { Certificates } from '@/dashboards/student/Certificates';
import { StudentProfile } from '@/dashboards/student/StudentProfile';
import { QuizzesList } from '@/dashboards/student/QuizzesList';
import { CourseLearning } from '@/dashboards/student/CourseLearning';
import { QuizResultView } from '@/dashboards/student/QuizResultView';
import { WishlistPage } from '@/dashboards/student/WishlistPage';

// Instructor Dashboard
import { InstructorDashboard } from '@/dashboards/instructor/InstructorDashboard';
import { ManageCourses } from '@/dashboards/instructor/ManageCourses';
import { ManageLessons } from '@/dashboards/instructor/ManageLessons';
import { ManageQuizzes } from '@/dashboards/instructor/ManageQuizzes';
import { InstructorStudents } from '@/dashboards/instructor/InstructorStudents';
import { StudentDetails } from '@/dashboards/instructor/StudentDetails';
import { InstructorAnalytics } from '@/dashboards/instructor/InstructorAnalytics';
import { InstructorProfile } from '@/dashboards/instructor/InstructorProfile';

// Admin Dashboard
import { AdminDashboard } from '@/dashboards/admin/AdminDashboard';
import { ManageStudents } from '@/dashboards/admin/ManageStudents';
import { ManageInstructors } from '@/dashboards/admin/ManageInstructors';
import { ManageCourses as AdminManageCourses } from '@/dashboards/admin/ManageCourses';
import { PlatformAnalytics } from '@/dashboards/admin/PlatformAnalytics';
import { SystemSettings } from '@/dashboards/admin/SystemSettings';
import { AdminRequests } from '@/dashboards/admin/AdminRequests';
import { AdminProfile } from '@/dashboards/admin/AdminProfile';
import { AdminStudentDetails } from '@/dashboards/admin/AdminStudentDetails';
import { InstructorPortfolio } from '@/dashboards/admin/InstructorPortfolio';
import { AdminInstructorCourses } from '@/dashboards/admin/AdminInstructorCourses';
import { Messages } from '@/pages/shared/Messages';

export function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/courses/:id" element={<CourseDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/checkout/confirmation/:id" element={<CourseConfirmation />} />
      <Route path="/checkout/payment/:id" element={<PaymentPage />} />
      <Route path="/checkout/success" element={<PaymentSuccess />} />
      <Route path="/verify/:sessionId" element={<VerifyPage />} />

      {/* Auth Routes */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/register" element={<Register />} />
      <Route path="/auth-success" element={<AuthSuccess />} />
      <Route path="/auth/instructor-login" element={<InstructorLogin />} />
      <Route path="/auth/instructor-register" element={<InstructorRegister />} />
      <Route path="/auth/admin-login" element={<AdminLogin />} />
      <Route path="/instructor/pending-details" element={<PendingDetails />} />
      <Route path="/instructor/application-status" element={<ApplicationStatus />} />

      {/* Student Dashboard Routes */}
      <Route path="/student/dashboard" element={<StudentDashboard />} />
      <Route path="/student/courses" element={<MyCourses />} />
      <Route path="/student/quizzes" element={<QuizzesList />} />
      <Route path="/student/quiz/:id" element={<QuizPage />} />
      <Route path="/student/quiz-result/:id" element={<QuizResultView />} />
      <Route path="/student/certificates" element={<Certificates />} />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route path="/student/knowledge/:id" element={<CourseLearning />} />
      <Route path="/student/wishlist" element={<WishlistPage />} />
      <Route path="/student/messages" element={<Messages />} />

      {/* Instructor Dashboard Routes */}
      <Route path="/instructor/dashboard" element={<InstructorDashboard />} />
      <Route path="/instructor/courses" element={<ManageCourses />} />
      <Route path="/instructor/lessons" element={<ManageLessons />} />
      <Route path="/instructor/quizzes" element={<ManageQuizzes />} />
      <Route path="/instructor/students" element={<InstructorStudents />} />
      <Route path="/instructor/students/:id" element={<StudentDetails />} />
      <Route path="/instructor/analytics" element={<InstructorAnalytics />} />
      <Route path="/instructor/profile" element={<InstructorProfile />} />
      <Route path="/instructor/messages" element={<Messages />} />

      {/* Admin Dashboard Routes */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/students" element={<ManageStudents />} />
      <Route path="/admin/students/:id" element={<AdminStudentDetails />} />
      <Route path="/admin/instructors" element={<ManageInstructors />} />
      <Route path="/admin/instructors/:id/portfolio" element={<InstructorPortfolio />} />
      <Route path="/admin/instructors/:id/courses" element={<AdminInstructorCourses />} />
      <Route path="/admin/courses" element={<AdminManageCourses />} />
      <Route path="/admin/requests" element={<AdminRequests />} />
      <Route path="/admin/analytics" element={<PlatformAnalytics />} />
      <Route path="/admin/settings" element={<SystemSettings />} />
      <Route path="/admin/profile" element={<AdminProfile />} />

      {/* 404 Route */}
      <Route path="*" element={<div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
          <p className="text-gray-600 dark:text-gray-400">Page not found</p>
        </div>
      </div>} />
    </Routes>
  );
}
