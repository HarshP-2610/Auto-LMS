import { Globe, Target, Heart } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export function About() {
  const stats = [
    { value: '12,000+', label: 'Students' },
    { value: '850+', label: 'Courses' },
    { value: '320+', label: 'Instructors' },
    { value: '95%', label: 'Success Rate' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Mission',
      description:
        'To democratize education by providing accessible, high-quality learning experiences that empower individuals to achieve their personal and professional goals.',
    },
    {
      icon: Heart,
      title: 'Our Values',
      description:
        'We believe in inclusivity, innovation, and integrity. Every course is crafted with care to ensure the best learning experience for our students.',
    },
    {
      icon: Globe,
      title: 'Global Reach',
      description:
        'With students from over 150 countries, we are building a global community of learners who support and inspire each other.',
    },
  ];

  const team = [
    {
      name: 'Alex Thompson',
      role: 'CEO & Founder',
      image: 'https://i.pravatar.cc/150?u=301',
      bio: 'Former educator with a passion for technology and learning.',
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Content',
      image: 'https://i.pravatar.cc/150?u=302',
      bio: 'Curriculum expert with 10+ years in online education.',
    },
    {
      name: 'Michael Roberts',
      role: 'CTO',
      image: 'https://i.pravatar.cc/150?u=303',
      bio: 'Tech visionary building the future of learning platforms.',
    },
    {
      name: 'Emily Watson',
      role: 'Head of Operations',
      image: 'https://i.pravatar.cc/150?u=304',
      bio: 'Operations expert ensuring smooth learning experiences.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6">
            About AutoLMS
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            We are on a mission to transform education and make quality learning accessible to
            everyone, everywhere.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 dark:text-blue-400">
                  {stat.value}
                </div>
                <div className="text-gray-600 dark:text-gray-400 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                Our Story
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-2 mb-6">
                Building the Future of Education
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Founded in 2020, AutoLMS started with a simple idea: education should be
                accessible to everyone. What began as a small project has grown into a global
                platform serving thousands of students worldwide.
              </p>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Our team of educators, technologists, and designers work together to create
                courses that are not just informative, but engaging and practical. We believe
                that learning should be a joyful experience.
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Today, AutoLMS offers over 850 courses across various categories, taught by
                industry experts who are passionate about sharing their knowledge.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                alt="Our Team"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Our Values
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              What Drives Us
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700"
                >
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
              Our Team
            </span>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mt-2">
              Meet the People Behind AutoLMS
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-sm mb-2">
                    {member.role}
                  </p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-32 bg-gray-900 dark:bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Join Our Growing Community
          </h2>
          <p className="text-lg text-white/70 max-w-2xl mx-auto mb-10">
            Whether you are looking to learn new skills or share your expertise, AutoLMS is
            the place for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/auth/register"
              className="px-8 py-4 bg-white text-gray-900 rounded-full font-medium hover:bg-white/90 transition-colors"
            >
              Become a Student
            </a>
            <a
              href="/auth/instructor-register"
              className="px-8 py-4 border border-white/30 text-white rounded-full font-medium hover:bg-white/10 transition-colors"
            >
              Become an Instructor
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
