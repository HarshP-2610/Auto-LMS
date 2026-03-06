import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, CheckCircle2, XCircle, Award, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';


export function QuizResultView() {
    const { id } = useParams<{ id: string }>();
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchResultDetails = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/quizzes/completed/details/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
                });
                if (response.ok) {
                    const data = await response.json();
                    setResult(data);
                }
            } catch (error) {
                console.error('Failed to fetch result details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchResultDetails();
    }, [id]);

    if (loading) {
        return (
            <DashboardLayout userRole="student">
                <div className="flex flex-col items-center justify-center py-20">
                    <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                    <p className="text-gray-500 font-medium font-outfit">Loading your assessment results...</p>
                </div>
            </DashboardLayout>
        );
    }

    if (!result) {
        return (
            <DashboardLayout userRole="student">
                <div className="text-center py-16">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 font-outfit">
                        Result Not Found
                    </h1>
                    <Button asChild className="rounded-xl">
                        <Link to="/student/quizzes">Back to Quizzes</Link>
                    </Button>
                </div>
            </DashboardLayout>
        );
    }

    const { quiz, score, passed, answers, totalQuestions, correctAnswers, course } = result;

    return (
        <DashboardLayout userRole="student">
            <div className="max-w-5xl mx-auto pb-12">
                {/* Navigation */}
                <div className="mb-6">
                    <Button variant="ghost" size="sm" asChild className="hover:bg-blue-50 dark:hover:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-xl transition-colors">
                        <Link to="/student/quizzes" className="flex items-center gap-2">
                            <ChevronLeft className="w-4 h-4" />
                            Back to My Quizzes
                        </Link>
                    </Button>
                </div>

                {/* Hero Header */}
                <div className="relative overflow-hidden bg-white dark:bg-gray-900 rounded-[2rem] border border-gray-200 dark:border-gray-800 p-8 md:p-12 shadow-2xl shadow-blue-500/5 mb-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 blur-3xl -mr-20 -mt-20 rounded-full" />

                    <div className="relative flex flex-col md:flex-row items-center gap-10">
                        {/* Score Ring */}
                        <div className="relative w-48 h-48 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="96" cy="96" r="88"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    className="text-gray-100 dark:text-gray-800"
                                />
                                <circle
                                    cx="96" cy="96" r="88"
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="12"
                                    strokeDasharray={2 * Math.PI * 88}
                                    strokeDashoffset={2 * Math.PI * 88 * (1 - score / 100)}
                                    strokeLinecap="round"
                                    className={`transition-all duration-1000 ease-out ${passed ? 'text-green-500' : 'text-red-500'}`}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-5xl font-black font-outfit ${passed ? 'text-green-600' : 'text-red-600'}`}>
                                    {score}%
                                </span>
                                <span className="text-gray-500 text-sm font-medium uppercase tracking-wider">Score</span>
                            </div>
                        </div>

                        {/* Assessment Details */}
                        <div className="flex-1 text-center md:text-left">
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mb-4">
                                <span className={`px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2 ${passed
                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                    }`}>
                                    {passed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                    {passed ? 'PASSED' : 'FAILED'}
                                </span>
                                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                                    <Award className="w-4 h-4" />
                                    {quiz.title}
                                </span>
                            </div>

                            <h1 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-3 font-outfit">
                                Assessment Summary
                            </h1>
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 font-medium">
                                Part of: <span className="text-blue-600 font-bold">{course?.title}</span>
                            </p>

                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Total Questions</p>
                                    <p className="text-xl font-black text-gray-900 dark:text-white">{totalQuestions}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Correct Answers</p>
                                    <p className="text-xl font-black text-green-600">{correctAnswers}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 hidden sm:block">
                                    <p className="text-xs text-gray-500 mb-1 uppercase tracking-wider font-bold">Passing Mark</p>
                                    <p className="text-xl font-black text-blue-600">{quiz.passingMarks}%</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Detailed Review Section */}
                <div className="space-y-8">
                    <div className="flex items-center gap-4 mb-2">
                        <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-lg shadow-indigo-500/10">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-black text-gray-900 dark:text-white font-outfit">Detailed Question Review</h2>
                            <p className="text-gray-500 dark:text-gray-400 font-medium">Review your performance for each question</p>
                        </div>
                    </div>

                    <div className="grid gap-6">
                        {quiz.questions.map((q: any, idx: number) => {
                            const studentAnswerObj = answers.find((a: any) => a.questionId === q._id);
                            const selectedOptionIndex = studentAnswerObj?.selectedOption;
                            const isCorrect = studentAnswerObj?.isCorrect;

                            return (
                                <div
                                    key={q._id}
                                    className={`group relative bg-white dark:bg-gray-900 rounded-[1.5rem] border transition-all duration-300 ${isCorrect
                                        ? 'border-green-100 dark:border-green-900/20 hover:border-green-200 dark:hover:border-green-900/40'
                                        : 'border-red-100 dark:border-red-900/20 hover:border-red-200 dark:hover:border-red-900/40'
                                        } p-6 md:p-8 overflow-hidden`}
                                >
                                    <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 -mr-10 -mt-10 rounded-full ${isCorrect ? 'bg-green-500' : 'bg-red-500'
                                        }`} />

                                    <div className="relative flex flex-col md:flex-row gap-6">
                                        {/* Question Number */}
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black font-outfit text-xl shadow-lg ${isCorrect
                                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                                            }`}>
                                            {idx + 1}
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 font-outfit">
                                                {q.text}
                                            </h3>

                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                {q.options.map((option: string, optIdx: number) => {
                                                    const isSelected = selectedOptionIndex === optIdx;
                                                    const isCorrectOption = q.correctOptionIndex === optIdx;

                                                    let bgClass = 'bg-gray-50/50 dark:bg-gray-800/30 border-gray-100 dark:border-gray-800';
                                                    let textClass = 'text-gray-600 dark:text-gray-400';
                                                    let icon = null;

                                                    if (isSelected && isCorrectOption) {
                                                        bgClass = 'bg-green-100 border-green-200 dark:bg-green-900/30 dark:border-green-800 shadow-md shadow-green-500/5';
                                                        textClass = 'text-green-700 dark:text-green-400 font-bold';
                                                        icon = <CheckCircle2 className="w-5 h-5 text-green-500" />;
                                                    } else if (isSelected && !isCorrectOption) {
                                                        bgClass = 'bg-red-100 border-red-200 dark:bg-red-900/30 dark:border-red-800 shadow-md shadow-red-500/5';
                                                        textClass = 'text-red-700 dark:text-red-400 font-bold';
                                                        icon = <XCircle className="w-5 h-5 text-red-500" />;
                                                    } else if (isCorrectOption) {
                                                        bgClass = 'bg-green-50 border-green-100 dark:bg-green-900/10 dark:border-green-900/30';
                                                        textClass = 'text-green-600 dark:text-green-500 font-bold';
                                                        icon = <CheckCircle2 className="w-5 h-5 opacity-50" />;
                                                    }

                                                    return (
                                                        <div
                                                            key={optIdx}
                                                            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${bgClass}`}
                                                        >
                                                            <span className={textClass}>{option}</span>
                                                            {icon}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            <div className="mt-6 flex flex-wrap gap-4">
                                                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold ${isCorrect
                                                    ? 'bg-green-50 text-green-700 dark:bg-green-900/20'
                                                    : 'bg-red-50 text-red-700 dark:bg-red-900/20'
                                                    }`}>
                                                    {isCorrect ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                                                    Your Answer: {selectedOptionIndex !== undefined ? q.options[selectedOptionIndex] : 'Not Answered'}
                                                </div>
                                                {!isCorrect && (
                                                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-50 text-blue-700 dark:bg-blue-900/20 text-sm font-bold">
                                                        <AlertCircle className="w-4 h-4" />
                                                        Correct Answer: {q.options[q.correctOptionIndex]}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
