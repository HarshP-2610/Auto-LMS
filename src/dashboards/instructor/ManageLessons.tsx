import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  PlayCircle,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Loader2,
  Video,
  FileText,
  Layers,
  Clock,
  Trophy
} from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CreateLessonModal } from './CreateLessonModal';
import { CreateTopicModal } from './CreateTopicModal';
import { CreateAssessmentModal } from './CreateAssessmentModal';
import { HelpCircle } from 'lucide-react';

export function ManageLessons() {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [lessons, setLessons] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [loading, setLoading] = useState({ courses: true, lessons: false, topics: false });
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [isTopicModalOpen, setIsTopicModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [activeLessonId, setActiveLessonId] = useState<string | null>(null);
  const [topicsMap, setTopicsMap] = useState<Record<string, any[]>>({});
  const [quizzesMap, setQuizzesMap] = useState<Record<string, any[]>>({});
  const [editingLesson, setEditingLesson] = useState<any>(null);
  const [editingTopic, setEditingTopic] = useState<any>(null);
  const [editingQuiz, setEditingQuiz] = useState<any>(null);
  const [finalAssessment, setFinalAssessment] = useState<any>(null);
  const [isFinalQuizMode, setIsFinalQuizMode] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (selectedCourseId) {
      fetchLessons(selectedCourseId);
      fetchFinalAssessment(selectedCourseId);
    } else {
      setLessons([]);
      setFinalAssessment(null);
    }
  }, [selectedCourseId]);

  const fetchCourses = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses/my-courses', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
      const data = await response.json();
      if (response.ok) {
        setCoursesList(data.data);
        if (data.data.length > 0) {
          setSelectedCourseId(data.data[0]._id);
        }
      }
    } catch (error) {
      toast.error("Failed to load courses");
    } finally {
      setLoading(prev => ({ ...prev, courses: false }));
    }
  };

  const fetchLessons = async (courseId: string) => {
    setLoading(prev => ({ ...prev, lessons: true }));
    try {
      const response = await fetch(`http://localhost:5000/api/lessons/course/${courseId}`);
      const data = await response.json();
      if (response.ok) {
        setLessons(data.data);
      }
    } catch (error) {
      toast.error("Failed to load lessons");
    } finally {
      setLoading(prev => ({ ...prev, lessons: false }));
    }
  };

  const fetchFinalAssessment = async (courseId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/final-assessments?courseId=${courseId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
      const data = await response.json();
      if (response.ok && data) {
        setFinalAssessment(data);
      } else {
        setFinalAssessment(null);
      }
    } catch (error) {
      console.error("Failed to load final assessment", error);
    }
  };

  const fetchTopics = async (lessonId: string) => {
    setLoading(prev => ({ ...prev, topics: true }));
    try {
      const response = await fetch(`http://localhost:5000/api/topics/lesson/${lessonId}`);
      const data = await response.json();
      if (response.ok) {
        setTopicsMap(prev => ({ ...prev, [lessonId]: data.data }));
      }
    } catch (error) {
      toast.error("Failed to load topics");
    } finally {
      setLoading(prev => ({ ...prev, topics: false }));
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!window.confirm("Are you sure you want to delete this section? All topics inside will be deleted.")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/lessons/${lessonId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
      if (response.ok) {
        toast.success("Section deleted");
        fetchLessons(selectedCourseId);
      } else {
        toast.error("Failed to delete section");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleDeleteTopic = async (topicId: string, lessonId: string) => {
    if (!window.confirm("Delete this topic?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/topics/${topicId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
      if (response.ok) {
        toast.success("Topic removed");
        fetchTopics(lessonId);
      } else {
        toast.error("Failed to delete topic");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleEditLesson = (lesson: any) => {
    setEditingLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleEditTopic = (topic: any, lessonId: string) => {
    setActiveLessonId(lessonId);
    setEditingTopic(topic);
    setIsTopicModalOpen(true);
  };

  const handleExpandLesson = (lessonId: string) => {
    if (expandedLesson === lessonId) {
      setExpandedLesson(null);
    } else {
      setExpandedLesson(lessonId);
      fetchTopics(lessonId);
      fetchQuizzes(lessonId);
    }
  };

  const fetchQuizzes = async (lessonId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes?lessonId=${lessonId}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
      const data = await response.json();
      if (response.ok) {
        setQuizzesMap(prev => ({ ...prev, [lessonId]: data }));
      }
    } catch (error) {
      console.error("Failed to load quizzes", error);
    }
  };

  const handleDeleteQuiz = async (quizId: string, lessonId: string) => {
    if (!window.confirm("Delete this assessment?")) return;
    try {
      const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
      if (response.ok) {
        toast.success("Assessment removed");
        fetchQuizzes(lessonId);
      } else {
        toast.error("Failed to delete assessment");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleEditQuiz = (quiz: any, lessonId: string) => {
    setActiveLessonId(lessonId);
    setEditingQuiz(quiz);
    setIsQuizModalOpen(true);
  };

  const openAddQuiz = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setEditingQuiz(null);
    setIsFinalQuizMode(false);
    setIsQuizModalOpen(true);
  };

  const openFinalAssessment = () => {
    setActiveLessonId(null);
    setEditingQuiz(finalAssessment);
    setIsFinalQuizMode(true);
    setIsQuizModalOpen(true);
  };

  const openAddTopic = (lessonId: string) => {
    setActiveLessonId(lessonId);
    setEditingTopic(null);
    setIsTopicModalOpen(true);
  };

  const openAddLesson = () => {
    setEditingLesson(null);
    setIsLessonModalOpen(true);
  };

  const filteredLessons = lessons.filter((lesson) =>
    lesson.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedCourseData = coursesList.find(c => c._id === selectedCourseId);

  return (
    <DashboardLayout userRole="instructor">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              Manage Lessons
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Organize and manage your course content hierarchy
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={openFinalAssessment}
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl h-11 px-6 font-bold shadow-lg shadow-purple-500/20"
            >
              <Trophy className="w-4 h-4 mr-2" />
              {finalAssessment ? 'Edit Final Assessment' : 'Add Final Assessment'}
            </Button>
            <Button
              onClick={openAddLesson}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Lesson
            </Button>
          </div>
        </div>

        {/* Course Selector */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Select Course
          </label>
          <select
            value={selectedCourseId}
            onChange={(e) => setSelectedCourseId(e.target.value)}
            className="w-full md:w-96 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
          >
            {coursesList.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))}
          </select>
        </div>

        {/* Lessons */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {selectedCourseData?.title || 'Select a course'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {filteredLessons.length} lessons • {selectedCourseData?.duration || 0} total
                </p>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search lessons..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full md:w-64"
                />
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading.lessons ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
                <p className="text-gray-500">Fetching lessons...</p>
              </div>
            ) : filteredLessons.length > 0 ? (
              filteredLessons.map((lesson, index) => (
                <div key={lesson._id}>
                  <div className="flex items-center gap-4 p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group">
                    <div className="text-gray-400 cursor-move opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-5 h-5" />
                    </div>
                    <span className="text-gray-500 dark:text-gray-400 w-8 font-medium">#{index + 1}</span>
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 dark:group-hover:bg-indigo-900/50 transition-colors">
                      <Layers className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{lesson.title}</h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Lesson Section • {topicsMap[lesson._id]?.length || 0} topics
                      </p>
                    </div>
                    <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-400 dark:border-indigo-800">
                      Module
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs bg-white dark:bg-gray-800 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                        onClick={() => openAddTopic(lesson._id)}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Topic
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs bg-white dark:bg-gray-800 border-purple-200 text-purple-600 hover:bg-purple-50"
                        onClick={() => openAddQuiz(lesson._id)}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1" />
                        Assessment
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => handleEditLesson(lesson)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={() => handleDeleteLesson(lesson._id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <button
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
                        onClick={() => handleExpandLesson(lesson._id)}
                      >
                        {expandedLesson === lesson._id ? (
                          <ChevronUp className="w-5 h-5 text-gray-400" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-400" />
                        )}
                      </button>
                    </div>
                  </div>
                  {expandedLesson === lesson._id && (
                    <div className="px-4 pb-4 pl-12 bg-gray-50/50 dark:bg-gray-800/30">
                      <div className="border-l-2 border-indigo-100 dark:border-indigo-900/50 ml-4 pl-6 py-4 space-y-3">
                        {loading.topics ? (
                          <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Loading topics...
                          </div>
                        ) : topicsMap[lesson._id]?.length > 0 ? (
                          topicsMap[lesson._id].map((topic, tIdx) => (
                            <div key={topic._id} className="flex items-center gap-4 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-sm transition-all group/topic">
                              <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-xs font-bold text-blue-600">
                                {tIdx + 1}
                              </div>
                              <PlayCircle className="w-4 h-4 text-blue-500" />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{topic.title}</h4>
                                <div className="flex items-center gap-3 mt-0.5">
                                  <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {topic.duration}
                                  </span>
                                  <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                    <Video className="w-3 h-3" />
                                    Video Content
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 opacity-0 group-hover/topic:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleEditTopic(topic, lesson._id)}
                                >
                                  <Edit className="w-3 h-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                                  onClick={() => handleDeleteTopic(topic._id, lesson._id)}
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="py-6 text-center bg-white dark:bg-gray-900 rounded-xl border border-dashed border-gray-200 dark:border-gray-800">
                            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                            <p className="text-xs text-gray-500">No topics in this section yet.</p>
                            <Button
                              variant="link"
                              className="text-xs text-indigo-600 h-6 mt-1"
                              onClick={() => openAddTopic(lesson._id)}
                            >
                              Add your first topic
                            </Button>
                          </div>
                        )}

                        {/* Render Quizzes for this lesson */}
                        {quizzesMap[lesson._id]?.map((quiz) => (
                          <div key={quiz._id} className="flex items-center gap-4 p-3 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30 hover:shadow-sm transition-all group/quiz">
                            <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-xs font-bold text-purple-600">
                              QA
                            </div>
                            <HelpCircle className="w-4 h-4 text-purple-500" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">{quiz.title}</h4>
                              <div className="flex items-center gap-3 mt-0.5">
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {quiz.duration} mins
                                </span>
                                <span className="text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                  <HelpCircle className="w-3 h-3" />
                                  {quiz.questions?.length || 0} Questions
                                </span>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-0 group-hover/quiz:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleEditQuiz(quiz, lesson._id)}
                              >
                                <Edit className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-red-500 hover:text-red-600"
                                onClick={() => handleDeleteQuiz(quiz._id, lesson._id)}
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50/50 dark:bg-gray-800/20">
                <Layers className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No lessons found</h3>
                <p className="text-gray-500 max-w-[250px] mx-auto mt-1">Start by adding your first lesson section to this course.</p>
                <Button
                  variant="outline"
                  className="mt-6 border-indigo-200 text-indigo-600 hover:bg-indigo-50"
                  onClick={() => setIsLessonModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Lesson
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Create Lesson Modal */}
        <CreateLessonModal
          isOpen={isLessonModalOpen}
          onClose={() => setIsLessonModalOpen(false)}
          onSuccess={() => fetchLessons(selectedCourseId)}
          initialCourseId={selectedCourseId}
          editingLesson={editingLesson}
        />

        {/* Create Topic Modal */}
        <CreateTopicModal
          isOpen={isTopicModalOpen}
          onClose={() => setIsTopicModalOpen(false)}
          onSuccess={() => {
            if (activeLessonId) fetchTopics(activeLessonId);
          }}
          lessonId={activeLessonId || ''}
          lessonTitle={lessons.find((l: any) => l._id === activeLessonId)?.title || 'this section'}
          editingTopic={editingTopic}
        />

        {/* Create Assessment Modal */}
        <CreateAssessmentModal
          isOpen={isQuizModalOpen}
          onClose={() => setIsQuizModalOpen(false)}
          onSuccess={() => {
            if (isFinalQuizMode) {
              fetchFinalAssessment(selectedCourseId);
            } else if (activeLessonId) {
              fetchQuizzes(activeLessonId);
            }
          }}
          lessonId={activeLessonId || ''}
          courseId={selectedCourseId}
          lessonTitle={isFinalQuizMode ? (coursesList.find(c => c._id === selectedCourseId)?.title || 'Course') : (lessons.find((l: any) => l._id === activeLessonId)?.title || 'this section')}
          editingQuiz={editingQuiz}
          isFinalAssessment={isFinalQuizMode}
        />
      </div>
    </DashboardLayout>
  );
}
