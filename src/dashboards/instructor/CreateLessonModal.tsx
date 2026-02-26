import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { CheckCircle2, ArrowRight, ArrowLeft, Layers } from 'lucide-react';

interface Course {
    _id: string;
    title: string;
}

interface CreateLessonModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    initialCourseId?: string;
}

export function CreateLessonModal({ isOpen, onClose, onSuccess, initialCourseId }: CreateLessonModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState<Course[]>([]);
    const [formData, setFormData] = useState({
        course: initialCourseId || '',
        title: '',
        description: '',
    });

    useEffect(() => {
        if (isOpen) {
            fetchMyCourses();
            if (initialCourseId) {
                setFormData(prev => ({ ...prev, course: initialCourseId }));
            }
        }
    }, [isOpen, initialCourseId]);

    const fetchMyCourses = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/courses/my-courses', {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('userToken')}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setCourses(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch courses');
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({ ...formData, [name]: value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('http://localhost:5000/api/lessons', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Lesson container created successfully!');
                onSuccess?.();
                onClose();
                // Reset form
                setFormData({
                    course: initialCourseId || '',
                    title: '',
                    description: '',
                });
                setStep(1);
            } else {
                toast.error(data.message || 'Failed to add lesson');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const selectedCourseTitle = courses.find(c => c._id === formData.course)?.title || 'Select a course';

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label>Target Course</Label>
                            <Select onValueChange={(v) => handleSelectChange('course', v)} value={formData.course}>
                                <SelectTrigger className="h-12 border-gray-200 dark:border-gray-800">
                                    <SelectValue placeholder="Which course does this lesson belong to?" />
                                </SelectTrigger>
                                <SelectContent>
                                    {courses.map((course) => (
                                        <SelectItem key={course._id} value={course._id}>
                                            {course.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800/50 mt-4 text-center">
                            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                                <Layers className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                            </div>
                            <h4 className="font-medium text-gray-900 dark:text-white mt-2">Lesson Container</h4>
                            <p className="text-sm text-gray-500 max-w-[300px]">Create a section for your course. You can add specific topics inside this later.</p>
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Lesson Section Title</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Module 1: Getting Started"
                                value={formData.title}
                                onChange={handleChange}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Section Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe what this module/section covers..."
                                value={formData.description}
                                onChange={handleChange}
                                className="h-32 resize-none"
                            />
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 py-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Course</h4>
                                <p className="text-sm font-semibold mt-1 text-indigo-600 dark:text-indigo-400">{selectedCourseTitle}</p>
                            </div>
                            <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Lesson Title</h4>
                                <p className="text-base font-semibold mt-1">{formData.title}</p>
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-400">Description</h4>
                                <p className="text-sm mt-1 line-clamp-2">{formData.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>This will create a new section. You can then add specific topics (videos/content) inside it.</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-4 pr-6">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                                </div>
                                {s < 3 && <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${step > s ? 'bg-indigo-600' : 'bg-gray-100 dark:bg-gray-800'}`} />}
                            </div>
                        ))}
                    </div>
                    <DialogTitle className="text-2xl font-bold tracking-tight">
                        {step === 1 && 'Placement'}
                        {step === 2 && 'Section Details'}
                        {step === 3 && 'Final Review'}
                    </DialogTitle>
                </DialogHeader>

                {renderStep()}

                <DialogFooter className="gap-2 sm:gap-0 border-t border-gray-100 dark:border-gray-800 pt-6">
                    {step > 1 && (
                        <Button variant="outline" onClick={prevStep} className="flex-1 sm:flex-none border-gray-200 dark:border-gray-800 h-11 px-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button
                            onClick={nextStep}
                            disabled={
                                (step === 1 && !formData.course) ||
                                (step === 2 && (!formData.title || !formData.description))
                            }
                            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 ml-auto font-semibold h-11 px-8 shadow-lg shadow-indigo-600/20"
                        >
                            Continue
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 sm:flex-none bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 ml-auto font-semibold h-11 px-8 shadow-lg shadow-indigo-600/20"
                        >
                            {loading ? 'Creating...' : 'Create Lesson'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
