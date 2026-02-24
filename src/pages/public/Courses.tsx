import { useState } from 'react';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CourseCard } from '@/components/common/CourseCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { courses, categories } from '@/data/mockData';

export function Courses() {
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

  // Filter courses
  const filteredCourses = courses.filter((course) => {
    // Search filter
    if (
      searchQuery &&
      !course.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !course.description.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    // Category filter
    if (selectedCategory !== 'all' && course.category.toLowerCase() !== selectedCategory) {
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Navbar />

      {/* Header */}
      <div className="pt-24 lg:pt-28 pb-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
                Explore Courses
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Discover {courses.length}+ courses to boost your skills
              </p>
            </div>

            {/* Search */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 py-6"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="w-full"
            >
              <SlidersHorizontal className="w-4 h-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Sidebar Filters */}
          <aside
            className={`lg:w-64 flex-shrink-0 ${
              showFilters ? 'block' : 'hidden lg:block'
            }`}
          >
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 sticky top-28">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900 dark:text-white">Filters</h3>
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400"
                  >
                    Clear all
                  </button>
                )}
              </div>

              <Accordion type="multiple" defaultValue={['category', 'level', 'price']}>
                {/* Category Filter */}
                <AccordionItem value="category">
                  <AccordionTrigger className="text-sm font-medium">
                    Category
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedCategory(category.id)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                            selectedCategory === category.id
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                          }`}
                        >
                          <span>{category.name}</span>
                          <span className="text-gray-400 text-xs">({category.count})</span>
                        </button>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Level Filter */}
                <AccordionItem value="level">
                  <AccordionTrigger className="text-sm font-medium">Level</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {levels.map((level) => (
                        <label
                          key={level}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedLevel.includes(level)}
                            onChange={() => toggleLevel(level)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {level}
                          </span>
                        </label>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>

                {/* Price Filter */}
                <AccordionItem value="price">
                  <AccordionTrigger className="text-sm font-medium">Price</AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      {priceRanges.map((range) => (
                        <label
                          key={range.id}
                          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedPrice.includes(range.id)}
                            onChange={() => togglePrice(range.id)}
                            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
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
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold text-gray-900 dark:text-white">
                  {filteredCourses.length}
                </span>{' '}
                courses
              </p>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 hidden sm:inline">
                  Sort by:
                </span>
                <button className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-sm hover:bg-gray-50 dark:hover:bg-gray-800">
                  Most Popular
                  <ChevronDown className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedCategory !== 'all' && (
                  <Badge variant="secondary" className="flex items-center gap-1">
                    {categories.find((c) => c.id === selectedCategory)?.name}
                    <button onClick={() => setSelectedCategory('all')}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                )}
                {selectedLevel.map((level) => (
                  <Badge key={level} variant="secondary" className="flex items-center gap-1">
                    {level}
                    <button onClick={() => toggleLevel(level)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
                {selectedPrice.map((price) => (
                  <Badge key={price} variant="secondary" className="flex items-center gap-1">
                    {priceRanges.find((r) => r.id === price)?.label}
                    <button onClick={() => togglePrice(price)}>
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}

            {/* Courses Grid */}
            {filteredCourses.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  No courses found
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Try adjusting your filters or search query
                </p>
                <Button onClick={clearFilters} variant="outline">
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
