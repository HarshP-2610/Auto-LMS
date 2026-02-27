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
import {
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Upload,
    BookOpen,
    DollarSign,
    Clock,
    Layout,
    Briefcase,
    Zap,
    Image as ImageIcon,
    Shield,
    Smartphone,
    Cloud,
    Camera,
    Brain,
    Headphones,
    Dumbbell,
    CircleDollarSign,
    Lock
} from 'lucide-react';

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    courseToEdit?: any;
}

const CATEGORIES = [
    { value: 'Development', icon: BookOpen },
    { value: 'Data Science', icon: Brain },
    { value: 'Design', icon: Layout },
    { value: 'Mobile Development', icon: Smartphone },
    { value: 'Cloud Computing', icon: Cloud },
    { value: 'Marketing', icon: Zap },
    { value: 'Business', icon: Briefcase },
    { value: 'Cybersecurity', icon: Lock },
    { value: 'Artificial Intelligence', icon: Brain },
    { value: 'DevOps', icon: Shield },
    { value: 'Finance', icon: CircleDollarSign },
    { value: 'Photography', icon: Camera },
    { value: 'Personal Development', icon: Headphones },
    { value: 'Health & Fitness', icon: Dumbbell },
];

export function CreateCourseModal({ isOpen, onClose, onSuccess, courseToEdit }: CreateCourseModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        skills: '',
        category: '',
        difficulty: '',
        price: '',
        duration: '',
        thumbnail: '',
    });

    useEffect(() => {
        if (courseToEdit) {
            setFormData({
                title: courseToEdit.title || '',
                description: courseToEdit.description || '',
                skills: Array.isArray(courseToEdit.skills) ? courseToEdit.skills.join(', ') : (courseToEdit.skills || ''),
                category: courseToEdit.category || '',
                difficulty: courseToEdit.difficulty || '',
                price: courseToEdit.price?.toString() || '',
                duration: courseToEdit.duration || '',
                thumbnail: courseToEdit.thumbnail || '',
            });
        } else {
            setFormData({
                title: '',
                description: '',
                skills: '',
                category: '',
                difficulty: '',
                price: '',
                duration: '',
                thumbnail: '',
            });
        }
        setStep(1);
    }, [courseToEdit, isOpen]);

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
            const url = courseToEdit
                ? `http://localhost:5000/api/courses/${courseToEdit._id}`
                : 'http://localhost:5000/api/courses';

            const method = courseToEdit ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(courseToEdit ? 'Course updated successfully!' : 'Course submitted for review!');
                onSuccess?.();
                onClose();
                // Reset form
                setFormData({
                    title: '',
                    description: '',
                    skills: '',
                    category: '',
                    difficulty: '',
                    price: '',
                    duration: '',
                    thumbnail: '',
                });
                setStep(1);
            } else {
                toast.error(data.message || 'Failed to create course');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Course Name</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g., Complete Web Development Bootcamp"
                                value={formData.title}
                                onChange={handleChange}
                                className="h-11 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe what students will learn..."
                                value={formData.description}
                                onChange={handleChange}
                                className="h-32 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500 resize-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="skills" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Skill Tags (comma separated)</Label>
                            <Input
                                id="skills"
                                name="skills"
                                placeholder="React, Node.js, TypeScript"
                                value={formData.skills}
                                onChange={handleChange}
                                className="h-11 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Category</Label>
                                <Select onValueChange={(v) => handleSelectChange('category', v)} value={formData.category}>
                                    <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-purple-500">
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[300px]">
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>
                                                <div className="flex items-center gap-2">
                                                    <cat.icon className="w-4 h-4 text-purple-600" />
                                                    {cat.value}
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Difficulty Level</Label>
                                <Select onValueChange={(v) => handleSelectChange('difficulty', v)} value={formData.difficulty}>
                                    <SelectTrigger className="h-11 rounded-xl border-gray-200 focus:ring-purple-500">
                                        <SelectValue placeholder="Select level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Price ($)</Label>
                                <div className="relative">
                                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="price"
                                        name="price"
                                        type="number"
                                        placeholder="0.00"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="h-11 pl-9 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Course Duration</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        id="duration"
                                        name="duration"
                                        placeholder="e.g., 12 hours"
                                        value={formData.duration}
                                        onChange={handleChange}
                                        className="h-11 pl-9 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2 text-center">
                            <Label htmlFor="thumbnail" className="text-sm font-semibold text-gray-700 dark:text-gray-300">Course Thumbnail</Label>
                            <div className="mt-2">
                                <Input
                                    id="thumbnail"
                                    name="thumbnail"
                                    placeholder="Enter image URL (e.g., Unsplash link)"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                    className="h-11 rounded-xl border-gray-200 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        </div>
                        {formData.thumbnail ? (
                            <div className="relative group aspect-video rounded-2xl overflow-hidden border-2 border-purple-100 dark:border-purple-900/30">
                                <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ImageIcon className="w-10 h-10 text-white" />
                                </div>
                            </div>
                        ) : (
                            <div className="p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-3 bg-gray-50/50 dark:bg-gray-800/20">
                                <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-900/20 flex items-center justify-center">
                                    <Upload className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="text-center">
                                    <p className="font-medium text-gray-900 dark:text-white">Upload course branding</p>
                                    <p className="text-xs text-gray-500 mt-1">Provide a high-quality image URL for your course</p>
                                </div>
                            </div>
                        )}
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 py-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 shadow-sm space-y-5">
                            <div className="flex gap-4">
                                {formData.thumbnail && (
                                    <img src={formData.thumbnail} className="w-24 h-16 object-cover rounded-lg shadow-sm" alt="" />
                                )}
                                <div>
                                    <h4 className="text-xs font-bold text-purple-600 uppercase tracking-wider">Review Course</h4>
                                    <p className="text-xl font-bold mt-1 text-gray-900 dark:text-white">{formData.title}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-4 gap-x-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Category</h4>
                                    <p className="text-sm font-semibold mt-1 flex items-center gap-2">
                                        <BookOpen className="w-3 h-3 text-purple-500" />
                                        {formData.category}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Difficulty</h4>
                                    <p className="text-sm font-semibold mt-1 flex items-center gap-2">
                                        <Zap className="w-3 h-3 text-orange-500" />
                                        {formData.difficulty}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Investment</h4>
                                    <p className="text-sm font-semibold mt-1 flex items-center gap-2 text-green-600">
                                        <DollarSign className="w-3 h-3" />
                                        {formData.price}
                                    </p>
                                </div>
                                <div>
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Duration</h4>
                                    <p className="text-sm font-semibold mt-1 flex items-center gap-2">
                                        <Clock className="w-3 h-3 text-blue-500" />
                                        {formData.duration}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/10 p-4 rounded-xl border border-blue-100/50 dark:border-blue-900/30">
                                <div className="shrink-0 w-8 h-8 rounded-full bg-white dark:bg-blue-900/30 flex items-center justify-center shadow-sm">
                                    <CheckCircle2 className="w-5 h-5" />
                                </div>
                                <span>Your course will be submitted for admin review before being published on the platform.</span>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-xl rounded-3xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="bg-white dark:bg-gray-900">
                    <DialogHeader className="p-8 pb-0">
                        <div className="flex items-center gap-3 mb-6">
                            {[1, 2, 3, 4].map((s) => (
                                <div key={s} className="flex items-center flex-1 last:flex-none last:w-8">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${step >= s ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30 ring-4 ring-purple-50 dark:ring-purple-900/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                        {step > s ? <CheckCircle2 className="w-4 h-4" /> : s}
                                    </div>
                                    {s < 4 && <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-500 ${step > s ? 'bg-purple-600' : 'bg-gray-100 dark:bg-gray-800'}`} />}
                                </div>
                            ))}
                        </div>
                        <DialogTitle className="text-3xl font-black bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                            {courseToEdit ? 'Edit Excellence' : 'Craft Your Course'}
                        </DialogTitle>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
                            {step === 1 && 'Let\'s start with the foundations of your curriculum.'}
                            {step === 2 && 'Set the investment and commitment for your students.'}
                            {step === 3 && 'Every great course needs a stunning visual identity.'}
                            {step === 4 && 'One last look before we launch your vision!'}
                        </p>
                    </DialogHeader>

                    <div className="px-8 mt-4">
                        {renderStep()}
                    </div>

                    <DialogFooter className="p-8 pt-4 gap-3 bg-gray-50/50 dark:bg-gray-800/10 border-t border-gray-100 dark:border-gray-800">
                        {step > 1 && (
                            <Button variant="ghost" onClick={prevStep} className="rounded-xl px-6 font-semibold hover:bg-gray-100 dark:hover:bg-gray-800">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back
                            </Button>
                        )}
                        {step < 4 ? (
                            <Button
                                onClick={nextStep}
                                disabled={
                                    (step === 1 && (!formData.title || !formData.description)) ||
                                    (step === 2 && (!formData.category || !formData.difficulty || !formData.price || !formData.duration))
                                }
                                className="rounded-xl px-8 bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/25 ml-auto font-bold transition-all active:scale-95"
                            >
                                Continue
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        ) : (
                            <Button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="rounded-xl px-8 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 ml-auto font-bold transition-all active:scale-95"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    courseToEdit ? 'Save Changes' : 'Initialize Course'
                                )}
                            </Button>
                        )}
                    </DialogFooter>
                </div>
            </DialogContent>
        </Dialog>
    );
}
