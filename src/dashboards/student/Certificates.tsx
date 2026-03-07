import { Award, Download, Share2, Calendar, CheckCircle, Loader2 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { CertificateModal } from '@/components/certificate/CertificateModal';

export function Certificates() {
  const [certs, setCerts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState<any>(null);

  useEffect(() => {
    fetchCertificates();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users/profile', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
      const data = await response.json();
      if (response.ok) setUserProfile(data);
    } catch (error) {
      console.error("Failed to load profile", error);
    }
  };

  const fetchCertificates = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/progress/certificates', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('userToken')}` }
      });
      const data = await response.json();
      if (response.ok) {
        setCerts(data.data || []);
      }
    } catch (error) {
      console.error("Failed to load certificates", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout userRole="student">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
          <p className="text-gray-500">Retrieving your achievements...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="student">
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
            My Certificates
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Download and share your achievements
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Certificates</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                  {certs.length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Courses Completed</p>
                <p className="text-2xl font-bold text-green-600">{certs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Latest Achievement</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {certs.length > 0
                    ? new Date(certs[certs.length - 1].completionDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {certs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certs.map((cert) => (
              <div
                key={cert._id}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                {/* Certificate Preview */}
                <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 p-8 text-white">
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />
                  </div>
                  <div className="relative text-center">
                    <Award className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                    <p className="text-sm uppercase tracking-wider mb-2 font-black">Certificate of Completion</p>
                    <p className="text-white/80 font-medium">This is to certify that you have successfully mastered</p>
                    <h4 className="text-2xl font-black mt-2 mb-4 drop-shadow-lg">{cert.course?.title}</h4>
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-widest">
                        <div>
                          <p className="text-white/60 mb-1">Student</p>
                          <p className="text-white">Active Learner</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60 mb-1">Completion Date</p>
                          <p className="text-white">{new Date(cert.completionDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 flex gap-3 bg-gray-50 dark:bg-gray-800/50">
                  <Button
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 font-bold"
                    onClick={() => {
                      setSelectedCert(cert);
                      setShowModal(true);
                    }}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Premium PDF
                  </Button>
                  <Button variant="outline" size="icon" className="border-indigo-200 text-indigo-600">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800">
            <div className="w-20 h-20 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              No Certificates Earned
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm mx-auto mb-8">
              Finish all topics and pass the Final Course Assessment to unlock your professional certification.
            </p>
            <Button variant="outline" className="border-indigo-200 text-indigo-600" asChild>
              <a href="/student/courses">Browse My Courses</a>
            </Button>
          </div>
        )}
      </div>

      {selectedCert && userProfile && (
        <CertificateModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          data={{
            studentName: userProfile.name,
            courseTitle: selectedCert.course?.title,
            instructorName: selectedCert.course?.instructor?.name || 'Auto-LMS Team',
            completionDate: new Date(selectedCert.completionDate).toLocaleDateString(),
            certificateId: `CRT-${selectedCert._id.slice(-6).toUpperCase()}-${userProfile._id.slice(-4).toUpperCase()}`
          }}
        />
      )}
    </DashboardLayout>
  );
}
