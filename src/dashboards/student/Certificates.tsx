import { Award, Download, Share2, Calendar, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { certificates } from '@/data/mockData';

export function Certificates() {
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
                  {certificates.length}
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
                <p className="text-2xl font-bold text-green-600">1</p>
              </div>
            </div>
          </div>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Latest Certificate</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">
                  {certificates.length > 0
                    ? new Date(certificates[0].issuedDate).toLocaleDateString()
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Certificates Grid */}
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certificates.map((cert) => (
              <div
                key={cert.id}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm"
              >
                {/* Certificate Preview */}
                <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-8 text-white">
                  <div className="absolute inset-0 opacity-10">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}
                    />
                  </div>
                  <div className="relative text-center">
                    <Award className="w-16 h-16 mx-auto mb-4" />
                    <p className="text-sm uppercase tracking-wider mb-2">Certificate of Completion</p>
                    <h3 className="text-2xl font-bold mb-2">{cert.studentName}</h3>
                    <p className="text-white/80">has successfully completed</p>
                    <h4 className="text-xl font-semibold mt-2">{cert.courseTitle}</h4>
                    <div className="mt-6 pt-6 border-t border-white/20">
                      <div className="flex items-center justify-between text-sm">
                        <div>
                          <p className="text-white/60">Certificate ID</p>
                          <p className="font-mono">{cert.certificateId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white/60">Issued Date</p>
                          <p>{new Date(cert.issuedDate).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 flex gap-3">
                  <Button className="flex-1">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
            <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              No Certificates Yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
              Complete courses and pass their final quizzes to earn certificates. Your
              achievements will appear here.
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
