import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  BookOpen, 
  Trophy, 
  CreditCard, 
  MessageSquare, 
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Clock,
  TrendingUp,
  Download,
  AlertCircle,
  Activity,
  Circle,
  Layers,
  Layout,
  MonitorPlay,
  X
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

interface StudentDetailsData {
  personalDetails: {
    _id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    avatar: string;
    createdAt: string;
    isActive: boolean;
  };
  learningProgress: Array<{
    courseId: string;
    courseTitle: string;
    instructor: {
      name: string;
      email: string;
      avatar: string;
    };
    percentComplete: number;
    isCompleted: boolean;
    completionDate: string | null;
    quizzes: Array<{
      quizTitle: string;
      score: number;
      passed: boolean;
      completedAt: string;
    }>;
    breakdown: {
      modules: { total: number; completed: number };
      lessons: { total: number; completed: number };
      topics: { total: number; completed: number };
      totalItems: number;
      completedItems: number;
      notStartedCount: number;
    };
  }>;
  paymentHistory: Array<{
    _id: string;
    course: { title: string };
    amount: number;
    paymentMethod: string;
    status: string;
    transactionId: string;
    createdAt: string;
  }>;
  contactedInstructors: Array<{
    _id: string;
    name: string;
    email: string;
    avatar: string;
  }>;
}

