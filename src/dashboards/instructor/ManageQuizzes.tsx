import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, FileQuestion, Clock, CheckCircle, Eye } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

export function ManageQuizzes() {
  const [quizzes, setQuizzes] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentQuizId, setCurrentQuizId] = useState<string | null>(null);
  const [isFinalMode, setIsFinalMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    course: '',
    duration: 15,
    passingMarks: 70,
    questions: [] as any[],
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
  });

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('userToken');

      const [quizzesRes, finalsRes] = await Promise.all([
        fetch('http://localhost:5000/api/quizzes', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/final-assessments/all', {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (quizzesRes.ok && finalsRes.ok) {
        const quizzesData = await quizzesRes.json();
        const finalsData = await finalsRes.json();

        // Mark final ones so they show the 'Final' badge
        const markedFinals = finalsData.map((f: any) => ({ ...f, isFinalAssessment: true }));

        setQuizzes([...quizzesData, ...markedFinals]);
      }
    } catch (error) {
      console.error('Error fetching assessments:', error);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses/my-courses', {
        headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
      });
      if (response.ok) {
        const data = await response.json();
        setCourses(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ title: '', course: '', duration: 15, passingMarks: 70, questions: [] });
    setIsEditing(false);
    setCurrentQuizId(null);
    setIsFinalMode(false);
    setCreateDialogOpen(true);
  };

  const handleOpenEdit = (quiz: any) => {
    setFormData({
      title: quiz.title,
      course: quiz.course?._id || quiz.course,
      duration: quiz.duration,
      passingMarks: quiz.passingMarks,
      questions: quiz.questions || [],
    });
    setIsEditing(true);
    setCurrentQuizId(quiz._id);
    setIsFinalMode(!!quiz.isFinalAssessment);
    setCreateDialogOpen(true);
  };

  const handleDelete = async (id: string, isFinal: boolean) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      try {
        const url = isFinal
          ? `http://localhost:5000/api/final-assessments/${id}`
          : `http://localhost:5000/api/quizzes/${id}`;

        await fetch(url, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${localStorage.getItem('userToken')}` },
        });
        fetchQuizzes();
      } catch (error) {
        console.error('Error deleting assessment:', error);
      }
    }
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim() || currentQuestion.options.some((o) => !o.trim())) {
      alert('Please fill out all question fields and options.');
      return;
    }
    setFormData({
      ...formData,
      questions: [...formData.questions, currentQuestion],
    });
    setCurrentQuestion({ text: '', options: ['', '', '', ''], correctOptionIndex: 0 });
  };

  const removeQuestion = (index: number) => {
    const updated = [...formData.questions];
    updated.splice(index, 1);
    setFormData({ ...formData, questions: updated });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.course) {
      alert('Title and Course are required.');
      return;
    }
    try {
      let url;
      let method;

      if (isFinalMode) {
        url = 'http://localhost:5000/api/final-assessments';
        method = 'POST'; // createOrUpdate handler for finals
      } else {
        url = isEditing
          ? `http://localhost:5000/api/quizzes/${currentQuizId}`
          : 'http://localhost:5000/api/quizzes';
        method = isEditing ? 'PUT' : 'POST';
      }

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setCreateDialogOpen(false);
        fetchQuizzes();
      } else {
        const data = await response.json();
        alert(data.message || 'Error saving assessment');
      }
    } catch (error) {
      console.error('Error saving assessment:', error);
    }
  };

  const filteredQuizzes = quizzes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz.course?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <DashboardLayout userRole="instructor">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Manage Quizzes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage quizzes for your courses
            </p>
          </div>
          <Button
            className="bg-gradient-to-r from-purple-600 to-blue-600"
            onClick={handleOpenCreate}
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search quizzes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Quizzes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredQuizzes.map((quiz) => (
            <div
              key={quiz._id}
              className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                  <FileQuestion className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary">{quiz.questions?.length || 0} questions</Badge>
                  {quiz.isFinalAssessment && (
                    <Badge className="bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400">
                      Final
                    </Badge>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{quiz.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{quiz.course?.title || 'Unknown Course'}</p>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {quiz.duration} min
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" />
                  Pass: {quiz.passingMarks}%
                </span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(quiz)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(quiz._id, !!quiz.isFinalAssessment)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}

          {filteredQuizzes.length === 0 && (
            <div className="col-span-full py-12 text-center bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
              <FileQuestion className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">No quizzes found</h3>
              <p className="text-gray-500 mt-2">Create your first quiz to get started.</p>
            </div>
          )}
        </div>

        {/* Create/Edit Quiz Dialog */}
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{isEditing ? 'Edit Quiz' : 'Create New Quiz'}</DialogTitle>
              <DialogDescription>
                Fill in quiz details and add your questions.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Quiz Title
                  </label>
                  <Input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., JavaScript Basics"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Course
                  </label>
                  <select
                    value={formData.course}
                    onChange={e => setFormData({ ...formData, course: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a course</option>
                    {courses.map((course) => (
                      <option key={course._id} value={course._id}>
                        {course.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    value={formData.duration}
                    onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Passing Score (%)
                  </label>
                  <Input
                    type="number"
                    value={formData.passingMarks}
                    onChange={e => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
                  />
                </div>
              </div>

              {/* Questions Section */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Questions ({formData.questions.length})</h3>

                {/* Existing Questions */}
                {formData.questions.map((q, qIndex) => (
                  <div key={qIndex} className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl mb-4 relative">
                    <button
                      onClick={() => removeQuestion(qIndex)}
                      className="absolute top-4 right-4 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <p className="font-medium text-gray-900 dark:text-white pr-8">{qIndex + 1}. {q.text}</p>
                    <ul className="mt-2 space-y-1">
                      {q.options.map((opt: string, oIndex: number) => (
                        <li key={oIndex} className={`text-sm ${q.correctOptionIndex === oIndex ? 'text-green-600 font-medium' : 'text-gray-600 dark:text-gray-400'}`}>
                          • {opt} {q.correctOptionIndex === oIndex && '(Correct)'}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Add New Question Form */}
                <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-4 rounded-xl space-y-4">
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300">Add New Question</h4>

                  <Input
                    placeholder="Enter question text..."
                    value={currentQuestion.text}
                    onChange={(e) => setCurrentQuestion({ ...currentQuestion, text: e.target.value })}
                  />

                  <div className="space-y-2">
                    {currentQuestion.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="correctOption"
                          checked={currentQuestion.correctOptionIndex === index}
                          onChange={() => setCurrentQuestion({ ...currentQuestion, correctOptionIndex: index })}
                          className="mt-1"
                        />
                        <Input
                          placeholder={`Option ${index + 1}`}
                          value={option}
                          onChange={(e) => {
                            const newOptions = [...currentQuestion.options];
                            newOptions[index] = e.target.value;
                            setCurrentQuestion({ ...currentQuestion, options: newOptions });
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  <Button variant="secondary" onClick={addQuestion} className="w-full">
                    <Plus className="w-4 h-4 mr-2" /> Add Question to Quiz
                  </Button>
                </div>
              </div>
            </div>

            <DialogFooter className="sticky bottom-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md pt-2 py-4">
              <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600" onClick={handleSubmit}>
                {isEditing ? 'Save Changes' : 'Create Quiz'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}
