import { Link } from 'react-router-dom';
import { FileQuestion, Clock, CheckCircle, XCircle, ArrowRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { quizzes, quizResults } from '@/data/mockData';

export function QuizzesList() {
  const attemptedQuizIds = quizResults.map((r) => r.quizId);

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
                  {quizzes.length}
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
                  {quizResults.filter((r) => r.passed).length}
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
                  {quizResults.filter((r) => !r.passed).length}
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
            {quizzes.map((quiz) => {
              const result = quizResults.find((r) => r.quizId === quiz.id);
              const isAttempted = attemptedQuizIds.includes(quiz.id);

              return (
                <div
                  key={quiz.id}
                  className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isAttempted
                          ? result?.passed
                            ? 'bg-green-100 dark:bg-green-900/30'
                            : 'bg-red-100 dark:bg-red-900/30'
                          : 'bg-blue-100 dark:bg-blue-900/30'
                      }`}
                    >
                      <FileQuestion
                        className={`w-6 h-6 ${
                          isAttempted
                            ? result?.passed
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                            : 'text-blue-600 dark:text-blue-400'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {quiz.title}
                      </h3>
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
                      {isAttempted && result && (
                        <div className="mt-2">
                          <Badge
                            variant={result.passed ? 'default' : 'destructive'}
                            className={
                              result.passed
                                ? 'bg-green-100 text-green-700 hover:bg-green-100'
                                : ''
                            }
                          >
                            {result.passed ? 'Passed' : 'Failed'} - {result.score}%
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    asChild
                    variant={isAttempted ? 'outline' : 'default'}
                    className={!isAttempted ? 'bg-gradient-to-r from-blue-600 to-purple-600' : ''}
                  >
                    <Link to={`/student/quiz/${quiz.id}`}>
                      {isAttempted ? 'Retake Quiz' : 'Start Quiz'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
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
