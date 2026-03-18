import { useState } from 'react';
import { Star, Send, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ReviewFormProps {
  courseId: string;
  onReviewSubmitted: () => void;
}

export function ReviewForm({ courseId, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('userToken');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('You must be logged in to leave a review.');
      return;
    }

    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    if (comment.trim().length < 5) {
      setError('Please write at least 5 characters in your review.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await fetch('http://localhost:5000/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ courseId, rating, comment: comment.trim() })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Review submitted successfully!');
        setRating(0);
        setComment('');
        onReviewSubmitted();
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 text-center">
        <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-3" />
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          Please <a href="/auth/login" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">sign in</a> to leave a review.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl p-6 lg:p-8 border border-slate-200 dark:border-slate-800 shadow-sm">
      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-6">Write a Review</h4>

      {/* Star Rating Picker */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Your Rating</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoveredRating(star)}
              onMouseLeave={() => setHoveredRating(0)}
              className="p-1 rounded-lg hover:bg-yellow-50 dark:hover:bg-yellow-900/20 transition-colors"
            >
              <Star
                className={`w-8 h-8 transition-all duration-150 ${
                  star <= (hoveredRating || rating)
                    ? 'fill-yellow-400 text-yellow-400 scale-110'
                    : 'text-slate-300 dark:text-slate-600'
                }`}
              />
            </button>
          ))}
          {rating > 0 && (
            <span className="ml-3 text-sm font-bold text-yellow-600 dark:text-yellow-400">
              {rating === 1 && 'Poor'}
              {rating === 2 && 'Fair'}
              {rating === 3 && 'Good'}
              {rating === 4 && 'Very Good'}
              {rating === 5 && 'Excellent'}
            </span>
          )}
        </div>
      </div>

      {/* Comment Textarea */}
      <div className="mb-6">
        <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-3">Your Review</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Share your experience with this course... What did you learn? How was the instructor?"
          rows={4}
          maxLength={1000}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all text-sm"
        />
        <p className="text-xs text-slate-400 mt-1.5 text-right">{comment.length}/1000</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm font-medium mb-4 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-200 dark:border-red-800">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={submitting || rating === 0}
        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {submitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Submitting...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-4 h-4" />
            Submit Review
          </span>
        )}
      </Button>
    </form>
  );
}
