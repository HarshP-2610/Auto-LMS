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
import { toast } from 'sonner';
import {
    CheckCircle2,
    Plus,
    Trash2,
    Edit,
    FileQuestion,
    Clock,
    CheckCircle,
    Loader2,
    ChevronRight,
    ChevronLeft
} from 'lucide-react';

interface CreateAssessmentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    lessonId?: string;
    courseId: string;
    lessonTitle: string;
    editingQuiz?: any;
    isFinalAssessment?: boolean;
}

export function CreateAssessmentModal({
    isOpen,
    onClose,
    onSuccess,
    lessonId,
    courseId,
    lessonTitle,
    editingQuiz,
    isFinalAssessment = false
}: CreateAssessmentModalProps) {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

    const [formData, setFormData] = useState({
        title: '',
        course: courseId,
        lesson: lessonId || undefined,
        duration: 15,
        passingMarks: 70,
        questions: [] as any[],
        isFinalAssessment: isFinalAssessment
    });

    const [currentQuestion, setCurrentQuestion] = useState({
        text: '',
        options: ['', '', '', ''],
        correctOptionIndex: 0,
    });

    useEffect(() => {
        if (isOpen) {
            if (editingQuiz) {
                setFormData({
                    title: editingQuiz.title || '',
                    course: courseId,
                    lesson: lessonId || undefined,
                    duration: editingQuiz.duration || 15,
                    passingMarks: editingQuiz.passingMarks || 70,
                    questions: editingQuiz.questions || [],
                    isFinalAssessment: editingQuiz.isFinalAssessment || isFinalAssessment
                });
            } else {
                setFormData({
                    title: '',
                    course: courseId,
                    lesson: lessonId || undefined,
                    duration: 15,
                    passingMarks: 70,
                    questions: [],
                    isFinalAssessment: isFinalAssessment
                });
            }
            setStep(1);
        }
    }, [isOpen, lessonId, courseId, editingQuiz, isFinalAssessment]);

    const handleQuestionChange = (index: number, value: string) => {
        const newOptions = [...currentQuestion.options];
        newOptions[index] = value;
        setCurrentQuestion({ ...currentQuestion, options: newOptions });
    };

    const addQuestion = () => {
        if (!currentQuestion.text.trim() || currentQuestion.options.some(o => !o.trim())) {
            toast.error("Please fill all question fields and options");
            return;
        }
        setFormData(prev => ({
            ...prev,
            questions: [...prev.questions, currentQuestion]
        }));
        setCurrentQuestion({ text: '', options: ['', '', '', ''], correctOptionIndex: 0 });
        toast.success("Question added!");
    };

    const removeQuestion = (index: number) => {
        const updated = [...formData.questions];
        updated.splice(index, 1);
        setFormData({ ...formData, questions: updated });
        if (editingQuestionIndex === index) {
            cancelEdit();
        } else if (editingQuestionIndex !== null && editingQuestionIndex > index) {
            setEditingQuestionIndex(editingQuestionIndex - 1);
        }
    };

    const startEditQuestion = (index: number) => {
        const question = formData.questions[index];
        setCurrentQuestion({
            text: question.text,
            options: [...question.options],
            correctOptionIndex: question.correctOptionIndex
        });
        setEditingQuestionIndex(index);
    };

    const updateQuestion = () => {
        if (!currentQuestion.text.trim() || currentQuestion.options.some(o => !o.trim())) {
            toast.error("Please fill all question fields and options");
            return;
        }

        const updatedQuestions = [...formData.questions];
        updatedQuestions[editingQuestionIndex!] = currentQuestion;

        setFormData(prev => ({
            ...prev,
            questions: updatedQuestions
        }));

        setCurrentQuestion({ text: '', options: ['', '', '', ''], correctOptionIndex: 0 });
        setEditingQuestionIndex(null);
        toast.success("Question updated!");
    };

    const cancelEdit = () => {
        setCurrentQuestion({ text: '', options: ['', '', '', ''], correctOptionIndex: 0 });
        setEditingQuestionIndex(null);
    };

    const handleSubmit = async () => {
        if (formData.questions.length === 0) {
            toast.error("Please add at least one question");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem('userToken');

            let url;
            let method;

            if (isFinalAssessment) {
                // Final assessments use the dedicated endpoint
                // It's a single entry per course, so we use POST for both create/update in our controller logic
                // Or if we implemented update as separate, we use it here.
                // My controller's POST handles createOrUpdate.
                url = 'http://localhost:5000/api/final-assessments';
                method = 'POST';
            } else {
                // Regular quizzes use the quizzes endpoint
                url = editingQuiz
                    ? `http://localhost:5000/api/quizzes/${editingQuiz._id}`
                    : 'http://localhost:5000/api/quizzes';
                method = editingQuiz ? 'PUT' : 'POST';
            }

            const res = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (res.ok) {
                toast.success(editingQuiz ? 'Assessment updated!' : 'Assessment created!');
                onSuccess?.();
                onClose();
            } else {
                toast.error(data.message || 'Failed to save assessment');
            }
        } catch (error) {
            toast.error('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col p-0 border-none shadow-2xl bg-white dark:bg-gray-950">
                <DialogHeader className="p-6 pb-0">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                            <FileQuestion className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">
                                {editingQuiz ? (isFinalAssessment ? 'Edit Final Assessment' : 'Edit Assessment') : (isFinalAssessment ? 'Create Final Assessment' : 'New Assessment')}
                            </DialogTitle>
                            <p className="text-sm text-gray-500">{isFinalAssessment ? `For Course: ${lessonTitle}` : `In Section: ${lessonTitle}`}</p>
                        </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                        {[1, 2].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-purple-600' : 'bg-gray-100 dark:bg-gray-800'}`}
                            />
                        ))}
                    </div>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {step === 1 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Assessment Title</Label>
                                <Input
                                    placeholder="e.g. Section Knowledge Check"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="h-11 border-gray-200 focus:ring-purple-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Duration (mins)</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="number"
                                            value={formData.duration}
                                            onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                                            className="h-11 pl-10 border-gray-200 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Passing Score (%)</Label>
                                    <div className="relative">
                                        <CheckCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <Input
                                            type="number"
                                            value={formData.passingMarks}
                                            onChange={e => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                                            className="h-11 pl-10 border-gray-200 focus:ring-purple-500"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-2xl border border-purple-100 dark:border-purple-900/30">
                                <h4 className="text-sm font-bold text-purple-900 dark:text-purple-300 mb-1">
                                    {isFinalAssessment ? 'Final Course Assessment' : 'Section Assessment'}
                                </h4>
                                <p className="text-xs text-purple-700 dark:text-purple-400/80 leading-relaxed">
                                    {isFinalAssessment
                                        ? 'This assessment covers the entire course. Students must pass this to receive their certificate.'
                                        : 'Assessments are added specifically to this lesson and will be visible to students after they complete all topics in this section.'}
                                </p>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6">
                            {/* Question List */}
                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-900 dark:text-white flex items-center justify-between">
                                    Questions ({formData.questions.length})
                                </h3>

                                {formData.questions.map((q, qIdx) => (
                                    <div key={qIdx} className="group relative bg-gray-50 dark:bg-gray-900 p-4 rounded-xl border border-gray-100 dark:border-gray-800 transition-all hover:shadow-md">
                                        <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => startEditQuestion(qIdx)}
                                                className="text-gray-400 hover:text-blue-500 transition-colors"
                                                title="Edit Question"
                                            >
                                                <Edit className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => removeQuestion(qIdx)}
                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                title="Remove Question"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <p className="text-sm font-bold text-gray-900 dark:text-white mb-2 pr-8">{qIdx + 1}. {q.text}</p>
                                        <div className="grid grid-cols-2 gap-2">
                                            {q.options.map((opt: string, oIdx: number) => (
                                                <div key={oIdx} className={`text-xs p-2 rounded-lg border ${q.correctOptionIndex === oIdx ? 'bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-500'}`}>
                                                    {opt} {q.correctOptionIndex === oIdx && '✓'}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Question Form */}
                            <div className="p-5 rounded-2xl border-2 border-dashed border-purple-100 dark:border-purple-900/30 bg-purple-50/30 dark:bg-purple-900/5 space-y-4">
                                <div className="space-y-2">
                                    <Label className={`text-xs font-bold uppercase tracking-wider ${editingQuestionIndex !== null ? 'text-blue-600' : 'text-purple-600'}`}>
                                        {editingQuestionIndex !== null ? 'Edit Question' : 'New Question'}
                                    </Label>
                                    <Input
                                        placeholder="Enter the question text..."
                                        value={currentQuestion.text}
                                        onChange={e => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                                        className="h-11 bg-white dark:bg-gray-900"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-xs font-bold uppercase tracking-wider text-gray-500">Options (Select correct one)</Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {currentQuestion.options.map((opt, oIdx) => (
                                            <div key={oIdx} className="flex items-center gap-3">
                                                <button
                                                    onClick={() => setCurrentQuestion({ ...currentQuestion, correctOptionIndex: oIdx })}
                                                    className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${currentQuestion.correctOptionIndex === oIdx ? 'bg-green-500 text-white border-none' : 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-transparent'}`}
                                                >
                                                    <CheckCircle2 className="w-4 h-4" />
                                                </button>
                                                <Input
                                                    placeholder={`Option ${oIdx + 1}`}
                                                    value={opt}
                                                    onChange={e => handleQuestionChange(oIdx, e.target.value)}
                                                    className="h-10 bg-white dark:bg-gray-900"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {editingQuestionIndex !== null && (
                                        <Button
                                            onClick={cancelEdit}
                                            variant="ghost"
                                            className="flex-1 h-11 text-gray-500 rounded-xl"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                    <Button
                                        onClick={editingQuestionIndex !== null ? updateQuestion : addQuestion}
                                        variant="outline"
                                        className={`flex-[2] h-11 ${editingQuestionIndex !== null ? 'border-blue-200 text-blue-600 hover:bg-blue-50' : 'border-purple-200 text-purple-600 hover:bg-purple-100'} dark:hover:bg-purple-900/20 rounded-xl transition-all`}
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        {editingQuestionIndex !== null ? 'Update Question' : 'Add Question to Assessment'}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <DialogFooter className="p-6 pt-2 border-t border-gray-50 dark:border-gray-900 bg-gray-50/50 dark:bg-gray-950/50 backdrop-blur-sm">
                    {step === 1 ? (
                        <div className="flex w-full justify-between items-center">
                            <Button variant="ghost" onClick={onClose} className="text-gray-500">Cancel</Button>
                            <Button
                                onClick={() => setStep(2)}
                                disabled={!formData.title}
                                className="bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-500/20 px-8 rounded-xl h-11"
                            >
                                Next: Questions <ChevronRight className="w-4 h-4 ml-2" />
                            </Button>
                        </div>
                    ) : (
                        <div className="flex w-full justify-between items-center gap-3">
                            <Button variant="ghost" onClick={() => setStep(1)} className="text-gray-500">
                                <ChevronLeft className="w-4 h-4 mr-2" /> Back
                            </Button>
                            <Button
                                onClick={handleSubmit}
                                disabled={loading || formData.questions.length === 0}
                                className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/20 rounded-xl h-11 font-bold text-white transition-all transform active:scale-[0.98]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        {editingQuiz ? 'Updating...' : 'Creating...'}
                                    </>
                                ) : (
                                    editingQuiz ? 'Update Assessment' : 'Save Assessment'
                                )}
                            </Button>
                        </div>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
