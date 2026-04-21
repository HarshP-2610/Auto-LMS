import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  Award, 
  Briefcase, 
  GraduationCap, 
  Star, 
  ArrowLeft,
  Loader2,
  Calendar,
  Wallet,
  Fingerprint,
  MessageSquare,
  ShieldCheck,
  BadgeCheck
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

interface InstructorData {
  _id: string;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: string;
  isActive: boolean;
  instructorTitle: string;
  instructorBio: string;
  subject: string;
  educationalDetails: string;
  workExperience: number;
  areaOfExpertise: string;
  expertise: string[];
  rating: number;
  numReviews: number;
  earnings: number;
  taughtCourses: any[];
  createdAt: string;
}

export function InstructorPortfolio() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [instructor, setInstructor] = useState<InstructorData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchInstructorDetails();
    }
  }, [id]);

  const fetchInstructorDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/admin/users`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('userToken')}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        const found = data.find((u: any) => u._id === id);
        if (found) {
          setInstructor(found);
        } else {
          toast.error('Instructor not found');
        }
      } else {
        toast.error(data.message || 'Failed to fetch details');
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
          <Loader2 className="w-12 h-12 text-purple-600 animate-spin mb-4" />
          <p className="text-gray-500 font-bold animate-pulse">Loading Academic Portfolio...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!instructor) {
    return (
      <DashboardLayout userRole="admin">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Instructor Not Found</h2>
          <Button onClick={() => navigate('/admin/instructors')} className="mt-4">Back to Instructors</Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="admin">
      <div className="max-w-6xl mx-auto space-y-8 pb-12">
        {/* Back Button */}
        <div className="flex items-center justify-between">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/instructors')}
            className="group flex items-center gap-2 hover:bg-purple-50 dark:hover:bg-purple-900/20 text-gray-600 dark:text-gray-400 font-bold"
          >
            <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            Back to Faculty List
          </Button>
          <Badge className={`${instructor.isActive ? 'bg-emerald-500' : 'bg-rose-500'} px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg`}>
            {instructor.isActive ? 'Active Status' : 'Restricted Account'}
          </Badge>
        </div>

        {/* Profile Identity Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-[3rem] p-8 lg:p-12 border border-gray-100 dark:border-gray-800 shadow-2xl"
        >
          <div className="absolute top-0 right-0 p-12 opacity-[0.03] pointer-events-none">
             <ShieldCheck className="w-80 h-80 -mr-20 -mt-20 rotate-12" />
          </div>

          <div className="relative flex flex-col lg:flex-row items-center lg:items-start gap-12">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-tr from-purple-600 via-indigo-600 to-pink-600 rounded-[3.5rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
              <div className="relative w-40 h-40 lg:w-56 lg:h-56 rounded-[3rem] overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                 <img 
                    src={(!instructor.avatar || instructor.avatar === 'no-photo.jpg') 
                        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=8B5CF6&color=fff&size=256` 
                        : (instructor.avatar.startsWith('http') ? instructor.avatar : `http://localhost:5000/uploads/${instructor.avatar}`)}
                    className="w-full h-full object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700"
                    alt={instructor.name}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(instructor.name)}&background=8b5cf6&color=fff`;
                    }}
                 />
              </div>
            </div>

            <div className="flex-1 text-center lg:text-left space-y-6">
              <div>
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
                   <BadgeCheck className="w-6 h-6 text-purple-600" />
                   <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Verified Faculty</span>
                </div>
                <h1 className="text-4xl lg:text-6xl font-black text-gray-900 dark:text-white tracking-tight leading-none mb-4">
                  {instructor.name}
                </h1>
                <p className="text-xl font-bold text-gray-500 dark:text-gray-400">
                   {instructor.instructorTitle || 'Academic Instructor'} • <span className="text-indigo-600">{instructor.subject || 'Elite Educator'}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-gray-500 dark:text-gray-400 font-bold">
                 <div className="flex items-center gap-2">
                    <Mail className="w-5 h-5 text-gray-400" />
                    {instructor.email}
                 </div>
                 <div className="flex items-center gap-2">
                    <Phone className="w-5 h-5 text-gray-400" />
                    {instructor.phone || 'N/A'}
                 </div>
                 <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-gray-400" />
                    Joined {instructor.createdAt ? format(new Date(instructor.createdAt), 'MMMM yyyy') : 'Recently'}
                 </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Portfolio Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Left Column: Bio & Experience */}
           <div className="lg:col-span-2 space-y-8">
              {/* Bio Section */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-xl"
              >
                 <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Award className="w-6 h-6 text-purple-600" />
                    Professional Biography
                 </h3>
                 <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-lg italic">
                    "{instructor.instructorBio || 'No biography provided yet. This instructor is focused on delivering high-quality academic content.'}"
                 </p>
              </motion.div>

              {/* Professional Credentials */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl"
                 >
                    <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center mb-6">
                       <GraduationCap className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Educational Background</h4>
                    <p className="text-gray-900 dark:text-white font-bold leading-relaxed">
                       {instructor.educationalDetails || 'Doctorate or Masters in designated field of expertise.'}
                    </p>
                 </motion.div>

                 <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl"
                 >
                    <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center mb-6">
                       <Briefcase className="w-6 h-6 text-emerald-600" />
                    </div>
                    <h4 className="text-sm font-black text-gray-400 uppercase tracking-widest mb-2">Work Experience</h4>
                    <p className="text-gray-900 dark:text-white font-bold leading-relaxed">
                       {instructor.workExperience || 0} Years in Industry & Academia
                    </p>
                 </motion.div>
              </div>

              {/* Area of Expertise */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-10 border border-gray-100 dark:border-gray-800 shadow-xl"
              >
                 <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <Fingerprint className="w-6 h-6 text-blue-600" />
                    Area of Expertise
                 </h3>
                 <div className="flex flex-wrap gap-3">
                    {typeof instructor.areaOfExpertise === 'string' && instructor.areaOfExpertise.split(',').map((skill, idx) => (
                       <Badge key={idx} variant="outline" className="px-5 py-2.5 rounded-xl border-blue-100 dark:border-blue-900/30 text-blue-600 font-bold uppercase tracking-widest text-[10px]">
                          {skill.trim()}
                       </Badge>
                    ))}
                    {!instructor.areaOfExpertise && instructor.expertise?.map((skill, idx) => (
                       <Badge key={idx} variant="outline" className="px-5 py-2.5 rounded-xl border-blue-100 dark:border-blue-900/30 text-blue-600 font-bold uppercase tracking-widest text-[10px]">
                          {skill}
                       </Badge>
                    ))}
                    {!instructor.areaOfExpertise && (!instructor.expertise || instructor.expertise.length === 0) && (
                       <p className="text-gray-400 italic">No specific skills listed.</p>
                    )}
                 </div>
              </motion.div>
           </div>

           {/* Right Column: Key Stats & Actions */}
           <div className="space-y-8">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white dark:bg-gray-900 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl space-y-6"
              >
                 <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Administrative Metrics</h3>
                 
                 <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                       <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-purple-600" />
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Total Courses</span>
                       </div>
                       <span className="text-xl font-black text-gray-900 dark:text-white">{instructor.taughtCourses?.length || 0}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                       <div className="flex items-center gap-3">
                          <Star className="w-5 h-5 text-amber-500" />
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Average Rating</span>
                       </div>
                       <span className="text-xl font-black text-gray-900 dark:text-white">{instructor.rating?.toFixed(1) || '5.0'}</span>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                       <div className="flex items-center gap-3">
                          <Wallet className="w-5 h-5 text-emerald-600" />
                          <span className="text-sm font-bold text-gray-600 dark:text-gray-400">Lifetime Revenue</span>
                       </div>
                       <span className="text-xl font-black text-emerald-600">${instructor.earnings?.toLocaleString() || '0'}</span>
                    </div>
                 </div>

                 <div className="pt-4 space-y-3">
                    <Button 
                      className="w-full h-12 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-black uppercase tracking-widest shadow-xl shadow-purple-500/30 gap-3"
                      onClick={() => navigate(`/admin/courses?search=${encodeURIComponent(instructor.name)}`)}
                    >
                       <BookOpen className="w-4 h-4" />
                       Manage Curriculum
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full h-12 rounded-2xl border-2 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-300 font-black uppercase tracking-widest"
                      onClick={() => navigate('/admin/messages')}
                    >
                       <MessageSquare className="w-4 h-4 mr-2" />
                       Send Secure Directive
                    </Button>
                 </div>
              </motion.div>

              {/* Account Status Notice */}
              <div className={`p-6 rounded-[2rem] border-2 border-dashed flex items-start gap-4 ${instructor.isActive ? 'border-emerald-100 bg-emerald-50/30 dark:border-emerald-900/30 dark:bg-emerald-900/5' : 'border-rose-100 bg-rose-50/30 dark:border-rose-900/30 dark:bg-rose-900/5'}`}>
                 <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${instructor.isActive ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    <ShieldCheck className="w-6 h-6" />
                 </div>
                 <div>
                    <h4 className={`text-xs font-black uppercase tracking-widest mb-1 ${instructor.isActive ? 'text-emerald-700' : 'text-rose-700'}`}>Security Integrity</h4>
                    <p className="text-[10px] font-bold text-gray-500 leading-relaxed uppercase">
                       {instructor.isActive 
                          ? 'This faculty account is verified and operational. All courses are visible to the public.' 
                          : 'This account has been flagged for administrative review. Access to faculty portal restricted.'}
                    </p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
