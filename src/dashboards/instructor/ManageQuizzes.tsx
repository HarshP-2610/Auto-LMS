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
  const [previewDialogOpen, setPreviewDialogOpen] = useState(false);
  const [selectedQuizForPreview, setSelectedQuizForPreview] = useState<any>(null);
  const [editingQuestionIndex, setEditingQuestionIndex] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    course: '',
    duration: 15,
    passingMarks: 70,
    questions: [] as any[],
    isExtraQuiz: false,
    extraXP: 50,
  });

  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    options: ['', '', '', ''],
    correctOptionIndex: 0,
  });

  const fetchQuizzes = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const [quizzesRes, extraRes] = await Promise.all([
        fetch('http://localhost:5000/api/quizzes', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('http://localhost:5000/api/extra-quizzes', {
          headers: { Authorization: `Bearer ${token}` },
        })
      ]);

      if (quizzesRes.ok && extraRes.ok) {
        const extraQuizzes = await extraRes.json();
        setQuizzes(extraQuizzes.map((q: any) => ({ ...q, type: 'extra', isExtraQuiz: true })));
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
    setFormData({ title: '', course: '', duration: 15, passingMarks: 70, questions: [], isExtraQuiz: true, extraXP: 50 });
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
      isExtraQuiz: !!quiz.isExtraQuiz,
      extraXP: quiz.extraXP || 50,
    });
    setIsEditing(true);
    setCurrentQuizId(quiz._id);
    setIsFinalMode(!!quiz.isFinalAssessment);
    setCreateDialogOpen(true);
  };
  
  const handleOpenPreview = (quiz: any) => {
    setSelectedQuizForPreview(quiz);
    setPreviewDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this assessment?')) {
      try {
        const quizToDelete = quizzes.find(q => q._id === id);
        const endpoint = quizToDelete?.isExtraQuiz ? 'extra-quizzes' : 'quizzes';
        await fetch(`http://localhost:5000/api/${endpoint}/${id}`, {
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
    if (editingQuestionIndex !== null) {
      // Update existing question
      const updated = [...formData.questions];
      updated[editingQuestionIndex] = currentQuestion;
      setFormData({ ...formData, questions: updated });
      setEditingQuestionIndex(null);
    } else {
      // Add new question
      setFormData({
        ...formData,
        questions: [...formData.questions, currentQuestion],
      });
    }
    setCurrentQuestion({ text: '', options: ['', '', '', ''], correctOptionIndex: 0 });
  };

  const startEditQuestion = (index: number) => {
    const q = formData.questions[index];
    setCurrentQuestion({
      text: q.text,
      options: [...q.options],
      correctOptionIndex: q.correctOptionIndex,
    });
    setEditingQuestionIndex(index);
  };

  const cancelEditQuestion = () => {
    setEditingQuestionIndex(null);
    setCurrentQuestion({ text: '', options: ['', '', '', ''], correctOptionIndex: 0 });
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.course) {
      alert('Title and Course are required.');
      return;
    }
    try {
      const endpoint = formData.isExtraQuiz ? 'extra-quizzes' : 'quizzes';
      const url = isEditing
        ? `http://localhost:5000/api/${endpoint}/${currentQuizId}`
        : `http://localhost:5000/api/${endpoint}`;
      const method = isEditing ? 'PUT' : 'POST';

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
              Create and manage bonus extra quizzes for your students
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
                  {quiz.isExtraQuiz && <Badge className="bg-amber-500">Extra Quiz</Badge>}
                  <Badge variant="secondary">{quiz.questions?.length || 0} questions</Badge>
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
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleOpenPreview(quiz)}>
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleOpenEdit(quiz)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-red-600" onClick={() => handleDelete(quiz._id)}>
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

              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 pt-6">
                  <input
                    type="checkbox"
                    id="isExtraQuiz"
                    checked={formData.isExtraQuiz}
                    onChange={e => setFormData({ ...formData, isExtraQuiz: e.target.checked })}
                    className="w-4 h-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label htmlFor="isExtraQuiz" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Mark as Extra Quiz
                  </label>
                </div>
                {formData.isExtraQuiz && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Extra XP Bonus
                    </label>
                    <Input
                      type="number"
                      value={formData.extraXP}
                      onChange={e => setFormData({ ...formData, extraXP: Number(e.target.value) })}
                    />
                  </div>
                )}
              </div>

              {/* Questions Section */}
              <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Quiz Questions ({formData.questions.length})</h3>

                {/* Existing Questions */}
                {formData.questions.map((q, qIndex) => (
                  <div key={qIndex} className={`bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl mb-4 relative ${editingQuestionIndex === qIndex ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20' : ''}`}>
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <button
                        onClick={() => startEditQuestion(qIndex)}
                        className="text-blue-500 hover:text-blue-600 transition-colors"
                        title="Edit question"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (editingQuestionIndex === qIndex) cancelEditQuestion();
                          const updated = [...formData.questions];
                          updated.splice(qIndex, 1);
                          setFormData({ ...formData, questions: updated });
                        }}
                        className="text-red-500 hover:text-red-600 transition-colors"
                        title="Delete question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="font-medium text-gray-900 dark:text-white pr-16">{qIndex + 1}. {q.text}</p>
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
                <div className={`border ${editingQuestionIndex !== null ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-900/10' : 'border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900'} p-4 rounded-xl space-y-4`}>
                  <h4 className="font-medium text-sm text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    {editingQuestionIndex !== null ? (
                      <><Edit className="w-4 h-4 text-blue-500" /> Editing Question {editingQuestionIndex + 1}</>
                    ) : (
                      'Add New Question'
                    )}
                  </h4>

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

                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={addQuestion} className="flex-1">
                      {editingQuestionIndex !== null ? (
                        <><CheckCircle className="w-4 h-4 mr-2" /> Update Question</>
                      ) : (
                        <><Plus className="w-4 h-4 mr-2" /> Add Question to Quiz</>
                      )}
                    </Button>
                    {editingQuestionIndex !== null && (
                      <Button variant="outline" onClick={cancelEditQuestion}>
                        Cancel
                      </Button>
                    )}
                  </div>
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
        
        {/* Preview Quiz Dialog - Redesigned for Premium Look */}
        <Dialog open={previewDialogOpen} onOpenChange={setPreviewDialogOpen}>
          <DialogContent className="max-w-[95vw] lg:max-w-6xl h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl bg-white dark:bg-gray-950 [&>button]:text-white [&>button]:top-6 [&>button]:right-6 [&>button]:opacity-80 [&>button:hover]:opacity-100 [&>button]:bg-black/20 [&>button:hover]:bg-black/40 [&>button]:p-2 round-full transition-all">
            {/* Premium Header */}
            <div className="flex-none relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 px-6 py-6 lg:px-8 lg:py-8 text-white">
              {/* Decorative Blur Orbs */}
              <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-white/10 blur-[100px] rounded-full pointer-events-none" />
              <div className="absolute bottom-[-50%] left-[-10%] w-[50%] h-[150%] bg-indigo-900/40 blur-[100px] rounded-full pointer-events-none" />
              
              <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                <div className="space-y-2 flex-1">
                  <Badge className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-md px-3 py-1 text-xs uppercase tracking-widest shadow-sm">
                    {selectedQuizForPreview?.isExtraQuiz ? '★ Bonus Experience Quiz' : 'Standard Assessment'}
                  </Badge>
                  <h2 className="text-xl md:text-2xl font-bold tracking-tight leading-tight text-white drop-shadow-md">
                    {selectedQuizForPreview?.title}
                  </h2>
                  <p className="text-purple-100 flex items-center gap-2 text-sm font-medium opacity-90 drop-shadow-sm">
                    <span>{selectedQuizForPreview?.course?.title}</span>
                    <span className="opacity-50">•</span>
                    <span>Instructed by {selectedQuizForPreview?.instructor?.name || 'You'}</span>
                  </p>
                </div>
                
                <div className="flex gap-3 shrink-0">
                  <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-3 min-w-[100px] flex flex-col items-center justify-center shadow-inner">
                    <p className="text-purple-200 text-[10px] font-bold uppercase tracking-widest mb-0.5">Time Limit</p>
                    <p className="text-xl font-black drop-shadow-sm">{selectedQuizForPreview?.duration}<span className="text-xs font-medium ml-1">min</span></p>
                  </div>
                  <div className="bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl p-3 min-w-[100px] flex flex-col items-center justify-center shadow-inner">
                    <p className="text-purple-200 text-[10px] font-bold uppercase tracking-widest mb-0.5">Pass Score</p>
                    <p className="text-xl font-black drop-shadow-sm">{selectedQuizForPreview?.passingMarks}<span className="text-xs font-medium ml-1">%</span></p>
                  </div>
                </div>
              </div>
            </div>

              {/* Main Scrollable Content */}
              <div className="flex-1 overflow-y-auto min-h-0 bg-gray-50/80 dark:bg-gray-950/50 p-5 md:p-8 lg:p-10">
                <div className="max-w-4xl mx-auto space-y-6">
                  <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                        <FileQuestion className="w-3 h-3" />
                      </div>
                      Content Outline ({selectedQuizForPreview?.questions?.length || 0} Questions)
                    </h3>
                  </div>

                  <div className="grid gap-5">
                    {selectedQuizForPreview?.questions?.map((q: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="group bg-white dark:bg-gray-900 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 border border-gray-100 dark:border-gray-800"
                      >
                        <div className="flex flex-col lg:flex-row gap-4">
                          <div className="flex-shrink-0 flex items-start">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 text-white rounded-xl flex items-center justify-center font-bold text-sm shadow-md shadow-indigo-500/20">
                              {idx + 1}
                            </div>
                          </div>
                          
                          <div className="flex-1 space-y-4">
                            <h4 className="text-sm md:text-base font-semibold text-gray-800 dark:text-gray-100 leading-snug tracking-tight">
                              {q.text}
                            </h4>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {q.options.map((opt: string, optIdx: number) => {
                                const isCorrect = q.correctOptionIndex === optIdx;
                                return (
                                  <div 
                                    key={optIdx} 
                                    className={`relative px-4 py-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-between ${
                                      isCorrect 
                                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-sm shadow-emerald-500/10' 
                                        : 'border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900'
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold transition-colors ${
                                        isCorrect 
                                          ? 'bg-emerald-500 text-white' 
                                          : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                                      }`}>
                                        {String.fromCharCode(65 + optIdx)}
                                      </span>
                                      <span className={`text-sm font-medium leading-tight ${isCorrect ? 'text-emerald-800 dark:text-emerald-300 font-semibold' : 'text-gray-600 dark:text-gray-300'}`}>
                                        {opt}
                                      </span>
                                    </div>
                                    
                                    {isCorrect && (
                                      <div className="flex items-center bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ml-3 shrink-0">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Correct
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Footer */}
              <div className="flex-none px-6 py-4 lg:px-8 bg-white dark:bg-gray-950 border-t border-gray-100 dark:border-gray-800 flex flex-col-reverse sm:flex-row justify-end items-center gap-3 shadow-[0_-10px_40px_rgba(0,0,0,0.03)] dark:shadow-none z-20">
                <Button 
                  variant="outline"
                  className="w-full sm:w-auto px-5 py-2 text-sm font-medium rounded-xl text-gray-600 hover:bg-gray-50 border-gray-200" 
                  onClick={() => setPreviewDialogOpen(false)}
                >
                  Return to Quizzes
                </Button>
                <Button 
                  className="w-full sm:w-auto px-6 py-2 text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20" 
                  onClick={() => {
                    setPreviewDialogOpen(false);
                    handleOpenEdit(selectedQuizForPreview);
                  }}
                >
                  <Edit className="w-4 h-4 mr-1.5" />
                  Edit Quiz
                </Button>
              </div>
          </DialogContent>
        </Dialog>

      </div>
    </DashboardLayout>
  );
}

