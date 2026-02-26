import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star,
  Users,
  PlayCircle,
  CheckCircle,
  Award,
  Globe,
  ChevronDown,
  ChevronUp,
  Share2,
  Heart,
  Loader2,
  Play,
  Clock,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { courses } from '@/data/mockData';

function TopicList({ lessonId }: { lessonId: string }) {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/topics/lesson/${lessonId}`);
        const data = await response.json();
        if (response.ok) {
          setTopics(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch topics');
      } finally {
        setLoading(false);
      }
    };
    fetchTopics();
  }, [lessonId]);

  if (loading) return <div className="text-xs text-gray-400 py-2">Loading content...</div>;
  if (topics.length === 0) return <div className="text-xs text-gray-400 py-2 italic text-center border border-dashed rounded-lg">Coming Soon</div>;

  return (
    <div className="space-y-2">
      {topics.map((topic, idx) => (
        <div key={topic._id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white dark:hover:bg-gray-800 transition-all border border-transparent hover:border-gray-200 dark:hover:border-gray-700 group/topic">
          <div className="w-6 h-6 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-[10px] font-bold text-blue-600">
            {idx + 1}
          </div>
          <Play className="w-3.5 h-3.5 text-blue-500 opacity-60 group-hover/topic:opacity-100" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-700 dark:text-gray-300 truncate font-medium">{topic.title}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            {topic.duration}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CourseDetails() {
  const { id } = useParams<{ id: string }>();
  const [course, setCourse] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchCourse();
    fetchLessons();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${id}`);
      const data = await response.json();
      if (response.ok) {
        setCourse(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch course');
    }
  };

  const fetchLessons = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/lessons/course/${id}`);
      const data = await response.json();
      if (response.ok) {
        setLessons(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch lessons');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Course Not Found
          </h1>
          <Button asChild>
            <Link to="/courses">Browse Courses</Link>
          </Button>
        </div>
      </div>
    );
  }

  const toggleLesson = (lessonId: string) => {
    setExpandedLesson(expandedLesson === lessonId ? null : lessonId);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Hero Section */}
      <div className="pt-24 lg:pt-28 pb-12 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content */}
            <div className="lg:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <Badge className="bg-blue-600">{course.category}</Badge>
                <Badge variant="outline" className="text-white border-white/30">
                  {course.level}
                </Badge>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">{course.title}</h1>

              <p className="text-gray-300 text-lg mb-6">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center gap-1">
                  <span className="text-yellow-400 font-bold">{course.rating}</span>
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(course.rating || 0)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-600'
                          }`}
                      />
                    ))}
                  </div>
                  <span className="text-gray-400">({course.reviewCount} reviews)</span>
                </div>
                <span className="text-gray-500">|</span>
                <span className="text-gray-300">{course.enrolledStudents?.toLocaleString()} students</span>
              </div>

              <div className="flex items-center gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm text-gray-400">Created by</p>
                  <p className="text-white font-medium">{course.instructor.name}</p>
                </div>
              </div>
            </div>

            {/* Right Card */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl">
                <div className="relative aspect-video">
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <button className="w-16 h-16 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                      <PlayCircle className="w-8 h-8 text-gray-900" />
                    </button>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">
                      ${course.price}
                    </span>
                    {course.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        ${course.originalPrice}
                      </span>
                    )}
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 mb-3"
                  >
                    Enroll Now
                  </Button>

                  <Button variant="outline" size="lg" className="w-full mb-4">
                    Start Free Preview
                  </Button>

                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                    30-Day Money-Back Guarantee
                  </p>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="flex-1"
                      onClick={() => setIsWishlisted(!isWishlisted)}
                    >
                      <Heart
                        className={`w-5 h-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''
                          }`}
                      />
                    </Button>
                    <Button variant="outline" size="icon" className="flex-1">
                      <Share2 className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      This course includes:
                    </h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <PlayCircle className="w-4 h-4" />
                        {course.duration} on-demand video
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <CheckCircle className="w-4 h-4" />
                        {course.lessonsCount} lessons
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Globe className="w-4 h-4" />
                        Full lifetime access
                      </li>
                      <li className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                        <Award className="w-4 h-4" />
                        Certificate of completion
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* What You'll Learn */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                What you will learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.skills?.map((tag: string) => (
                  <div key={tag} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">Master {tag}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Course Content */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Course Content
              </h2>
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {lessons.length} sections • {' '}
                      {course.duration} total
                    </span>
                  </div>
                </div>
                <div>
                  {lessons.map((lesson: any, index: number) => (
                    <div
                      key={lesson._id}
                      className="border-b border-gray-200 dark:border-gray-700 last:border-b-0"
                    >
                      <button
                        onClick={() => toggleLesson(lesson._id)}
                        className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-gray-400 text-sm">{index + 1}</span>
                          <PlayCircle className="w-5 h-5 text-gray-400" />
                          <span className="text-gray-900 dark:text-white text-left font-medium">
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          {expandedLesson === lesson._id ? (
                            <ChevronUp className="w-5 h-5 text-gray-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-gray-400" />
                          )}
                        </div>
                      </button>
                      {expandedLesson === lesson._id && (
                        <div className="px-4 pb-4 pl-12 bg-gray-50/50 dark:bg-gray-800/20 py-4">
                          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed mb-4">
                            {lesson.description || `This section covers ${lesson.title}.`}
                          </p>
                          <TopicList lessonId={lesson._id} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Instructor
              </h2>
              <div className="flex items-start gap-4">
                <img
                  src={course.instructor.avatar}
                  alt={course.instructor.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {course.instructor.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    {course.instructor.bio}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      4.8 Instructor Rating
                    </div>
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      15,420 Students
                    </div>
                    <div className="flex items-center gap-1">
                      <PlayCircle className="w-4 h-4" />
                      12 Courses
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              {/* Related Courses */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  Similar Courses
                </h3>
                <div className="space-y-4">
                  {courses
                    .filter((c) => c.id !== course.id && c.category === course.category)
                    .slice(0, 3)
                    .map((relatedCourse) => (
                      <Link
                        key={relatedCourse.id}
                        to={`/courses/${relatedCourse.id}`}
                        className="flex gap-3 group"
                      >
                        <img
                          src={relatedCourse.thumbnail}
                          alt={relatedCourse.title}
                          className="w-20 h-14 object-cover rounded-lg"
                        />
                        <div>
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 line-clamp-2">
                            {relatedCourse.title}
                          </h4>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {relatedCourse.rating}
                            </span>
                          </div>
                          <p className="text-sm font-semibold text-gray-900 dark:text-white mt-1">
                            ${relatedCourse.price}
                          </p>
                        </div>
                      </Link>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
