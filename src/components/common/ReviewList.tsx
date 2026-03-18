import { useState, useEffect } from 'react';
import { Star, Loader2, MessageSquare } from 'lucide-react';

interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewData {
  count: number;
  averageRating: number;
  distribution: Record<number, number>;
  data: Review[];
}

interface ReviewListProps {
  courseId: string;
  refreshKey?: number; // increment to trigger re-fetch
}

export function ReviewList({ courseId, refreshKey = 0 }: ReviewListProps) {
  const [reviewData, setReviewData] = useState<ReviewData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, [courseId, refreshKey]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/api/reviews/${courseId}`);
      const data = await response.json();
      if (response.ok) {
        setReviewData(data);
      }
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!reviewData || reviewData.count === 0) {
    return (
      <div className="text-center py-16 bg-slate-50 dark:bg-slate-900/30 rounded-2xl border border-slate-200 dark:border-slate-800">
        <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
        <h4 className="text-lg font-bold text-slate-700 dark:text-slate-300 mb-2">No Reviews Yet</h4>
        <p className="text-slate-500 dark:text-slate-400 text-sm">Be the first to share your experience with this course!</p>
      </div>
    );
  }

  const { averageRating, count, distribution, data: reviews } = reviewData;

  return (
    <div className="space-y-8">
      {/* Summary Header */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          {/* Average Rating */}
          <div className="text-center flex-shrink-0">
            <div className="text-5xl font-black text-slate-900 dark:text-white mb-2">{averageRating}</div>
            <div className="flex items-center gap-0.5 justify-center mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-5 h-5 ${
                    star <= Math.round(averageRating)
                      ? 'fill-yellow-400 text-yellow-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{count} {count === 1 ? 'review' : 'reviews'}</p>
          </div>

          {/* Rating Bars */}
          <div className="flex-1 w-full space-y-2.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const starCount = distribution[star] || 0;
              const percentage = count > 0 ? (starCount / count) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-1 w-12 justify-end">
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">{star}</span>
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-yellow-400 rounded-full transition-all duration-700"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-slate-500 dark:text-slate-400 w-8 text-right">{starCount}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Individual Reviews */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review._id}
            className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                {review.user.avatar && review.user.avatar !== 'no-photo.jpg' ? (
                  <img
                    src={review.user.avatar.startsWith('http') ? review.user.avatar : `http://localhost:5000/uploads/${review.user.avatar}`}
                    alt={review.user.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-slate-200 dark:border-slate-700"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-sm font-bold text-blue-600 dark:text-blue-400 border-2 border-blue-200 dark:border-blue-800">
                    {getInitials(review.user.name)}
                  </div>
                )}
              </div>

              {/* Review Content */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h5 className="font-bold text-slate-900 dark:text-white">{review.user.name}</h5>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-3.5 h-3.5 ${
                            star <= review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-slate-300 dark:text-slate-600'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 dark:text-slate-500">•</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                      {formatDate(review.createdAt)}
                    </span>
                  </div>
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                  {review.comment}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
