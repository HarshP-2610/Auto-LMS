import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { UserCheck, CheckCircle } from 'lucide-react';

export function PendingDetails() {
    const navigate = useNavigate();
    const [appData, setAppData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        educationalDetails: '',
        workExperience: '',
        areaOfExpertise: '',
        bio: '',
    });
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    useEffect(() => {
        const fetchAppStatus = async () => {
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
                if (data.status !== 'draft') {
                    navigate('/instructor/application-status');
                }
            } catch (error) {
                console.error('Error fetching application status:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAppStatus();
    }, [navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.educationalDetails.trim()) newErrors.educationalDetails = 'Required';
        if (!formData.workExperience) newErrors.workExperience = 'Required';
        if (!formData.areaOfExpertise.trim()) newErrors.areaOfExpertise = 'Required';
        if (!formData.bio.trim()) newErrors.bio = 'Required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('instructorAppToken');
            const response = await fetch('http://localhost:5000/api/instructor-applications/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    workExperience: Number(formData.workExperience)
                })
            });

            if (response.ok) {
                setShowPopup(true);
                setTimeout(() => {
                    navigate('/instructor/application-status');
                }, 2000);
            } else {
                const data = await response.json();
                setErrors({ submit: data.message || 'Update failed' });
            }
        } catch (error) {
            setErrors({ submit: 'Failed to connect to the server' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg border border-gray-200 dark:border-gray-800">

                {showPopup && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl flex flex-col items-center gap-4 animate-in fade-in zoom-in duration-300">
                            <CheckCircle className="w-16 h-16 text-green-500" />
                            <h2 className="text-xl font-bold">Your application has been submitted successfully.</h2>
                            <p className="text-gray-500">Redirecting...</p>
                        </div>
                    </div>
                )}

                <div className="mb-8">
                    <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                        <UserCheck className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Complete Your Profile
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Please provide additional details to complete your application.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {errors.submit && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
                            {errors.submit}
                        </div>
                    )}

                    {/* Readonly Basics */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Name</Label>
                            <Input type="text" value={appData?.name || ''} readOnly className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <Label>Phone</Label>
                            <Input type="text" value={appData?.phone || ''} readOnly className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <Label>Email</Label>
                            <Input type="text" value={appData?.email || ''} readOnly className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
                        </div>
                        <div className="space-y-2">
                            <Label>Subject</Label>
                            <Input type="text" value={appData?.subject || ''} readOnly className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed" />
                        </div>
                    </div>

                    <hr className="my-6 border-gray-200 dark:border-gray-800" />

                    {/* Additional details */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="educationalDetails">Educational Details</Label>
                            <Textarea
                                id="educationalDetails"
                                name="educationalDetails"
                                placeholder="List your degrees, institutions, and graduation years..."
                                rows={3}
                                value={formData.educationalDetails}
                                onChange={handleChange}
                                className={errors.educationalDetails ? 'border-red-500' : ''}
                            />
                            {errors.educationalDetails && <p className="text-sm text-red-500">{errors.educationalDetails}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="workExperience">Work Experience (years)</Label>
                            <Input
                                id="workExperience"
                                name="workExperience"
                                type="number"
                                min="0"
                                placeholder="e.g. 5"
                                value={formData.workExperience}
                                onChange={handleChange}
                                className={errors.workExperience ? 'border-red-500' : ''}
                            />
                            {errors.workExperience && <p className="text-sm text-red-500">{errors.workExperience}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="areaOfExpertise">Area of Expertise</Label>
                            <Input
                                id="areaOfExpertise"
                                name="areaOfExpertise"
                                type="text"
                                placeholder="e.g. Frontend Development, Data Science"
                                value={formData.areaOfExpertise}
                                onChange={handleChange}
                                className={errors.areaOfExpertise ? 'border-red-500' : ''}
                            />
                            {errors.areaOfExpertise && <p className="text-sm text-red-500">{errors.areaOfExpertise}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="bio">Bio</Label>
                            <Textarea
                                id="bio"
                                name="bio"
                                placeholder="Tell us about yourself..."
                                rows={4}
                                value={formData.bio}
                                onChange={handleChange}
                                className={errors.bio ? 'border-red-500' : ''}
                            />
                            {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
                        </div>
                    </div>

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Application'}
                    </Button>
                </form>
            </div>
        </div>
    );
}
