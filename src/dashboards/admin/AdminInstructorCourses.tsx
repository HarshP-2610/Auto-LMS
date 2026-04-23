import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  ChevronRight, 
  Loader2, 
  ArrowLeft,
  Calendar,
  PlayCircle,
  FileCheck,
  GraduationCap,
  TrendingUp,
  Star,
  Library,
  Target
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface Student {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  createdAt: string;
}

interface Topic {
  _id: string;
  title: string;
  duration: string;
}

interface Lesson {
  _id: string;
  title: string;
  order: number;
  topics: Topic[];
}

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  category: string;
  enrolledStudents: Student[];
  curriculum: Lesson[];
  quizzes: any[];
  price: number;
  createdAt: string;
}

interface InstructorDetails {
  instructor: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
    instructorTitle: string;
  };
  courses: Course[];
}

export function AdminInstructorCourses() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<InstructorDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInstructorAuditDetails();
    }
  }, [id]);

  const fetchInstructorAuditDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/instructor-details`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      const resData = await response.json();
      if (response.ok) {
        setData(resData);
      } else {
        toast.error(resData.message || 'Failed to fetch details');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="admin">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500 font-bold animate-pulse">Auditing Faculty Curriculum...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout userRole="admin">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instructor Audit Details Not Found</h2>
          <Button onClick={() => navigate('/admin/instructors')} className="mt-4">Back to Faculty</Button>
        </div>
      </DashboardLayout>
    );
  }

  const { instructor, courses } = data;

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Navigation & Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => navigate('/admin/instructors')}
                className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
                <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">
                <span>Faculty Analytics</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-blue-600">Curriculum Audit</span>
              </div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                Course Portfolio: <span className="text-blue-600">{instructor.name}</span>
              </h1>
            </div>
          </div>
          
          <div className="flex items-center gap-6 bg-white dark:bg-gray-900 px-6 py-3 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
             <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Global Reach</p>
                <p className="text-xl font-black text-gray-900 dark:text-white">
                   {courses.reduce((acc, curr) => acc + curr.enrolledStudents.length, 0)} <span className="text-xs text-gray-400">Students</span>
                </p>
             </div>
             <div className="w-px h-8 bg-gray-100"></div>
             <div className="text-right">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Output</p>
                <p className="text-xl font-black text-blue-600">
                   {courses.length} <span className="text-xs text-gray-400">Courses</span>
                </p>
             </div>
          </div>
        </div>

        {/* Global Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] text-white shadow-xl shadow-blue-500/20 relative overflow-hidden">
              <div className="relative z-10">
                 <p className="text-blue-100 font-bold uppercase tracking-widest text-[10px] mb-2">Total Curriculum Depth</p>
                 <h2 className="text-4xl font-black mb-1">
                    {courses.reduce((acc, c) => acc + c.curriculum.reduce((a, l) => a + l.topics.length, 0), 0)}
                 </h2>
                 <p className="text-blue-100 text-sm font-medium">Individual Learning Topics</p>
              </div>
              <Library className="absolute top-1/2 right-0 -translate-y-1/2 w-40 h-40 opacity-10 -mr-10 rotate-12" />
           </div>

           <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-500/5">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center text-purple-600">
                    <FileCheck className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Assessment Mastery</h3>
                    <p className="text-xs text-gray-500 font-medium font-outfit">Validated knowledge checks</p>
                 </div>
              </div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white">
                 {courses.reduce((acc, c) => acc + (c.quizzes?.length || 0), 0)} <span className="text-sm font-bold text-gray-400">Quizzes</span>
              </h2>
           </div>

           <div className="bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-500/5">
              <div className="flex items-center gap-4 mb-4">
                 <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center text-emerald-600">
                    <TrendingUp className="w-6 h-6" />
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-900 dark:text-white">Revenue Impact</h3>
                    <p className="text-xs text-gray-500 font-medium font-outfit">Platform growth contribution</p>
                 </div>
              </div>
              <h2 className="text-3xl font-black text-emerald-600">
                 ${courses.reduce((acc, c) => acc + (c.price * c.enrolledStudents.length), 0).toLocaleString()}
              </h2>
           </div>
        </div>

        {/* Detailed Course Audit List */}
        <div className="space-y-10">
           <div className="flex items-center gap-3">
              <div className="h-8 w-1.5 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white">Curriculum & Engagement Deep-Dive</h2>
           </div>

           <div className="grid grid-cols-1 gap-10">
              {courses.map((course, idx) => (
                 <motion.div 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={course._id}
                    className="bg-white dark:bg-gray-900 rounded-[3rem] border border-gray-100 dark:border-gray-800 shadow-2xl shadow-gray-200/20 overflow-hidden"
                 >
                    <div className="flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-gray-100 dark:divide-gray-800">
                       {/* Course Summary Sidebar */}
                       <div className="lg:w-80 p-8 space-y-6 bg-gray-50/50 dark:bg-gray-800/20">
                          <div className="aspect-video rounded-2xl overflow-hidden shadow-lg mb-4">
                             <img 
                                src={course.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail || 'no-image.jpg'}`}
                                alt={course.title}
                                className="w-full h-full object-cover"
                             />
                          </div>
                          <div>
                             <Badge variant="secondary" className="bg-blue-600 text-white border-none rounded-lg font-black tracking-widest text-[10px] mb-2">
                                {course.category.toUpperCase()}
                             </Badge>
                             <h3 className="text-xl font-black text-gray-900 dark:text-white leading-tight">
                                {course.title}
                             </h3>
                          </div>
                          
                          <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                             <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400">Total Enrolled</span>
                                <span className="text-sm font-black text-gray-900 dark:text-white">{course.enrolledStudents.length} Students</span>
                             </div>
                             <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400">Price Point</span>
                                <span className="text-sm font-black text-blue-600">${course.price}</span>
                             </div>
                             <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-gray-400">Published</span>
                                <span className="text-sm font-black text-gray-900 dark:text-white">{new Date(course.createdAt).toLocaleDateString()}</span>
                             </div>
                          </div>

                          <Button 
                            className="w-full h-11 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 shadow-none gap-2"
                            onClick={() => navigate(`/courses/${course._id}`)}
                          >
                             Preview Public Page
                             <ChevronRight className="w-4 h-4" />
                          </Button>
                       </div>

                       {/* Curriculum Audit Area */}
                       <div className="flex-1 p-8 lg:p-12 space-y-10">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             {/* Modules & Topics */}
                             <div className="space-y-6">
                                <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                   <BookOpen className="w-4 h-4 text-purple-600" />
                                   Curriculum Structure
                                </h4>
                                
                                <Accordion type="single" collapsible className="w-full space-y-3">
                                   {course.curriculum.map((lesson, lIdx) => (
                                      <AccordionItem key={lesson._id} value={lesson._id} className="border border-gray-100 dark:border-gray-800 rounded-2xl overflow-hidden px-4 bg-white dark:bg-gray-900 shadow-sm">
                                         <AccordionTrigger className="hover:no-underline py-4">
                                            <div className="flex items-center gap-4 text-left">
                                               <span className="w-7 h-7 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center text-[10px] font-black text-gray-500">
                                                  {lIdx + 1}
                                               </span>
                                               <span className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{lesson.title}</span>
                                            </div>
                                         </AccordionTrigger>
                                         <AccordionContent className="pb-4 pt-1">
                                            <div className="space-y-2 pl-11">
                                               {lesson.topics.map((topic, tIdx) => (
                                                  <div key={topic._id} className="flex items-center justify-between text-xs py-2 border-b border-gray-50 dark:border-gray-800 last:border-0 group/topic">
                                                     <div className="flex items-center gap-2">
                                                        <PlayCircle className="w-3.5 h-3.5 text-gray-300 group-hover/topic:text-blue-600 transition-colors" />
                                                        <span className="text-gray-600 dark:text-gray-400 font-medium">{topic.title}</span>
                                                     </div>
                                                     <span className="text-gray-400 uppercase tracking-tighter text-[9px] font-bold">{topic.duration}</span>
                                                  </div>
                                               ))}
                                               {lesson.topics.length === 0 && <p className="text-xs text-gray-400 italic">No topics for this module.</p>}
                                            </div>
                                         </AccordionContent>
                                      </AccordionItem>
                                   ))}
                                </Accordion>
                                {course.curriculum.length === 0 && (
                                   <div className="p-10 border-2 border-dashed border-gray-100 rounded-3xl text-center">
                                      <p className="text-sm font-bold text-gray-400 italic">Curriculum not yet populated.</p>
                                   </div>
                                )}
                             </div>

                             {/* Students & Engagement */}
                             <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                   <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                      <Users className="w-4 h-4 text-blue-600" />
                                      Enrolled Students
                                   </h4>
                                   <Badge className="bg-blue-50 text-blue-600 border-none font-bold rounded-lg px-2 text-[10px]">
                                      {course.enrolledStudents.length} Total
                                   </Badge>
                                </div>

                                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                   {course.enrolledStudents.map((student) => (
                                      <div key={student._id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/40 rounded-2xl border border-gray-100 dark:border-gray-800 group/student hover:border-blue-200 transition-colors">
                                         <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl overflow-hidden border border-white shadow-sm group-hover/student:scale-110 transition-transform">
                                               <img 
                                                  src={student.avatar.startsWith('http') ? student.avatar : `http://localhost:5000/uploads/${student.avatar}`}
                                                  className="w-full h-full object-cover"
                                                  onError={(e) => {
                                                     (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(student.name)}&size=128&background=random&color=fff`;
                                                  }}
                                               />
                                            </div>
                                            <div>
                                               <p className="text-sm font-black text-gray-900 dark:text-white leading-none mb-1">{student.name}</p>
                                               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">{student.email}</p>
                                            </div>
                                         </div>
                                         <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-gray-400 hover:text-blue-600"
                                            onClick={() => navigate(`/admin/students/${student._id}`)}
                                         >
                                            <ChevronRight className="w-5 h-5" />
                                         </Button>
                                      </div>
                                   ))}
                                   {course.enrolledStudents.length === 0 && (
                                       <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border border-dashed border-gray-100">
                                          <Users className="w-10 h-10 text-gray-200 mb-3" />
                                          <p className="text-xs font-bold text-gray-400 italic">No students enrolled currently.</p>
                                       </div>
                                   )}
                                </div>

                                {/* Quizzes Summary */}
                                <div className="mt-10 pt-10 border-t border-gray-100 dark:border-gray-800">
                                   <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2 mb-4">
                                      <FileCheck className="w-4 h-4 text-emerald-600" />
                                      Associated Quizzes
                                   </h4>
                                   <div className="grid grid-cols-2 gap-4">
                                      {course.quizzes?.map((quiz: any) => (
                                         <div key={quiz._id} className="p-4 bg-emerald-50/30 dark:bg-emerald-900/10 border border-emerald-100/50 dark:border-emerald-800/30 rounded-2xl flex items-center gap-3">
                                            <div className="w-8 h-8 bg-white dark:bg-emerald-900/40 rounded-lg flex items-center justify-center text-emerald-600 shadow-sm">
                                               <Target className="w-4 h-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                               <p className="text-xs font-black text-gray-900 dark:text-gray-100 truncate uppercase tracking-tighter">{quiz.title}</p>
                                            </div>
                                         </div>
                                      ))}
                                      {(!course.quizzes || course.quizzes.length === 0) && (
                                         <p className="text-xs text-gray-400 italic col-span-2">No quizzes created for this course.</p>
                                      )}
                                   </div>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 </motion.div>
              ))}
              {courses.length === 0 && (
                 <div className="py-40 text-center bg-gray-50/30 rounded-[3rem] border border-dashed border-gray-200">
                    <Library className="w-20 h-20 text-gray-200 mx-auto mb-6" />
                    <h3 className="text-2xl font-black text-gray-900">Zero Educational Output</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-2">This instructor has not published any academic courses to the platform yet.</p>
                 </div>
              )}
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
