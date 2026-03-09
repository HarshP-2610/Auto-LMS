import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle, MessageSquare, Clock, Globe, ShieldCheck, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 5000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Support',
      content: 'support@autolms.com',
      description: 'Response within 12 hours',
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      icon: Phone,
      title: 'Direct Call',
      content: '+1 (555) 888-2024',
      description: '24/7 Priority Support',
      color: 'text-purple-500',
      bg: 'bg-purple-500/10'
    },
    {
      icon: MapPin,
      title: 'Global HQ',
      content: 'Tech Plaza, Silicon District',
      description: 'SF, California - USA',
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
  ];

  const faqs = [
    {
      q: 'How do I initiate enrollment?',
      a: 'Browse our catalog, select your path, and click "Enroll Now". Your journey starts instantly upon confirmation.',
    },
    {
      q: 'Is there a risk-free period?',
      a: 'Absolutely. We provide a 30-day "Elite Experience" guarantee. If we don\'t meet your standards, we offer a full refund.',
    },
    {
      q: 'How are certificates verified?',
      a: 'Every certificate comes with a unique blockchain-verifiable ID, making it easy to share with recruiters globally.',
    },
    {
      q: 'Do I get access to updates?',
      a: 'Yes. Once enrolled, you receive lifetime access including all future content refreshes and added modules.',
    },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0F1C] transition-colors duration-500 selection:bg-blue-500/30">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className={`inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-blue-500/15 border border-blue-500/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <Sparkles className="w-3.5 h-3.5" />
              We're Here for You
            </div>
            <h1 className={`text-5xl lg:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[1] transition-all duration-1000 delay-100 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Let's Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-500">Conversation.</span>
            </h1>
            <p className={`text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 font-medium leading-relaxed transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              Whether you have a technical question, need support with your learning path, or just want to say hello, our team is ready to assist.
            </p>
          </div>
        </div>
      </section>

      {/* Info Cards - Aesthetic & Floating */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {contactInfo.map((info, idx) => (
              <div
                key={info.title}
                className={`group p-8 bg-slate-50 dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10 text-center ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${300 + idx * 100}ms` }}
              >
                <div className={`w-16 h-16 ${info.bg} ${info.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <info.icon className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                  {info.title}
                </h3>
                <p className="text-lg text-slate-900 dark:text-white font-bold mb-1">
                  {info.content}
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
                  {info.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Form & FAQ Section */}
      <section className="py-24 bg-slate-50 dark:bg-[#080B14] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
            {/* Glass Form Container */}
            <div className={`bg-white dark:bg-slate-900/60 rounded-[3rem] p-10 lg:p-12 border border-slate-200/50 dark:border-slate-800/50 shadow-sm backdrop-blur-xl transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-12'}`}>
              <div className="mb-10">
                <Badge className="bg-blue-600/10 text-blue-600 dark:text-blue-400 border-none mb-4 font-bold rounded-lg px-3 py-1">CONTACT FORM</Badge>
                <h2 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
                  Design Your <span className="text-blue-600">Request</span>
                </h2>
              </div>

              {isSubmitted ? (
                <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-8 relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full scale-110"></div>
                    <CheckCircle className="w-12 h-12 text-emerald-500 relative z-10" />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
                    Message Synced!
                  </h3>
                  <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
                    We've received your inquiry. Our experts are already reviewing it and will respond through your provided channel.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="e.g. Alan Turing"
                        className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 text-base px-6 focus:ring-blue-500/20"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500">Email Architecture</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="name@domain.com"
                        className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 text-base px-6 focus:ring-blue-500/20"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-slate-500">Subject Matter</Label>
                    <Input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="What's on your mind?"
                      className="h-16 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 text-base px-6 focus:ring-blue-500/20"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="message" className="text-xs font-black uppercase tracking-widest text-slate-500">The Context</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Detail your inquiry here..."
                      className="rounded-[2rem] bg-slate-50 dark:bg-slate-950/50 border-slate-100 dark:border-slate-800 text-base p-6 min-h-[180px] focus:ring-blue-500/20"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-16 rounded-2xl bg-slate-900 dark:bg-blue-600 text-white font-black text-lg shadow-xl shadow-blue-500/10 hover:scale-[1.02] transition-all"
                  >
                    Send to Headquarters
                    <Send className="w-5 h-5 ml-3" />
                  </Button>
                </form>
              )}
            </div>

            {/* FAQ Visual Section */}
            <div className={`space-y-12 transition-all duration-1000 delay-700 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'}`}>
              <div className="space-y-6">
                <Badge className="bg-slate-950 dark:bg-white text-white dark:text-slate-900 border-none font-bold rounded-lg px-3 py-1">FAQ HUB</Badge>
                <h2 className="text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
                  Instant <span className="text-blue-600 italic font-serif">Solutions.</span>
                </h2>
                <p className="text-slate-500 dark:text-slate-400 text-lg font-medium">Quick answers to our most common inquiries from the community.</p>
              </div>

              <div className="grid gap-6">
                {faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="group bg-white dark:bg-slate-900/40 rounded-[2rem] p-8 border border-slate-200/50 dark:border-slate-800/50 hover:bg-white dark:hover:bg-slate-800 transition-all duration-500"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                        <HelpCircle className="w-5 h-5 text-blue-600 group-hover:text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2 leading-tight">
                          {faq.q}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 bg-blue-600 rounded-[2.5rem] text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full" />
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 justify-between">
                  <div>
                    <h4 className="text-xl font-black mb-1 tracking-tight">Still have questions?</h4>
                    <p className="text-blue-100 text-sm font-medium">Live chat with our support mentors.</p>
                  </div>
                  <Button className="bg-white text-blue-600 hover:bg-blue-50 font-black rounded-2xl h-12 px-6 shadow-lg">
                    Open Discord <MessageSquare className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section - Immersive Minimalist */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 blur rounded-[3rem] opacity-20 group-hover:opacity-40 transition-opacity"></div>
          <div className="relative rounded-[3rem] overflow-hidden border-8 border-white dark:border-slate-900 shadow-2xl h-[500px]">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910525!2d-74.25986652089301!3d40.69714941680757!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e1!3m2!1sen!2s!4v1709577600000!5m2!1sen!2s"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(1) invert(0.1) opacity(0.8)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Office Location"
            />
            {/* Minimalist Overlay Label */}
            <div className="absolute top-10 left-10 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-6 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-2xl">
              <div className="flex items-center gap-3 mb-2">
                <Globe className="w-5 h-5 text-blue-600" />
                <span className="text-xs font-black uppercase tracking-widest text-slate-500">Global Hub</span>
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white">AutoLMS Campus</h4>
              <p className="text-slate-500 text-xs font-medium mt-1">Visit our physical headquarters</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
