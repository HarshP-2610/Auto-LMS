import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ApplicationStatus() {
    const navigate = useNavigate();
    const [appData, setAppData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const token = localStorage.getItem('instructorAppToken');
                if (!token) {
                    navigate('/auth/instructor-register');
                    return;
                }

                const response = await fetch('http://localhost:5000/api/instructor-applications/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    navigate('/auth/instructor-register');
                    return;
                }

                const data = await response.json();
                setAppData(data);

                // If it's still draft, send them back to complete profile
                if (data.status === 'draft') {
                    navigate('/instructor/pending-details');
                } else if (data.status === 'approved') {
                    navigate('/instructor/dashboard');
                }

            } catch (error) {
                console.error('Error fetching application status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatus();

        // Poll every 5 seconds for status updates
        const interval = setInterval(fetchStatus, 5000);
        return () => clearInterval(interval);
    }, [navigate]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    const renderStatusIcon = () => {
        switch (appData?.status) {
            case 'pending':
                return <Clock className="w-16 h-16 text-yellow-500 mb-4" />;
            case 'approved':
                return <CheckCircle className="w-16 h-16 text-green-500 mb-4" />;
            case 'rejected':
                return <XCircle className="w-16 h-16 text-red-500 mb-4" />;
            default:
                return <Clock className="w-16 h-16 text-gray-500 mb-4" />;
        }
    };

    const getStatusTitle = () => {
        switch (appData?.status) {
            case 'pending': return 'Application Under Review';
            case 'approved': return 'Application Approved!';
            case 'rejected': return 'Application Rejected';
            default: return 'Application Status';
        }
    };

    const getStatusMessage = () => {
        switch (appData?.status) {
            case 'pending': return 'Your application has been submitted successfully. Please wait 2-3 days for admin confirmation.';
            case 'approved': return 'Your application has been approved.';
            case 'rejected': return 'Your application has been rejected. Please contact support.';
            default: return 'Please check back later.';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full text-center bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">
                <div className="flex justify-center">
                    {renderStatusIcon()}
                </div>

                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {getStatusTitle()}
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-8">
                    {getStatusMessage()}
                </p>

                {appData?.status === 'approved' ? (
                    <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                        <Link to="/auth/instructor-login">Proceed to Login</Link>
                    </Button>
                ) : (
                    <Button asChild variant="outline" className="w-full">
                        <Link to="/">Return to Home</Link>
                    </Button>
                )}
            </div>
        </div>
    );
}
