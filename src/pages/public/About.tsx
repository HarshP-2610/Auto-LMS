import { useState, useEffect } from 'react';
import { Globe, Target, Heart, Users, Sparkles, Rocket, Quote, ShieldCheck, Mail, ArrowRight, Twitter, Linkedin } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

export function About() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const stats = [
    { value: '12K+', label: 'Active Students', icon: Users, color: 'text-blue-500' },
    { value: '850+', label: 'Premium Courses', icon: Rocket, color: 'text-purple-500' },
    { value: '320+', label: 'Expert Mentors', icon: Sparkles, color: 'text-amber-500' },
    { value: '95%', label: 'Student Satisfaction', icon: ShieldCheck, color: 'text-emerald-500' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Our Purpose',
      description:
        'To democratize excellence by providing access to high-impact learning experiences that bridge the gap between potential and achievement.',
      gradient: 'from-blue-500/20 to-indigo-500/20',
      iconColor: 'text-blue-500',
    },
    {
      icon: Heart,
      title: 'Human-Centric',
      description:
        'We believe technology should serve people. Every feature we build and every course we host is designed with the human learner at the center.',
      gradient: 'from-rose-500/20 to-orange-500/20',
      iconColor: 'text-rose-500',
    },
    {
      icon: Globe,
      title: 'Global Synergy',
      description:
        'AutoLMS connects minds across 150+ countries. We aren\'t just a platform; we\'re a global nervous system for knowledge exchange.',
      gradient: 'from-emerald-500/20 to-teal-500/20',
      iconColor: 'text-emerald-500',
    },
  ];

  const team = [
    {
      name: 'Alex Thompson',
      role: 'CEO & Visionary',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: 'Leading the bridge between education and AI.',
    },
    {
      name: 'Sarah Chen',
      role: 'Head of Excellence',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop',
      bio: 'Defining the standard for online curriculum.',
    },
    {
      name: 'Michael Roberts',
      role: 'Architect of Tech',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: 'Building the fastest learning engine on the web.',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Experience Designer',
      image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
      bio: 'Making learning feel like a premium journey.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1C] transition-colors duration-500 selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section - Immersive Design */}
      <section className="relative pt-40 pb-24 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-widest transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Sparkles className="w-3.5 h-3.5" />
              Redefining Education
            </div>
            <h1 className={`text-5xl lg:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[1] transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              We're here to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Elevate</span> your potential.
            </h1>
            <p className={`text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              AutoLMS is more than a platform. It's a movement to bridge the gap between current skills and the future of work through elite mentorship and cutting-edge technology.
            </p>
          </div>
        </div>
      </section>

      {/* Modern Stats Display */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, idx) => (
              <div key={stat.label} className={`p-8 bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 group ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${300 + idx * 100}ms` }}>
                <div className={`w-12 h-12 rounded-2xl bg-white dark:bg-slate-800 flex items-center justify-center mb-6 shadow-sm border border-slate-100 dark:border-slate-700 group-hover:scale-110 transition-transform ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <div className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story with Narrative Design */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className={`relative transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-purple-600/20 blur-3xl rounded-[3rem]" />
              <div className="relative rounded-[3rem] overflow-hidden border-8 border-white dark:border-slate-800 shadow-2xl skew-y-1">
                <img
                  src="/team_collaboration.png"
                  alt="Our Vision"
                  className="w-full aspect-[4/5] object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                      <Quote className="w-6 h-6 fill-current" />
                    </div>
                    <p className="text-white font-medium text-lg leading-tight uppercase tracking-tighter">"The future belongs to those who learn fast."</p>
                  </div>
                </div>
              </div>
            </div>

            <div className={`space-y-8 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="space-y-2">
                <Badge className="bg-blue-600 text-white border-none py-1.5 px-4 font-bold rounded-full">EST. 2020</Badge>
                <h2 className="text-4xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1]">
                  A journey of a thousand <span className="text-blue-600">Modules.</span>
                </h2>
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                AutoLMS began with a radical premise: That elite, world-class knowledge shouldn't be locked behind expensive university gates.
              </p>
              <div className="grid gap-6">
                {[
                  { title: 'Inception', text: 'Started as a simple repository of expert videos in a single room office.' },
                  { title: 'Growth', text: 'Scaled to 850+ courses with instructors joining from top Silicon Valley firms.' },
                  { title: 'Future', text: 'Integrating AI-driven personalized learning paths for every individual student.' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-800">
                    <div className="w-6 h-6 rounded-full bg-blue-600/10 border border-blue-600/30 flex items-center justify-center text-blue-600 font-black text-xs shrink-0 mt-1">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs mb-1">{item.title}</h4>
                      <p className="text-slate-500 text-sm font-medium">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="rounded-2xl h-14 px-8 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold hover:scale-105 transition-transform" asChild>
                <Link to="/courses">Read Full Manifesto</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Values with Glassmorphism */}
      <section className="py-24 bg-slate-50 dark:bg-[#080B14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20 space-y-4">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Our Core <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-emerald-500">DNA</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">The principles that guide every decision we make and every lesson we provide.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <div
                  key={value.title}
                  className="group relative p-10 bg-white dark:bg-slate-900/40 rounded-[3rem] border border-slate-200/50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-500 overflow-hidden shadow-sm"
                >
                  <div className={`absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br ${value.gradient} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                  <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center mb-8 shadow-inner border border-slate-100 dark:border-slate-700 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <Icon className={`w-8 h-8 ${value.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
                    {value.title}
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{value.description}</p>

                  <div className="mt-8 flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all duration-500">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Cards - Clean and Aesthetic */}
      <section className="py-24 lg:py-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="space-y-4">
              <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                Elite Leadership
              </h2>
              <p className="text-slate-500 font-medium text-lg max-w-xl">Meet the strategists and builders sculpting the future of digital learning.</p>
            </div>
            <div className="flex gap-2">
              <div className="w-12 h-12 rounded-full border border-slate-200 dark:border-slate-800 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer transition-colors">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </div>
              <div className="w-12 h-12 rounded-full bg-slate-950 dark:bg-white text-white dark:text-slate-900 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div
                key={member.name}
                className="group relative flex flex-col items-center"
              >
                <div className="relative w-full aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end justify-center pb-8 gap-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-blue-600 transition-colors cursor-pointer">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-blue-400 transition-colors cursor-pointer">
                      <Twitter className="w-4 h-4" />
                    </div>
                  </div>
                </div>
                <div className="text-center group-hover:translate-y-[-10px] transition-transform duration-500">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mb-1">
                    {member.name}
                  </h3>
                  <p className="text-blue-600 dark:text-blue-400 text-xs font-black uppercase tracking-widest mb-3">
                    {member.role}
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-sm font-medium px-4">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* New Newsletter/Contact Micro-Section */}
      <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 rounded-[3rem] p-12 lg:p-20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/20 blur-[100px] rounded-full translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-600/10 blur-[80px] rounded-full -translate-x-1/2 translate-y-1/2" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em]">
                Stay Connected
              </div>
              <h2 className="text-4xl lg:text-6xl font-black text-white tracking-tight leading-none">
                Get <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Weekly</span> Insights.
              </h2>
              <p className="text-slate-400 font-medium text-lg max-w-xl">Join 20,000+ others who get our exclusive reports on the future of learning and job trends.</p>
            </div>

            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
              <div className="relative group/input flex-1 min-w-[300px]">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-blue-400 transition-colors" />
                <input
                  type="email"
                  placeholder="name@company.com"
                  className="w-full h-16 pl-14 pr-6 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all font-medium"
                />
              </div>
              <Button size="lg" className="h-16 px-10 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg shadow-lg shadow-blue-600/20 active:scale-95 transition-all">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Wrap-up */}
      <section className="py-24 lg:py-40 bg-white dark:bg-[#0A0F1C] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <h2 className="text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
            Ready to rewrite your <span className="italic font-serif font-light text-blue-600">Future?</span>
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Button size="lg" className="h-16 px-10 rounded-3xl bg-blue-600 hover:bg-blue-700 text-white font-black uppercase tracking-widest text-sm w-full sm:w-auto shadow-2xl shadow-blue-600/30" asChild>
              <Link to="/auth/register">Join as Student</Link>
            </Button>
            <Button variant="outline" size="lg" className="h-16 px-10 rounded-3xl border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white font-black uppercase tracking-widest text-sm w-full sm:w-auto hover:bg-slate-50 dark:hover:bg-slate-900" asChild>
              <Link to="/auth/instructor-register">Become Instructor</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
