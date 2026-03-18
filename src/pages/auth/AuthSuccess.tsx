import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get('token');
    
    if (token) {
      // Decode token to get user info, or just fetch profile
      // For now, save token and pretend it's a student for redirect
      localStorage.setItem('userToken', token);
      
      // Ideally we would fetch the user profile here using the token
      // to determine role and redirect accordingly.
      // Assuming 'user'/'student' role by default since it's an OAuth login
      
      localStorage.setItem('userData', JSON.stringify({ role: 'student', token }));
      
      // Redirect to student dashboard
      navigate('/student/dashboard', { replace: true });
    } else {
      // If no token, redirect to login
      navigate('/auth/login', { replace: true });
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">Authenticating...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">Please wait while we log you in.</p>
      </div>
    </div>
  );
}