export function AdminStudentDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<StudentDetailsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'courses' | 'payments' | 'instructors'>('overview');
  const [selectedCourseBreakdown, setSelectedCourseBreakdown] = useState<StudentDetailsData['learningProgress'][0] | null>(null);

  useEffect(() => {
    if (id) {
      fetchStudentDetails();
    }
  }, [id]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/users/${id}/full-details`, {
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
          <p className="text-gray-500 font-bold animate-pulse">Assembling Academic Profile...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!data) {
    return (
      <DashboardLayout userRole="admin">
        <div className="text-center py-20">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Not Found</h2>
          <Button onClick={() => navigate('/admin/students')} className="mt-4">Back to Students</Button>
        </div>
      </DashboardLayout>
    );
  }

  const { personalDetails, learningProgress, paymentHistory, contactedInstructors } = data;

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-7xl mx-auto space-y-8 pb-12">
        {/* Top Navigation & Quick Actions */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/students')}
            className="group flex items-center gap-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-gray-600 dark:text-gray-400 font-bold"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back to Student Repository
          </Button>
          <div className="flex items-center gap-3">
             <Badge className={`${personalDetails.isActive ? 'bg-green-500' : 'bg-red-500'} px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest`}>
               {personalDetails.isActive ? 'Active Scholar' : 'Account Restricted'}
             </Badge>
          </div>
        </div>

        {/* Dynamic Header Card */}
        <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-[3rem] p-8 lg:p-12 border border-gray-100 dark:border-gray-800 shadow-2xl">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
             <User className="w-64 h-64 -mr-20 -mt-20 rotate-12" />
          </div>
          
          <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-10">
            {/* Avatar Section */}
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative w-32 h-32 lg:w-48 lg:h-48 rounded-[2rem] overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl">
                <img 
                  src={personalDetails.avatar === 'no-photo.jpg' 
                    ? `https://ui-avatars.com/api/?name=${encodeURIComponent(personalDetails.name)}&background=3b82f6&color=fff&size=200` 
                    : (personalDetails.avatar.startsWith('http') ? personalDetails.avatar : `http://localhost:5000/uploads/${personalDetails.avatar}`)}
                  className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700" 
                  alt={personalDetails.name} 
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(personalDetails.name)}&background=3b82f6&color=fff`;
                  }}
                />
              </div>
            </div>

            {/* Core Info */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              <div>
                <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-4">
                  {personalDetails.name}
                </h1>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-500 dark:text-gray-400 font-bold">
                  <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-blue-500" />
                    {personalDetails.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-indigo-500" />
                    {personalDetails.phone || 'N/A'}
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-5 h-5 text-green-500" />
                    Joined {format(new Date(personalDetails.createdAt), 'MMMM d, yyyy')}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Courses</p>
                  <p className="text-2xl font-black text-blue-600">{learningProgress.length}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Completed</p>
                  <p className="text-2xl font-black text-green-600">{learningProgress.filter(c => c.isCompleted).length}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Achievements</p>
                  <p className="text-2xl font-black text-amber-500">{learningProgress.filter(c => c.isCompleted).length}</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-3xl border border-gray-100 dark:border-gray-800 text-center">
                  <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Advisors</p>
                  <p className="text-2xl font-black text-indigo-500">{contactedInstructors.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabbed Navigation */}
        <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-900/50 backdrop-blur-xl p-2 rounded-3xl border border-white/20 dark:border-gray-800/50 w-full lg:w-fit overflow-x-auto no-scrollbar">
          {[
            { id: 'overview', label: 'Academic Overview', icon: BookOpen },
            { id: 'courses', label: 'Detailed Learning', icon: TrendingUp },
            { id: 'payments', label: 'Financial Records', icon: CreditCard },
            { id: 'instructors', label: 'Faculty Interactions', icon: MessageSquare }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                flex items-center gap-3 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest whitespace-nowrap transition-all duration-300
                ${activeTab === tab.id 
                  ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/30' 
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-800'}
              `}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Personal Bio Card */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl">
                    <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                       <User className="w-5 h-5 text-blue-500" />
                       Personal Dossier
                    </h3>
                    <div className="space-y-6">
                      <div className="flex items-start gap-4">
                        <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Residency</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">{personalDetails.address || 'Location data restricted'}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <Calendar className="w-5 h-5 text-gray-400 mt-1" />
                        <div>
                          <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Registration Authority</p>
                          <p className="text-sm font-bold text-gray-900 dark:text-white">Official Network Member</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Progress Cards */}
                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                   {learningProgress.slice(0, 4).map(course => (
                     <div key={course.courseId} className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-6 border border-gray-100 dark:border-gray-800 shadow-lg group hover:shadow-2xl transition-all duration-500">
                        <div className="flex justify-between items-start mb-4">
                           <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                             <BookOpen className="w-6 h-6 text-blue-600" />
                           </div>
                           <Badge className={`${course.isCompleted ? 'bg-green-500' : 'bg-blue-500'} rounded-lg font-black tracking-tighter`}>
                             {course.percentComplete}%
                           </Badge>
                        </div>
                        <h4 className="font-black text-gray-900 dark:text-white line-clamp-1 mb-2">{course.courseTitle}</h4>
                        <p className="text-xs text-gray-500 font-bold mb-4">Instructor: {course.instructor.name}</p>
                        <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-600 rounded-full" style={{ width: `${course.percentComplete}%` }} />
                        </div>
                     </div>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="space-y-6">
                {learningProgress.length > 0 ? (
                  learningProgress.map((course) => (
                    <div key={course.courseId} className="bg-white dark:bg-gray-900 rounded-[3rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-xl">
                      <div className="p-8 lg:p-10 flex flex-col lg:flex-row gap-10">
                        {/* Course Overview Side */}
                        <div className="lg:w-1/3 space-y-6">
                           <div className="space-y-2">
                             <Badge variant="outline" className="text-[10px] font-black uppercase border-blue-200 text-blue-600">Curriculum Tracking</Badge>
                             <h3 className="text-2xl font-black text-gray-900 dark:text-white leading-tight">{course.courseTitle}</h3>
                           </div>
                           
                           <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                              <img 
                                src={course.instructor.avatar === 'no-photo.jpg' 
                                  ? `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=8b5cf6&color=fff` 
                                  : (course.instructor.avatar.startsWith('http') ? course.instructor.avatar : `http://localhost:5000/uploads/${course.instructor.avatar}`)}
                                className="w-12 h-12 rounded-xl object-cover" 
                                alt={course.instructor.name} 
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(course.instructor.name)}&background=8b5cf6&color=fff`;
                                }}
                              />
                              <div>
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Faculty Advisor</p>
                                <p className="text-sm font-bold text-gray-900 dark:text-white">{course.instructor.name}</p>
                              </div>
                           </div>

                           <div className="space-y-3">
                              <div className="flex justify-between items-center text-xs font-black uppercase tracking-widest">
                                 <span className="text-gray-400">Mastery Progress</span>
                                 <span className="text-blue-600">{course.percentComplete}%</span>
                              </div>
                              <div className="w-full h-4 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden p-1 shadow-inner">
                                 <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full shadow-lg shadow-blue-500/40" style={{ width: `${course.percentComplete}%` }} />
                              </div>
                           </div>

                           <Button 
                             variant="outline" 
                             className="w-full h-12 rounded-2xl border-blue-100 dark:border-blue-900/40 text-blue-600 font-black uppercase tracking-widest hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all gap-2"
                             onClick={() => setSelectedCourseBreakdown(course)}
                           >
                             <Activity className="w-4 h-4" />
                             View Detailed Progress
                           </Button>

                           {course.isCompleted && (
                             <Button className="w-full h-14 rounded-2xl bg-green-600 hover:bg-green-700 text-white font-black uppercase tracking-widest shadow-xl shadow-green-500/30 gap-3">
                               <Trophy className="w-5 h-5" />
                               Download Certificate
                               <Download className="w-4 h-4 ml-auto opacity-50" />
                             </Button>
                           )}
                        </div>

                        {/* Assessment Side */}
                        <div className="lg:w-2/3 flex flex-col gap-6">
                           <div className="flex items-center justify-between">
                              <h4 className="text-sm font-black uppercase tracking-widest text-gray-400">Examination Results</h4>
                              <span className="text-[10px] font-bold text-blue-500 uppercase">Interactive Timeline</span>
                           </div>
                           
                           <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              {course.quizzes.length > 0 ? (
                                course.quizzes.map((quiz, qidx) => (
                                  <div key={qidx} className="bg-white dark:bg-gray-950 p-5 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm flex items-center gap-4 group">
                                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 ${quiz.passed ? 'bg-green-50 dark:bg-green-900/20 text-green-600' : 'bg-red-50 dark:bg-red-900/20 text-red-600'}`}>
                                        {quiz.passed ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                                     </div>
                                     <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Assessment {qidx + 1}</p>
                                        <h5 className="text-sm font-black text-gray-900 dark:text-white truncate mb-1">{quiz.quizTitle}</h5>
                                        <p className="text-[9px] font-bold text-gray-400 uppercase">{format(new Date(quiz.completedAt), 'MMM d, h:mm a')}</p>
                                     </div>
                                     <div className="text-right">
                                        <p className={`text-xl font-black ${quiz.passed ? 'text-green-600' : 'text-red-600'}`}>{quiz.score}%</p>
                                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter">{quiz.passed ? 'Distinction' : 'Resit Required'}</p>
                                     </div>
                                  </div>
                                ))
                              ) : (
                                <div className="col-span-2 flex flex-col items-center justify-center py-20 bg-gray-50/50 dark:bg-gray-800/30 rounded-[2.5rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                                   <AlertCircle className="w-12 h-12 text-gray-200 mb-2" />
                                   <p className="text-xs font-bold text-gray-400 uppercase tracking-widest italic">No Examination Data on File</p>
                                </div>
                              )}
                           </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-32 text-center bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                     <BookOpen className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                     <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">Student Knowledge Base Empty</h3>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white dark:bg-gray-900 rounded-[3.5rem] overflow-hidden border border-gray-100 dark:border-gray-800 shadow-2xl">
                <div className="p-8 lg:p-12 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/30">
                   <div>
                     <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                       <CreditCard className="w-8 h-8 text-blue-600" />
                       Transaction Ledger
                     </h2>
                     <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px] mt-1">Total Lifetime Value: <span className="text-green-600 px-2 font-black">${paymentHistory.reduce((acc, curr) => acc + curr.amount, 0).toFixed(2)}</span></p>
                   </div>
                   <Badge className="bg-blue-600/10 text-blue-600 border-none font-black px-6 py-2 rounded-xl uppercase tracking-tighter">
                     {paymentHistory.length} Valid Purchases
                   </Badge>
                </div>
                
                <div className="overflow-x-auto">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-gray-50/80 dark:bg-gray-800/80">
                            {['Transaction Hash', 'Premium Asset', 'Financial Method', 'Amount', 'Fulfillment Date', 'Status'].map(h => (
                              <th key={h} className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-widest">{h}</th>
                            ))}
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                         {paymentHistory.map(payment => (
                           <tr key={payment._id} className="hover:bg-gray-50/30 dark:hover:bg-gray-800/20 transition-colors">
                              <td className="px-8 py-6">
                                 <code className="text-[10px] font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded-lg text-gray-600 dark:text-gray-400 uppercase">
                                   {payment.transactionId.substring(0, 8)}...
                                 </code>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="text-sm font-black text-gray-900 dark:text-white line-clamp-1">{payment.course.title}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <Badge variant="outline" className="border-gray-200 dark:border-gray-700 text-[10px] font-black uppercase tracking-tighter p-1 px-3 rounded-lg">
                                   {payment.paymentMethod}
                                 </Badge>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="text-sm font-black text-gray-900 dark:text-white">${payment.amount.toFixed(2)}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <p className="text-[10px] font-bold text-gray-500 uppercase">{format(new Date(payment.createdAt), 'MMM d, yyyy')}</p>
                              </td>
                              <td className="px-8 py-6">
                                 <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-green-600">Verified</span>
                                 </div>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </div>
            )}

            {activeTab === 'instructors' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {contactedInstructors.length > 0 ? (
                  contactedInstructors.map(instructor => (
                    <div key={instructor._id} className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl group hover:shadow-2xl transition-all duration-500">
                       <div className="flex flex-col items-center text-center space-y-6">
                          <div className="relative group/avatar">
                            <div className="absolute -inset-2 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-3xl blur opacity-10 group-hover/avatar:opacity-30 transition duration-500"></div>
                            <img 
                              src={instructor.avatar === 'no-photo.jpg' 
                                ? `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=8b5cf6&color=fff` 
                                : (instructor.avatar.startsWith('http') ? instructor.avatar : `http://localhost:5000/uploads/${instructor.avatar}`)}
                              className="relative w-24 h-24 rounded-[1.5rem] object-cover ring-2 ring-white dark:ring-gray-800 shadow-lg" 
                              alt={instructor.name} 
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=8b5cf6&color=fff`;
                              }}
                            />
                          </div>
                          <div>
                            <h4 className="text-xl font-black text-gray-900 dark:text-white mb-1 group-hover:text-blue-600 transition-colors">{instructor.name}</h4>
                            <p className="text-xs font-medium text-gray-500">{instructor.email}</p>
                          </div>
                          <div className="w-full pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-center gap-8">
                             <div className="text-center">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Status</p>
                                <Badge className="bg-blue-600/10 text-blue-600 font-extrabold uppercase tracking-widest text-[8px] p-0 px-3">Verified Faculty</Badge>
                             </div>
                             <div className="text-center">
                                <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">Interactions</p>
                                <span className="text-xs font-black text-gray-900 dark:text-white uppercase">Historical Record</span>
                             </div>
                          </div>
                          <Button 
                            onClick={() => navigate('/admin/messages')}
                            className="w-full h-12 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-blue-600 hover:text-white text-gray-600 dark:text-gray-300 font-black uppercase tracking-widest transition-all"
                          >
                             Intervene Conversations
                          </Button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full py-40 text-center bg-white dark:bg-gray-900 rounded-[3rem] border-2 border-dashed border-gray-100 dark:border-gray-800">
                     <MessageSquare className="w-20 h-20 text-gray-200 mx-auto mb-4" />
                     <h3 className="text-xl font-black text-gray-400 uppercase tracking-widest">No Interaction History Found</h3>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {selectedCourseBreakdown && (
            <BreakdownModal 
              course={selectedCourseBreakdown} 
              onClose={() => setSelectedCourseBreakdown(null)} 
            />
          )}
        </AnimatePresence>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </DashboardLayout>
  );
}

const BreakdownModal = ({ course, onClose }: { course: any, onClose: () => void }) => {
  if (!course) return null;
  
  const { breakdown } = course;
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white dark:bg-gray-900 w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-8 lg:p-10 border-b border-gray-50 dark:border-gray-800 flex items-center justify-between bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/10 dark:to-indigo-900/10">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/30">
              <Activity className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Detailed Progress Analysis</p>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white line-clamp-1">{course.courseTitle}</h2>
            </div>
          </div>
          <button onClick={onClose} className="p-3 hover:bg-white dark:hover:bg-gray-800 rounded-2xl transition-colors group">
            <X className="w-6 h-6 text-gray-400 group-hover:text-red-500" />
          </button>
        </div>

        {/* Breakdown Content */}
        <div className="p-8 lg:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ProgressMetric 
              label="Modules" 
              completed={breakdown.modules.completed} 
              total={breakdown.modules.total} 
              icon={Layers} 
              color="blue"
            />
            <ProgressMetric 
              label="Lessons" 
              completed={breakdown.lessons.completed} 
              total={breakdown.lessons.total} 
              icon={Layout} 
              color="indigo"
            />
            <ProgressMetric 
              label="Topics" 
              completed={breakdown.topics.completed} 
              total={breakdown.topics.total} 
              icon={MonitorPlay} 
              color="emerald"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800">
             <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Completion Velocity</h3>
                <Badge className="bg-blue-600 font-black px-4 py-1.5 rounded-xl uppercase tracking-tighter shadow-lg shadow-blue-500/30">
                   {course.percentComplete}% Overall
                </Badge>
             </div>
             
             <div className="space-y-6">
                <div className="flex items-center justify-between mb-2">
                   <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
                         <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                         <p className="text-base font-black text-gray-900 dark:text-white">{breakdown.completedItems} Units</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Successfully Mastered</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 text-right">
                      <div>
                         <p className="text-base font-black text-gray-900 dark:text-white">{breakdown.notStartedCount} Units</p>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest text-red-500">Awaiting Initiation</p>
                      </div>
                      <div className="w-10 h-10 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                         <Circle className="w-5 h-5 text-red-500" />
                      </div>
                   </div>
                </div>
                
                <div className="relative h-6 bg-gray-200 dark:bg-gray-700 rounded-2xl p-1 overflow-hidden shadow-inner flex">
                   <div 
                      className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg shadow-green-500/40 relative z-10 transition-all duration-1000"
                      style={{ width: `${(breakdown.completedItems / (breakdown.totalItems || 1)) * 100}%` }}
                   />
                   <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black uppercase tracking-widest text-white mix-blend-difference">
                      Status: {breakdown.notStartedCount === 0 ? 'Full Mastery Achieved' : `${breakdown.notStartedCount} items not started yet`}
                   </div>
                </div>
             </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProgressMetric = ({ label, completed, total, icon: Icon, color }: any) => {
  const colorMap: any = {
    blue: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    indigo: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20',
    emerald: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20'
  };

  return (
    <div className="bg-white dark:bg-gray-950 p-6 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm group hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110 ${colorMap[color]}`}>
        <Icon className="w-6 h-6" />
      </div>
      <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">{label}</p>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-black text-gray-900 dark:text-white">{completed}</span>
        <span className="text-sm font-bold text-gray-400">/ {total}</span>
      </div>
    </div>
  );
}
