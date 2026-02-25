import { useState } from 'react';
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
import { CheckCircle2, ArrowRight, ArrowLeft, Upload } from 'lucide-react';

interface CreateCourseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export function CreateCourseModal({ isOpen, onClose, onSuccess }: CreateCourseModalProps) {
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
            const res = await fetch('http://localhost:5000/api/courses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Course submitted for review!');
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
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Course Name</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="Enter course title"
                                value={formData.title}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Describe your course"
                                value={formData.description}
                                onChange={handleChange}
                                className="h-32"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="skills">Skill Tags (comma separated)</Label>
                            <Input
                                id="skills"
                                name="skills"
                                placeholder="React, Node.js, TypeScript"
                                value={formData.skills}
                                onChange={handleChange}
                            />
                        </div>
                    </div>
                );
            case 2:
                return (
                    <div className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select onValueChange={(v) => handleSelectChange('category', v)} value={formData.category}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Development">Development</SelectItem>
                                        <SelectItem value="Design">Design</SelectItem>
                                        <SelectItem value="Business">Business</SelectItem>
                                        <SelectItem value="Marketing">Marketing</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty Level</Label>
                                <Select onValueChange={(v) => handleSelectChange('difficulty', v)} value={formData.difficulty}>
                                    <SelectTrigger>
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
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="price">Price ($)</Label>
                                <Input
                                    id="price"
                                    name="price"
                                    type="number"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="duration">Course Duration (e.g. 12 hours)</Label>
                                <Input
                                    id="duration"
                                    name="duration"
                                    placeholder="12 hours"
                                    value={formData.duration}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>
                );
            case 3:
                return (
                    <div className="space-y-4 py-4 text-center">
                        <Label>Course Thumbnail URL</Label>
                        <div className="mt-2">
                            <Input
                                id="thumbnail"
                                name="thumbnail"
                                placeholder="https://example.com/image.jpg"
                                value={formData.thumbnail}
                                onChange={handleChange}
                            />
                        </div>
                        {formData.thumbnail && (
                            <div className="mt-4 aspect-video rounded-xl overflow-hidden border">
                                <img src={formData.thumbnail} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                        <div className="p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800/50 mt-4">
                            <Upload className="w-8 h-8 text-gray-400" />
                            <p className="text-sm text-gray-500">Provide a URL for your course thumbnail</p>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <div className="space-y-6 py-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Course Name</h4>
                                <p className="text-lg font-semibold mt-1">{formData.title}</p>
                            </div>
                            <div>
                                <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Description</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-3">{formData.description}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Category</h4>
                                    <p className="mt-1">{formData.category}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Level</h4>
                                    <p className="mt-1">{formData.difficulty}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Price</h4>
                                    <p className="mt-1">${formData.price}</p>
                                </div>
                                <div>
                                    <h4 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Duration</h4>
                                    <p className="mt-1">{formData.duration}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>Your course will be submitted for admin review before publishing.</span>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-4">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                                </div>
                                {s < 4 && <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${step > s ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'}`} />}
                            </div>
                        ))}
                    </div>
                    <DialogTitle className="text-2xl">
                        {step === 1 && 'Basic Information'}
                        {step === 2 && 'Pricing & Details'}
                        {step === 3 && 'Course Branding'}
                        {step === 4 && 'Review & Submit'}
                    </DialogTitle>
                </DialogHeader>

                {renderStep()}

                <DialogFooter className="gap-2 sm:gap-0">
                    {step > 1 && (
                        <Button variant="outline" onClick={prevStep} className="flex-1 sm:flex-none">
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
                            className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 ml-auto font-semibold"
                        >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 ml-auto font-semibold"
                        >
                            {loading ? 'Submitting...' : 'Submit Course'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
