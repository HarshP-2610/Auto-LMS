import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    Search,
    Mail,
    BookOpen,
    CheckCircle,
    XCircle,
    GraduationCap,
    TrendingUp,
    Filter,
    MoreVertical,
    ArrowUpRight,
    ClipboardList,
    Eye,
    Clock,
    Loader2
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';

export function InstructorStudents() {
    const navigate = useNavigate();
    const [students, setStudents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchStudents = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/courses/instructor/students', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                });
                if (response.ok) {
                    const res = await response.json();
                    setStudents(res.data);
                }
            } catch (error) {
                console.error('Failed to fetch instructor students:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, []);

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <DashboardLayout userRole="instructor">
            <div className="space-y-8 animate-in fade-in duration-500">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white dark:bg-gray-900 p-8 rounded-[2.5rem] border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-500/5">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 dark:text-white font-outfit mb-2">
                            Student Management
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                            Monitor your students' progress, engagement, and assessment results.
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex items-center gap-4 border border-blue-100 dark:border-blue-800">
                            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                                <Users className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider">Total Enrolled</p>
                                <p className="text-2xl font-black text-gray-900 dark:text-white font-outfit">{students.length}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="relative flex-1 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 transition-colors group-focus-within:text-blue-600" />
                        <Input
                            placeholder="Search students by name or email..."
                            className="pl-12 h-14 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 rounded-2xl focus:ring-blue-600 focus:border-blue-600 transition-all text-base font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" className="h-14 px-6 rounded-2xl border-gray-200 dark:border-gray-800 font-bold flex items-center gap-3 hover:bg-gray-50 transition-all">
                        <Filter className="w-5 h-5" />
                        Advanced Filters
                    </Button>
                </div>

                {/* Students Table/Grid */}
                {loading ? (
                    <div className="py-24 flex flex-col items-center justify-center">
                        <div className="relative">
                            <div className="w-20 h-20 border-4 border-blue-600/20 rounded-full animate-ping absolute" />
                            <Loader2 className="w-20 h-20 text-blue-600 animate-spin relative" />
                        </div>
                        <p className="mt-6 text-gray-500 font-bold font-outfit text-lg">Loading student database...</p>
                    </div>
                ) : filteredStudents.length === 0 ? (
                    <div className="bg-white dark:bg-gray-900 border border-dashed border-gray-300 dark:border-gray-800 rounded-[2.5rem] py-24 text-center">
                        <div className="w-24 h-24 bg-gray-50 dark:bg-gray-800 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Users className="w-12 h-12 text-gray-300" />
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2 font-outfit">No students found</h3>
                        <p className="text-gray-500 max-w-sm mx-auto font-medium">
                            Either no students have enrolled yet, or your search didn't match any records.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {filteredStudents.map((student) => (
                            <div
                                key={student.id}
                                className="group bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-100 dark:border-gray-800 hover:border-blue-100 dark:hover:border-blue-900/30 hover:shadow-xl hover:shadow-gray-500/5 transition-all duration-300 overflow-hidden"
                            >
                                <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center gap-6">
                                    {/* Student Identity */}
                                    <div className="flex items-center gap-5 flex-1">
                                        <div className="relative">
                                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 p-0.5 shadow-lg">
                                                <img
                                                    src={student.avatar?.startsWith('http') ? student.avatar : `http://localhost:5000/uploads/${student.avatar || 'no-photo.jpg'}`}
                                                    alt={student.name}
                                                    className="w-full h-full rounded-[14px] object-cover bg-white"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = 'https://ui-avatars.com/api/?name=' + student.name;
                                                    }}
                                                />
                                            </div>
                                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-gray-900 rounded-full" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-gray-900 dark:text-white font-outfit group-hover:text-blue-600 transition-colors">
                                                {student.name}
                                            </h3>
                                            <div className="flex items-center gap-3 text-sm text-gray-500 font-medium">
                                                <span className="flex items-center gap-1.5">
                                                    <Mail className="w-4 h-4" />
                                                    {student.email}
                                                </span>
                                                <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                                                <span className="flex items-center gap-1.5">
                                                    <BookOpen className="w-4 h-4" />
                                                    {student.courses.length} courses
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary Stats */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 lg:gap-12 lg:border-l lg:border-r border-gray-100 dark:border-gray-800 lg:px-12">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Avg. Progress</p>
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg font-black font-outfit text-gray-900 dark:text-white">
                                                    {Math.round(student.courses.reduce((acc: number, curr: any) => acc + curr.percentComplete, 0) / student.courses.length)}%
                                                </span>
                                                <TrendingUp className="w-4 h-4 text-green-500" />
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Quizzes Done</p>
                                            <p className="text-lg font-black font-outfit text-gray-900 dark:text-white">
                                                {student.courses.reduce((acc: number, curr: any) => acc + curr.completedQuizzes.length, 0)}
                                            </p>
                                        </div>
                                        <div className="hidden md:block">
                                            <p className="text-[10px] uppercase tracking-widest text-gray-400 font-black mb-1">Pass Rate</p>
                                            <p className="text-lg font-black font-outfit text-green-600">
                                                {(() => {
                                                    const total = student.courses.reduce((acc: number, curr: any) => acc + curr.completedQuizzes.length, 0);
                                                    if (total === 0) return '0%';
                                                    const passed = student.courses.reduce((acc: number, curr: any) => acc + curr.completedQuizzes.filter((q: any) => q.passed).length, 0);
                                                    return Math.round((passed / total) * 100) + '%';
                                                })()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="rounded-xl border-blue-100 text-blue-600 hover:bg-blue-50 flex items-center gap-2 font-bold px-4 h-11"
                                            onClick={() => navigate(`/instructor/students/${student.id}`)}
                                        >
                                            <Eye className="w-4 h-4" />
                                            View Details
                                        </Button>
                                        <Button variant="ghost" size="icon" className="rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 h-11 w-11">
                                            <MoreVertical className="w-5 h-5 text-gray-400" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </DashboardLayout>
    );
}
