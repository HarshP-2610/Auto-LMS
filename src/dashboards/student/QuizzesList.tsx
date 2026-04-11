import { Link } from 'react-router-dom';
import { FileQuestion, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { quizzes as mockQuizzes } from '@/data/mockData';
import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export function QuizzesList() {
  const [quizzesList, setQuizzesList] = useState<any[]>([]);
  const [completedQuizzes, setCompletedQuizzes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuizzesAndResults = async () => {
      try {
        const [quizzesRes, extraRes, resultsRes, extraResultsRes] = await Promise.all([
          fetch('http://localhost:5000/api/quizzes', {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
          }),
          fetch('http://localhost:5000/api/extra-quizzes', {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
          }),
          fetch('http://localhost:5000/api/quizzes/completed/my-quizzes', {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
          }),
          fetch('http://localhost:5000/api/extra-quizzes/completed/my-quizzes', {
            headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` }
          })
        ]);

        if (quizzesRes.ok && extraRes.ok) {
          const apiQuizzes = await quizzesRes.json();
          const apiExtraQuizzes = await extraRes.json();
          
          const mappedRegular = apiQuizzes.map((q: any) => ({
            id: q._id,
            courseId: q.course?._id || q.course,
            courseTitle: q.course?.title || 'Unknown Course',
            title: q.title,
            duration: q.duration,
            passingMarks: q.passingMarks,
            totalQuestions: q.questions?.length || 0,
            questions: q.questions,
            isExtra: false
          }));

          const mappedExtra = apiExtraQuizzes.map((q: any) => ({
            id: q._id,
            courseId: q.course?._id || q.course,
            courseTitle: q.course?.title || 'Unknown Course',
            title: q.title,
            duration: q.duration,
            passingMarks: q.passingMarks,
            totalQuestions: q.questions?.length || 0,
            questions: q.questions,
            isExtra: true,
            extraXP: q.extraXP
          }));

          setQuizzesList([...mappedRegular, ...mappedExtra]);
        }

        if (resultsRes.ok && extraResultsRes.ok) {
          const apiResults = await resultsRes.json();
          const apiExtraResults = await extraResultsRes.json();
          setCompletedQuizzes([...apiResults, ...apiExtraResults]);
        }
      } catch (error) {
        console.error('Failed to fetch quizzes or results:', error);
        setQuizzesList(mockQuizzes);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzesAndResults();
  }, []);

  // Get unique latest result for each quiz
  const latestResults = Array.from(
    new Map(
      completedQuizzes.map((item) => [item.quiz?._id || item.quiz, item])
    ).values()
  );

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            My Quizzes
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Test your knowledge and track your progress
          </p>
        </div>

        {/* Quiz Results Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <FileQuestion className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Quizzes</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {loading ? '...' : quizzesList.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Passed</p>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? '...' : latestResults.filter((r) => r.passed).length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
                <p className="text-2xl font-bold text-red-600">
                  {loading ? '...' : latestResults.filter((r) => !r.passed).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Available Quizzes */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Available Quizzes
            </h2>
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <div className="p-12 text-center">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-500">Fetching quizzes...</p>
              </div>
            ) : quizzesList.length === 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-500">No quizzes available at the moment.</p>
              </div>
            ) : quizzesList.map((quiz) => {
              const result = latestResults.find((r) => (r.quiz?._id || r.quiz) === quiz.id);
              const isAttempted = !!result;

              return (
                <div
                  key={quiz.id}
                  className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${isAttempted
                        ? result?.passed
                          ? 'bg-green-100 dark:bg-green-900/30'
                          : 'bg-red-100 dark:bg-red-900/30'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                        }`}
                    >
                      <FileQuestion
                        className={`w-6 h-6 ${isAttempted
                          ? result?.passed
                            ? 'text-green-600 dark:text-green-400'
                            : 'text-red-600 dark:text-red-400'
                          : 'text-blue-600 dark:text-blue-400'
                          }`}
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {quiz.title}
                        </h3>
                        {quiz.isExtra && (
                          <span className="px-2 py-0.5 text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 rounded-full">
                            +{quiz.extraXP} XP Bonus
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {quiz.courseTitle}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {quiz.duration} minutes
                        </span>
                        <span>{quiz.totalQuestions} questions</span>
                        <span>Pass: {quiz.passingMarks}%</span>
                      </div>
                      {isAttempted && (
                        <div className="mt-2 text-sm font-medium">
                          <span className={result.passed ? 'text-green-600' : 'text-red-600'}>
                            {result.passed ? 'Passed' : 'Failed'} - {result.score}%
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <Button
                    asChild
                    variant={isAttempted ? 'outline' : 'default'}
                    className={!isAttempted ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'border-blue-600 text-blue-600 hover:bg-blue-50'}
                  >
                    {isAttempted ? (
                      <Link to={`/student/quiz-result/${result._id}`}>
                        View Result
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    ) : (
                      <Link to={`/student/quiz/${quiz.id}${quiz.isExtra ? '?type=extra' : ''}`}>
                        Start Quiz
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    )}
                  </Button>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
