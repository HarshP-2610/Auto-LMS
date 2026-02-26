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
import { toast } from 'sonner';
import { CheckCircle2, ArrowRight, ArrowLeft, PlayCircle, Clock } from 'lucide-react';

interface CreateTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    lessonId: string;
    lessonTitle: string;
}

export function CreateTopicModal({ isOpen, onClose, onSuccess, lessonId, lessonTitle }: CreateTopicModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        lesson: lessonId,
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('http://localhost:5000/api/topics', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, lesson: lessonId }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success('Topic added successfully!');
                onSuccess?.();
                onClose();
                // Reset form
                setFormData({
                    lesson: lessonId,
                    title: '',
                    description: '',
                    videoUrl: '',
                    duration: '',
                });
                setStep(1);
            } else {
                toast.error(data.message || 'Failed to add topic');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <div className="flex items-center gap-4 mb-4 pr-6">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className="flex items-center flex-1">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${step >= s ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
                                    {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                                </div>
                                {s < 3 && <div className={`h-1 flex-1 mx-2 rounded-full transition-all duration-300 ${step > s ? 'bg-blue-600' : 'bg-gray-100 dark:bg-gray-800'}`} />}
                            </div>
                        ))}
                    </div>
                    <DialogTitle className="text-2xl font-bold">
                        {step === 1 && 'Topic Basics'}
                        {step === 2 && 'Media & Time'}
                        {step === 3 && 'Final Review'}
                    </DialogTitle>
                </DialogHeader>

                {step === 1 && (
                    <div className="space-y-4 py-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Adding to Section:</p>
                            <p className="text-sm font-bold text-gray-900 dark:text-white">{lessonTitle}</p>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="title">Topic Name</Label>
                            <Input
                                id="title"
                                name="title"
                                placeholder="e.g. Setting up your IDE"
                                value={formData.title}
                                onChange={handleChange}
                                className="h-11"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Short Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="What will students learn in this topic?"
                                value={formData.description}
                                onChange={handleChange}
                                className="h-28 resize-none"
                            />
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="space-y-4 py-4">
                        <div className="space-y-2">
                            <Label htmlFor="videoUrl">Video URL</Label>
                            <div className="relative">
                                <PlayCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="videoUrl"
                                    name="videoUrl"
                                    placeholder="https://youtube.com/..."
                                    value={formData.videoUrl}
                                    onChange={handleChange}
                                    className="pl-10 h-11"
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Estimated Time (e.g. 10:45)</Label>
                            <div className="relative">
                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="duration"
                                    name="duration"
                                    placeholder="MM:SS"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    className="pl-10 h-11"
                                />
                            </div>
                        </div>
                        <div className="p-6 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 bg-gray-50 dark:bg-gray-800/50 mt-4 text-center">
                            <PlayCircle className="w-8 h-8 text-blue-500" />
                            <p className="text-sm font-medium">Video Content</p>
                            <p className="text-xs text-gray-500">Currently we support YouTube and Vimeo links.</p>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="space-y-6 py-4">
                        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 space-y-4">
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Topic Title</h4>
                                <p className="text-base font-semibold mt-1">{formData.title}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-400">Time</h4>
                                    <p className="text-sm font-medium mt-1">{formData.duration}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-400">Type</h4>
                                    <p className="text-sm font-medium mt-1 text-green-600">Video</p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-400">Description</h4>
                                <p className="text-xs mt-1 line-clamp-2 italic">{formData.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>This topic will be visible to students immediately.</span>
                        </div>
                    </div>
                )}

                <DialogFooter className="gap-2 sm:gap-0 border-t border-gray-100 dark:border-gray-800 pt-6">
                    {step > 1 && (
                        <Button variant="outline" onClick={prevStep} className="h-11 px-6">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back
                        </Button>
                    )}
                    {step < 3 ? (
                        <Button
                            onClick={nextStep}
                            disabled={
                                (step === 1 && (!formData.title || !formData.description)) ||
                                (step === 2 && (!formData.videoUrl || !formData.duration))
                            }
                            className="bg-blue-600 hover:bg-blue-700 ml-auto h-11 px-8"
                        >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 ml-auto h-11 px-8"
                        >
                            {loading ? 'Adding...' : 'Add Topic'}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
