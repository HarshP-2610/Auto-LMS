import { useState, useEffect } from 'react';
import { Search, SlidersHorizontal, X, Loader2, Filter, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CourseCard } from '@/components/common/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { categories } from '@/data/mockData';

export function Courses() {
  const [coursesList, setCoursesList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLevel, setSelectedLevel] = useState<string[]>([]);
  const [selectedPrice, setSelectedPrice] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const levels = ['Beginner', 'Intermediate', 'Advanced'];
  const priceRanges = [
    { id: 'free', label: 'Free' },
    { id: 'under50', label: 'Under $50' },
    { id: '50to100', label: '$50 - $100' },
    { id: 'over100', label: 'Over $100' },
  ];

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/courses');
      const data = await response.json();
      if (response.ok) {
        // Map database fields to what the UI expects
        const mappedCourses = data.data.map((course: any) => ({
          ...course,
          id: course._id,
          level: course.difficulty,
          thumbnail: course.thumbnail === 'no-image.jpg'
            ? 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=60'
            : (course.thumbnail.startsWith('http') ? course.thumbnail : `http://localhost:5000/uploads/${course.thumbnail}`)
        }));
        setCoursesList(mappedCourses);
      } else {
        toast.error(data.message || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      toast.error('Network error. Failed to load courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Filter courses locally for search/category/etc.
  const filteredCourses = coursesList.filter((course) => {
    // Search filter
    if (
      searchQuery &&
      !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !course.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && course.category?.toLowerCase() !== selectedCategory) {
      return false;
    }

    // Level filter
    if (selectedLevel.length > 0 && !selectedLevel.includes(course.level || '')) {
      return false;
    }

    // Price filter
    if (selectedPrice.length > 0) {
      const price = course.price || 0;
      const matchesPrice = selectedPrice.some((range) => {
        switch (range) {
          case 'free':
            return price === 0;
          case 'under50':
            return price > 0 && price < 50;
          case '50to100':
            return price >= 50 && price <= 100;
          case 'over100':
            return price > 100;
          default:
            return false;
        }
      });
      if (!matchesPrice) return false;
    }

    return true;
  });

  const toggleLevel = (level: string) => {
    setSelectedLevel((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const togglePrice = (price: string) => {
    setSelectedPrice((prev) =>
      prev.includes(price) ? prev.filter((p) => p !== price) : [...prev, price]
    );
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedLevel([]);
    setSelectedPrice([]);
    setSearchQuery('');
  };

  const activeFiltersCount =
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedLevel.length +
    selectedPrice.length +
    (searchQuery ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0A0F1C] transition-colors duration-300">
      <Navbar />

      {/* Simple Header */}
      <div className="pt-32 pb-8 bg-[#F8FAFC] dark:bg-[#0A0F1C] border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Explore Courses
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2 font-medium">
                Discover {coursesList.length || 0}+ courses to boost your skills
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md w-full group">
              <div className="absolute inset-0 bg-blue-500/5 rounded-2xl blur-lg transition duration-300 group-hover:bg-blue-500/10"></div>
              <div className="relative flex items-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                <div className="pl-4 pr-2">
                  <Search className="w-5 h-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <Input
                  type="text"
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="border-0 bg-transparent py-6 focus-visible:ring-0 text-base h-14 w-full"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full h-14 rounded-2xl bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800 shadow-sm"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filter Courses
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-blue-600 text-white border-0 shadow-md">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Sidebar Filters */}
          <aside
            className={`lg:w-72 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 border border-gray-200/50 dark:border-gray-800/50 shadow-xl shadow-gray-200/20 dark:shadow-black/20 sticky top-28">
              <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800/50">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-600 dark:text-blue-400">
                    <SlidersHorizontal className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Filters</h3>
                </div>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <Accordion type="multiple" defaultValue={['category', 'level', 'price']} className="space-y-6">
                {/* Category Filter */}
                <AccordionItem value="category" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-2 text-base font-semibold text-gray-900 dark:text-gray-100 data-[state=open]:text-blue-600 dark:data-[state=open]:text-blue-400 transition-colors">
                    Category
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-1">
                      {categories.map((category) => {
                        const count = category.id === 'all'
                          ? coursesList.length
                          : coursesList.filter(c => c.category?.toLowerCase() === category.id).length;

                        const isSelected = selectedCategory === category.id;

                        return (
                          <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={`w-full group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${isSelected
                              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800/60 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                              }`}
                          >
                            <span>{category.name}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${isSelected
                              ? 'bg-white/20 text-white'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
                              }`}>
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Level Filter */}
                <AccordionItem value="level" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-2 text-base font-semibold text-gray-900 dark:text-gray-100 data-[state=open]:text-blue-600 dark:data-[state=open]:text-blue-400 transition-colors">
                    Level
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-2">
                      {levels.map((level) => (
                        <label
                          key={level}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer group transition-colors"
                        >
                          <div className={`flex items-center justify-center w-5 h-5 rounded border ${selectedLevel.includes(level)
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-gray-300 dark:border-gray-600 bg-transparent group-hover:border-blue-400'
                            } transition-colors`}>
                            {selectedLevel.includes(level) && <X className="w-3 h-3" />}
                          </div>
                          <span className={`${selectedLevel.includes(level)
                            ? 'text-gray-900 dark:text-white font-medium'
                            : 'text-gray-600 dark:text-gray-400'
                            }`}>
                            {level}
                          </span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Price Filter */}
                <AccordionItem value="price" className="border-none">
                  <AccordionTrigger className="hover:no-underline py-2 text-base font-semibold text-gray-900 dark:text-gray-100 data-[state=open]:text-blue-600 dark:data-[state=open]:text-blue-400 transition-colors">
                    Price Range
                  </AccordionTrigger>
                  <AccordionContent className="pt-4 pb-2">
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label
                          key={range.id}
                          className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/60 cursor-pointer group transition-colors"
                        >
                          <div className={`flex items-center justify-center w-5 h-5 rounded border ${selectedPrice.includes(range.id)
                            ? 'bg-blue-600 border-blue-600 text-white'
                            : 'border-gray-300 dark:border-gray-600 bg-transparent group-hover:border-blue-400'
                            } transition-colors`}>
                            {selectedPrice.includes(range.id) && <X className="w-3 h-3" />}
                          </div>
                          <span className={`${selectedPrice.includes(range.id)
                            ? 'text-gray-900 dark:text-white font-medium'
                            : 'text-gray-600 dark:text-gray-400'
                            }`}>
                            {range.label}
                          </span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </aside>

          {/* Course Grid */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="bg-white/50 dark:bg-gray-900/50 backdrop-blur-md rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border border-gray-200/50 dark:border-gray-800/50">
              <p className="text-gray-600 dark:text-gray-400 font-medium">
                Showing{' '}
                <span className="font-bold text-gray-900 dark:text-white bg-blue-100 dark:bg-blue-900/30 px-2 py-0.5 rounded-md">
                  {filteredCourses.length}
                </span>{' '}
                outstanding courses
              </p>
            </div>

            {/* Active Filters Tokens */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {selectedCategory !== 'all' && (
                  <Badge className="bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 dark:text-blue-300 border border-blue-200 dark:border-blue-800 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                    <span className="font-medium">{categories.find((c) => c.id === selectedCategory)?.name}</span>
                    <button onClick={() => setSelectedCategory('all')} className="hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                )}
                {selectedLevel.map((level) => (
                  <Badge key={level} className="bg-purple-50 hover:bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 dark:text-purple-300 border border-purple-200 dark:border-purple-800 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                    <span className="font-medium">{level}</span>
                    <button onClick={() => toggleLevel(level)} className="hover:bg-purple-200 dark:hover:bg-purple-800 rounded-full p-0.5 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
                {selectedPrice.map((price) => (
                  <Badge key={price} className="bg-green-50 hover:bg-green-100 text-green-700 dark:bg-green-900/30 dark:hover:bg-green-900/50 dark:text-green-300 border border-green-200 dark:border-green-800 px-3 py-1.5 rounded-lg flex items-center gap-2 transition-colors">
                    <span className="font-medium">{priceRanges.find((r) => r.id === price)?.label}</span>
                    <button onClick={() => togglePrice(price)} className="hover:bg-green-200 dark:hover:bg-green-800 rounded-full p-0.5 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Courses Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32 bg-white/40 dark:bg-gray-900/40 rounded-3xl backdrop-blur-sm border border-gray-100 dark:border-gray-800/50">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-6" />
                <p className="text-lg font-medium text-gray-600 dark:text-gray-300">Curating the finest courses for you...</p>
              </div>
            ) : filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredCourses.map((course, idx) => (
                  <div key={course._id || course.id} className="animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${idx * 100}ms`, animationFillMode: 'both' }}>
                    <CourseCard course={course} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white/40 dark:bg-gray-900/40 rounded-3xl backdrop-blur-sm border border-gray-100 dark:border-gray-800/50 shadow-sm">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  No matches found
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-md mx-auto text-lg">
                  We couldn't find any courses matching your specific criteria. Try adjusting your filters.
                </p>
                <Button onClick={clearFilters} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-8 h-12 font-medium shadow-lg hover:shadow-xl transition-all">
                  Clear All Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="mt-20 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 sm:px-6 lg:px-8 py-20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6">
            <BookOpen className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Never Stop Learning
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
            Subscribe to our newsletter and get the latest updates on new courses, special offers, and learning resources directly to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <Input
              type="email"
              placeholder="Enter your email address"
              className="h-14 rounded-2xl border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus-visible:ring-blue-500 text-base"
            />
            <Button className="h-14 rounded-2xl px-8 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 dark:text-gray-900 text-white font-semibold">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

