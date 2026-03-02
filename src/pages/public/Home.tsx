import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Play,
  Star,
  Users,
  BookOpen,
  Award,
  Search,
  Clock,
  Brain,
  CheckCircle,
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CourseCard } from '@/components/common/CourseCard';
import { Button } from '@/components/ui/button';
import { testimonials, howItWorks } from '@/data/mockData';

// Hero Section
function Hero() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950 pt-24 pb-16">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -right-[10%] w-[50%] h-[50%] rounded-full bg-violet-500/10 dark:bg-violet-500/20 blur-[120px]" />
        <div className="absolute top-[20%] -left-[10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 dark:bg-blue-500/20 blur-[100px]" />
        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 dark:bg-indigo-500/20 blur-[100px]" />

        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] dark:[mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#fff_70%,transparent_100%)]" />
      </div>

      <div className="container relative z-10 mx-auto px-6 max-w-[1280px]">
        <div className="flex flex-col items-center justify-center text-center">

          {/* Top Badge */}
          <div
            className={`inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full bg-neutral-100 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700/50 backdrop-blur-sm transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '100ms' }}
          >
            <span className="flex rounded-full bg-violet-500 p-1">
              <Star className="w-3 h-3 text-white fill-current" />
            </span>
            <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
              Trusted by 10,000+ students worldwide
            </span>
          </div>

          {/* Main Headline */}
          <h1
            className={`max-w-4xl text-5xl md:text-7xl lg:text-[5.5rem] font-bold tracking-tight text-neutral-900 dark:text-white transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '200ms' }}
          >
            Learn Without <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-500">Limits</span>
          </h1>

          {/* Subheading */}
          <p
            className={`max-w-2xl mt-6 text-lg md:text-xl text-neutral-600 dark:text-neutral-400 transition-all duration-700 ease-out leading-relaxed ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '300ms' }}
          >
            Access world-class courses from expert instructors. Learn at your own pace and earn industry-recognized certificates to accelerate your career.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-col sm:flex-row items-center gap-4 mt-10 transition-all duration-700 ease-out ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
            style={{ transitionDelay: '400ms' }}
          >
            <Button className="flex items-center justify-center gap-2 h-14 px-8 text-white bg-neutral-900 dark:bg-white dark:text-neutral-900 rounded-full font-medium text-base hover:scale-105 transition-transform duration-300 shadow-[0_0_40px_-10px_rgba(0,0,0,0.3)] dark:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]" asChild>
              <Link to="/courses">
                Explore Courses
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
            <Button variant="outline" className="flex items-center justify-center gap-2 h-14 px-8 text-neutral-900 dark:text-white bg-white dark:bg-neutral-800/50 rounded-full font-medium text-base border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-300">
              <Play className="w-4 h-4 text-violet-500 fill-current" />
              Watch Demo
            </Button>
          </div>

          {/* Stats Bar */}
          <div
            className={`grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-16 mt-20 pt-10 border-t border-neutral-200 dark:border-neutral-800/60 transition-all duration-700 ease-out w-full max-w-4xl ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            style={{ transitionDelay: '500ms' }}
          >
            {[
              { label: 'Courses', value: '850+' },
              { label: 'Students', value: '12K+' },
              { label: 'Instructors', value: '320+' }
            ].map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-3xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-neutral-900 to-neutral-500 dark:from-white dark:to-neutral-400">
                  {stat.value}
                </span>
                <span className="mt-2 text-sm font-medium text-neutral-500 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}

// Featured Courses Section
function FeaturedCourses() {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/courses/popular');
        const data = await res.json();
        if (data.success) {
          setFeaturedCourses(data.data);
        }
      } catch (err) {
        console.error('Error fetching popular courses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  if (loading && featuredCourses.length === 0) {
    return (
      <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-pulse flex flex-col items-center">
            <div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded mb-4" />
            <div className="h-8 w-64 bg-gray-200 dark:bg-gray-800 rounded mb-12" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
              {[1, 2, 3].map(i => (
                <div key={i} className="aspect-[16/10] bg-gray-200 dark:bg-gray-800 rounded-3xl" />
              ))}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12">
          <div className="relative">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 rounded-full">
              Featured Courses
            </span>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white mt-6 tracking-tight">
              Most Popular <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Courses</span>
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-6 max-w-xl text-lg leading-relaxed">
              Start your learning journey with our most enrolled courses. Handpicked by our
              experts for maximum impact.
            </p>
          </div>
          <Button variant="outline" className="mt-8 md:mt-0 px-8 h-12 rounded-full border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 transition-all font-semibold" asChild>
            <Link to="/courses">
              View All Courses
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative">
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
          {featuredCourses.map((course) => (
            <CourseCard key={course?._id || course?.id} course={{
              ...course,
              id: course?._id || course?.id,
              thumbnail: course?.thumbnail?.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course?.thumbnail || 'no-image.jpg'}`
            }} variant="premium" />
          ))}
        </div>
      </div>
    </section>
  );
}

// How It Works Section
function HowItWorks() {
  const iconMap: Record<string, React.ElementType> = {
    Search,
    Clock,
    Brain,
    Award,
  };

  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            How It Works
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-2">
            Start Learning in 4 Easy Steps
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-4 max-w-2xl mx-auto">
            Our platform is designed to make learning easy and accessible. Follow these simple
            steps to begin your journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {howItWorks.map((step, index) => {
            const Icon = iconMap[step.icon];
            return (
              <div
                key={step.id}
                className="relative p-8 rounded-2xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
              >
                <div className="absolute -top-4 -left-4 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  {index + 1}
                </div>
                <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                  <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// Features Section
function Features() {
  const features = [
    {
      icon: BookOpen,
      title: 'Expert-Led Courses',
      description: 'Learn from industry professionals with years of real-world experience.',
    },
    {
      icon: Users,
      title: 'Community Learning',
      description: 'Join a community of learners and collaborate on projects together.',
    },
    {
      icon: Award,
      title: 'Recognized Certificates',
      description: 'Earn certificates that are recognized by top companies worldwide.',
    },
    {
      icon: Clock,
      title: 'Lifetime Access',
      description: 'Get lifetime access to course materials and future updates.',
    },
  ];

  return (
    <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Why Choose Us
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-6">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              Our platform provides all the tools and resources you need to achieve your learning
              goals. From expert instructors to interactive quizzes, we have got you covered.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800"
              alt="Learning"
              className="rounded-2xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Testimonials Section
function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            Testimonials
          </span>
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-2">
            What Our Students Say
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="w-full flex-shrink-0 px-4">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 lg:p-12 text-center">
                    <div className="flex justify-center gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <blockquote className="text-xl lg:text-2xl text-gray-700 dark:text-gray-300 mb-8 italic">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div className="flex items-center justify-center gap-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.author}
                        className="w-14 h-14 rounded-full object-cover"
                      />
                      <div className="text-left">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {testimonial.author}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {testimonial.role} at {testimonial.company}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex
                  ? 'bg-blue-600'
                  : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400'
                  }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Main Home Component
export function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />
      <main>
        <Hero />
        <FeaturedCourses />
        <HowItWorks />
        <Features />
        <TestimonialsSection />
      </main>
      <Footer />
    </div>
  );
}
