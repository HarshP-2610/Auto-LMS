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
import { toast } from 'sonner';
import { CheckCircle2, ArrowRight, ArrowLeft, PlayCircle, Clock, Upload, Loader2 } from 'lucide-react';

interface CreateTopicModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    lessonId: string;
    lessonTitle: string;
    editingTopic?: any;
}

export function CreateTopicModal({ isOpen, onClose, onSuccess, lessonId, lessonTitle, editingTopic }: CreateTopicModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [videoSource, setVideoSource] = useState<'url' | 'local'>('url');
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [formData, setFormData] = useState({
        lesson: lessonId,
        title: '',
        description: '',
        videoUrl: '',
        duration: '',
    });

    useEffect(() => {
        if (isOpen) {
            if (editingTopic) {
                setFormData({
                    lesson: lessonId,
                    title: editingTopic.title || '',
                    description: editingTopic.description || '',
                    videoUrl: editingTopic.videoUrl || '',
                    duration: editingTopic.duration || '',
                });
                setVideoSource(editingTopic.videoUrl?.startsWith('http') ? 'url' : 'local');
            } else {
                setFormData({
                    lesson: lessonId,
                    title: '',
                    description: '',
                    videoUrl: '',
                    duration: '',
                });
                setVideoSource('url');
                setVideoFile(null);
            }
        }
    }, [isOpen, lessonId, editingTopic]);

    const handleVideoUpload = async (file: File) => {
        setUploading(true);
        const uploadData = new FormData();
        uploadData.append('video', file);

        try {
            const token = localStorage.getItem('userToken');
            const res = await fetch('http://localhost:5000/api/upload/video', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: uploadData,
            });

            const data = await res.json();
            if (res.ok) {
                return data.videoPath;
            } else {
                toast.error(data.message || 'Video upload failed');
                return null;
            }
        } catch (error) {
            toast.error('Error uploading video');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        setLoading(true);
        try {
            let finalVideoUrl = formData.videoUrl;

            if (videoSource === 'local' && videoFile) {
                const uploadedPath = await handleVideoUpload(videoFile);
                if (!uploadedPath) {
                    setLoading(false);
                    return;
                }
                finalVideoUrl = uploadedPath;
            }

            const token = localStorage.getItem('userToken');
            const url = editingTopic
                ? `http://localhost:5000/api/topics/${editingTopic._id}`
                : 'http://localhost:5000/api/topics';

            const res = await fetch(url, {
                method: editingTopic ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ ...formData, videoUrl: finalVideoUrl, lesson: lessonId }),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(editingTopic ? 'Topic updated successfully!' : 'Topic added successfully!');
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
                setVideoFile(null);
                setStep(1);
            } else {
                toast.error(data.message || 'Failed to process topic');
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
                        {step === 1 && (editingTopic ? 'Edit Topic Basics' : 'Topic Basics')}
                        {step === 2 && (editingTopic ? 'Edit Media & Time' : 'Media & Time')}
                        {step === 3 && 'Final Review'}
                    </DialogTitle>
                </DialogHeader>

                {step === 1 && (
                    <div className="space-y-4 py-4">
                        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-800">
                            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">{editingTopic ? 'Editing in Section:' : 'Adding to Section:'}</p>
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
                        <div className="space-y-4">
                            <Label>Video Source</Label>
                            <div className="flex gap-4">
                                <Button
                                    type="button"
                                    variant={videoSource === 'url' ? 'default' : 'outline'}
                                    onClick={() => setVideoSource('url')}
                                    className="flex-1"
                                >
                                    External URL
                                </Button>
                                <Button
                                    type="button"
                                    variant={videoSource === 'local' ? 'default' : 'outline'}
                                    onClick={() => setVideoSource('local')}
                                    className="flex-1"
                                >
                                    Local Upload
                                </Button>
                            </div>
                        </div>

                        {videoSource === 'url' ? (
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
                        ) : (
                            <div className="space-y-2">
                                <Label>Upload Video File</Label>
                                <div className="relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 bg-gray-50 dark:bg-gray-800/20 hover:bg-gray-100 dark:hover:bg-gray-800/40 transition-colors cursor-pointer group">
                                    <input
                                        type="file"
                                        accept="video/*"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                                    />
                                    {videoFile ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center text-green-600">
                                                <PlayCircle className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-semibold">{videoFile.name}</p>
                                            <p className="text-xs text-gray-500">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                                                <Upload className="w-6 h-6" />
                                            </div>
                                            <p className="text-sm font-semibold">Click or drag video to upload</p>
                                            <p className="text-xs text-gray-500">MP4, WebM, or MKV</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

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
                                    <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-400">Source</h4>
                                    <p className="text-sm font-medium mt-1 text-blue-600">
                                        {videoSource === 'url' ? 'External URL' : 'Local File'}
                                    </p>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider text-gray-400">Description</h4>
                                <p className="text-xs mt-1 line-clamp-2 italic">{formData.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-xl">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>This topic will be {editingTopic ? 'updated for students' : 'visible to students immediately'}.</span>
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
                                (step === 2 && (
                                    (videoSource === 'url' && !formData.videoUrl) ||
                                    (videoSource === 'local' && !videoFile && !formData.videoUrl)
                                ))
                            }
                            className="bg-blue-600 hover:bg-blue-700 ml-auto h-11 px-8"
                        >
                            Next
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                    ) : (
                        <Button
                            onClick={handleSubmit}
                            disabled={loading || uploading}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 ml-auto h-11 px-8 min-w-[140px]"
                        >
                            {loading || uploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    {uploading ? 'Uploading Video...' : (editingTopic ? 'Updating...' : 'Adding...')}
                                </>
                            ) : (
                                (editingTopic ? 'Update Topic' : 'Add Topic')
                            )}
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
