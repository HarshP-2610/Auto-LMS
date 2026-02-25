import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function PendingInstructors() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchApplications = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/admin/pending-instructors', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setApplications(data);
            }
        } catch (error) {
            console.error('Error fetching pending instructors:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications();
    }, []);

    const handleApprove = async (id: string) => {
        if (!window.confirm('Are you sure you want to approve this application?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/pending-instructors/${id}/approve`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                fetchApplications();
            } else {
                alert('Failed to approve application');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleReject = async (id: string) => {
        if (!window.confirm('Are you sure you want to reject this application?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/admin/pending-instructors/${id}/reject`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                fetchApplications();
            } else {
                alert('Failed to reject application');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <DashboardLayout userRole="admin">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Instructor Applications</h1>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                        Review and approve or reject applications from new instructors.
                    </p>
                </div>

                {loading ? (
                    <p>Loading...</p>
                ) : applications.length === 0 ? (
                    <div className="p-8 text-center bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                        <p className="text-gray-500">No pending applications at the moment.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {applications.map((app: any) => (
                            <div key={app._id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-lg shadow-sm">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold">{app.name}</h3>
                                        <p className="text-sm text-gray-500">{app.email} • {app.phone}</p>
                                        <p className="text-sm font-medium mt-2">Subject: {app.subject}</p>

                                        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase">Experience</p>
                                                <p className="text-sm">{app.workExperience} years</p>
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-gray-400 uppercase">Expertise</p>
                                                <p className="text-sm">{app.areaOfExpertise}</p>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <p className="text-xs font-semibold text-gray-400 uppercase">Educational Details</p>
                                            <p className="text-sm">{app.educationalDetails}</p>
                                        </div>
                                        <div className="mt-4">
                                            <p className="text-xs font-semibold text-gray-400 uppercase">Bio</p>
                                            <p className="text-sm italic">"{app.bio}"</p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <Button
                                            onClick={() => handleApprove(app._id)}
                                            className="bg-green-600 hover:bg-green-700 text-white"
                                            size="sm"
                                        >
                                            <Check className="w-4 h-4 mr-1" /> Approve
                                        </Button>
                                        <Button
                                            onClick={() => handleReject(app._id)}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            <X className="w-4 h-4 mr-1" /> Reject
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
