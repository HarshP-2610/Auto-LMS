import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, ChevronLeft, ChevronRight, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { quizzes } from '@/data/mockData';

export function QuizPage() {
  const { id } = useParams<{ id: string }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const quiz = quizzes.find((q) => q.id === id);

  useEffect(() => {
    if (quiz) {
      setTimeLeft(quiz.duration * 60);
    }
  }, [quiz]);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  if (!quiz) {
    return (
      <DashboardLayout userRole="student">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Quiz Not Found
          </h1>
          <Button asChild>
            <Link to="/student/quizzes">Back to Quizzes</Link>
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answerIndex: number) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answerIndex });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.questions.forEach((q) => {
      if (selectedAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const finalScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(finalScore);
    setIsSubmitted(true);
  };

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const answeredCount = Object.keys(selectedAnswers).length;

  if (isSubmitted) {
    const passed = score >= quiz.passingMarks;
    return (
      <DashboardLayout userRole="student">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-200 dark:border-gray-800 text-center">
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                passed
                  ? 'bg-green-100 dark:bg-green-900/30'
                  : 'bg-red-100 dark:bg-red-900/30'
              }`}
            >
              {passed ? (
                <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-10 h-10 text-red-600 dark:text-red-400" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {passed ? 'Congratulations!' : 'Quiz Completed'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {passed
                ? 'You have successfully passed the quiz!'
                : 'Keep practicing to improve your score.'}
            </p>

            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 mb-8">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Your Score</p>
                  <p
                    className={`text-3xl font-bold ${
                      passed ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {score}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Passing Score</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {quiz.passingMarks}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Result</p>
                  <p
                    className={`text-lg font-semibold ${
                      passed ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {passed ? 'Passed' : 'Failed'}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" asChild>
                <Link to="/student/quizzes">Back to Quizzes</Link>
              </Button>
              {!passed && (
                <Button
                  onClick={() => {
                    setIsSubmitted(false);
                    setSelectedAnswers({});
                    setCurrentQuestion(0);
                    setTimeLeft(quiz.duration * 60);
                  }}
                >
                  Retake Quiz
                </Button>
              )}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <Button variant="ghost" size="sm" asChild className="mb-2">
              <Link to="/student/quizzes">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Back to Quizzes
              </Link>
            </Button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{quiz.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">{quiz.courseTitle}</p>
          </div>
          <div className="flex items-center gap-4">
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                timeLeft < 60
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <Clock className="w-5 h-5" />
              <span className="font-mono font-medium">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestion + 1} of {quiz.questions.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {answeredCount} answered
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 lg:p-8 border border-gray-200 dark:border-gray-800 mb-6">
          <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(currentQ.id, index)}
                className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                  selectedAnswers[currentQ.id] === index
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      selectedAnswers[currentQ.id] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300 dark:border-gray-600'
                    }`}
                  >
                    {selectedAnswers[currentQ.id] === index && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <span className="text-gray-700 dark:text-gray-300">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>

          <div className="flex gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                  index === currentQuestion
                    ? 'bg-blue-600 text-white'
                    : selectedAnswers[quiz.questions[index].id] !== undefined
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestion < quiz.questions.length - 1 ? (
            <Button onClick={() => setCurrentQuestion((prev) => prev + 1)}>
              Next
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={answeredCount < quiz.questions.length}
              className="bg-gradient-to-r from-blue-600 to-purple-600"
            >
              Submit Quiz
            </Button>
          )}
        </div>

        {answeredCount < quiz.questions.length && currentQuestion === quiz.questions.length - 1 && (
          <Alert className="mt-4" variant="destructive">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription>
              You have answered {answeredCount} out of {quiz.questions.length} questions.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </DashboardLayout>
  );
}
