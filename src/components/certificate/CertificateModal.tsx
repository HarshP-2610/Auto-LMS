import { useRef } from 'react';
import { Award, Download, X, ShieldCheck, Globe } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface CertificateData {
    studentName: string;
    courseTitle: string;
    instructorName: string;
    completionDate: string;
    certificateId: string;
}

interface CertificateModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: CertificateData;
}

export function CertificateModal({ isOpen, onClose, data }: CertificateModalProps) {
    const certificateRef = useRef<HTMLDivElement>(null);

    const downloadPDF = async () => {
        if (!certificateRef.current) return;

        const toastId = toast.loading('Generating your official certificate...');

        try {
            const element = certificateRef.current;
            const canvas = await html2canvas(element, {
                scale: 3, // High quality
                useCORS: true,
                backgroundColor: '#050505',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'px',
                format: [canvas.width, canvas.height]
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
            pdf.save(`${data.courseTitle.replace(/\s+/g, '_')}_Certificate.pdf`);

            toast.success('Certificate downloaded successfully!', { id: toastId });
        } catch (error) {
            console.error('PDF Generation Error:', error);
            toast.error('Failed to generate PDF. Please try again.', { id: toastId });
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[95vw] md:max-w-[1100px] p-0 overflow-hidden bg-transparent border-none shadow-none focus-visible:ring-0">
                <div className="relative w-full max-h-[95vh] overflow-y-auto no-scrollbar rounded-[2rem] bg-[#0a0a0b] border border-white/10 shadow-2xl flex flex-col mx-auto my-2">

                    {/* Main Certificate Area (Exportable) */}
                    <div className="flex-1 p-3 md:p-10 flex items-center justify-center overflow-hidden">
                        <div
                            ref={certificateRef}
                            className="relative w-full max-w-[1000px] aspect-[1.414/1] bg-[#050505] text-white overflow-hidden p-[1px] rounded-lg shadow-2xl flex-shrink-0"
                            style={{ margin: '0 auto' }}
                        >
                            {/* Outer Golden Border Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#d4af37] via-[#f7ef8a] to-[#926d00] opacity-80" />

                            {/* Inner Dark Background */}
                            <div className="absolute inset-[12px] bg-[#050505] rounded-[2px]" />

                            {/* Intricate Pattern Overlay */}
                            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23ffffff' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

                            {/* Decorative Corner Ornaments (SVG) */}
                            <div className="absolute top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-[#d4af37]/40" />
                            <div className="absolute top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-[#d4af37]/40" />
                            <div className="absolute bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-[#d4af37]/40" />
                            <div className="absolute bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-[#d4af37]/40" />

                            {/* Content Layout */}
                            <div className="relative h-full flex flex-col items-center justify-center text-center p-12 md:p-16 space-y-8 md:space-y-10">

                                {/* Header: Logo & Title */}
                                <div className="space-y-4 md:space-y-6 flex flex-col items-center">
                                    <div className="relative">
                                        <div className="absolute inset-0 blur-2xl bg-[#d4af37]/20 rounded-full" />
                                        <Award className="w-16 h-16 md:w-20 md:h-20 text-[#d4af37]" strokeWidth={1} />
                                    </div>
                                    <div className="space-y-1">
                                        <h1 className="text-[10px] md:text-xs font-black tracking-[0.6em] text-[#d4af37] uppercase">Official Certification</h1>
                                        <p className="text-[#d4af37]/60 text-[8px] md:text-[9px] tracking-[0.2em] font-medium italic">Accredited by Auto-LMS Professional Academy</p>
                                    </div>
                                </div>

                                {/* Recipient Name Section */}
                                <div className="space-y-2 md:space-y-4 max-w-3xl">
                                    <p className="text-white/40 text-[12px] md:text-sm italic font-medium">This prestigious certificate is proudly presented to</p>
                                    <h2 className="text-4xl md:text-6xl font-serif font-black text-white tracking-tight leading-tight drop-shadow-sm">
                                        {data.studentName}
                                    </h2>
                                    <div className="w-1/2 h-px bg-gradient-to-r from-transparent via-[#d4af37]/40 to-transparent mx-auto mt-2 md:mt-4" />
                                </div>

                                {/* Achievement Description */}
                                <div className="space-y-2 md:space-y-3">
                                    <p className="text-white/40 text-[12px] md:text-sm font-medium italic">for the successful completion and mastery of</p>
                                    <h3 className="text-xl md:text-3xl font-black text-white px-6 md:px-8 py-2 md:py-3 bg-white/5 border border-white/10 rounded-full backdrop-blur-sm">
                                        {data.courseTitle}
                                    </h3>
                                </div>

                                {/* Bottom Verification Section */}
                                <div className="grid grid-cols-3 gap-6 md:gap-16 w-full pt-8 md:pt-16">
                                    {/* Instructor Signature */}
                                    <div className="flex flex-col items-center space-y-1 md:space-y-2">
                                        <div className="h-8 md:h-10 flex items-center justify-center">
                                            <p className="text-sm md:text-xl font-serif italic text-white/80 border-b border-[#d4af37]/40 px-4 md:px-6 pb-1 md:pb-2 min-w-[120px] md:min-w-[160px]">
                                                {data.instructorName}
                                            </p>
                                        </div>
                                        <p className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest font-black">Lead Instructor</p>
                                    </div>

                                    {/* Security Seal */}
                                    <div className="relative -mt-6 md:-mt-8 flex justify-center">
                                        <div className="w-20 h-20 md:w-28 md:h-28 border-2 border-double border-[#d4af37]/20 rounded-full flex items-center justify-center text-[#d4af37] opacity-40 rotate-[15deg]">
                                            <div className="text-[6px] md:text-[8px] font-black text-center uppercase p-1 md:p-2 leading-tight">
                                                SECURED<br />VERIFIED<br />AUTO-LMS<br />2026
                                            </div>
                                        </div>
                                    </div>

                                    {/* Date & ID */}
                                    <div className="flex flex-col items-center space-y-1 md:space-y-2">
                                        <div className="h-8 md:h-10 flex items-center justify-center border-b border-[#d4af37]/40 px-4 md:px-6 pb-1 md:pb-2 min-w-[120px] md:min-w-[160px]">
                                            <p className="text-sm md:text-lg font-bold text-white/80">
                                                {data.completionDate}
                                            </p>
                                        </div>
                                        <p className="text-[8px] md:text-[10px] text-white/40 uppercase tracking-widest font-black">Date of Issue</p>
                                    </div>
                                </div>

                                {/* Footer Labels */}
                                <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 flex flex-col items-start space-y-1 bg-white/5 p-2 px-3 rounded-lg border border-white/10">
                                    <p className="text-[6px] md:text-[8px] text-white/40 uppercase font-black">Credential ID</p>
                                    <p className="text-[7px] md:text-[9px] text-[#d4af37] font-mono font-bold tracking-wider">{data.certificateId}</p>
                                </div>

                                <div className="absolute bottom-6 md:bottom-12 right-6 md:right-12 flex items-center gap-2 md:gap-3 bg-white/5 p-2 px-3 md:px-4 rounded-lg border border-white/10 opacity-60">
                                    <Globe className="w-2 h-2 md:w-3 md:h-3 text-[#d4af37]" />
                                    <p className="text-[7px] md:text-[9px] text-white/60 tracking-[0.1em] font-black uppercase">Verify.autolms.com</p>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Action Bar */}
                    <div className="p-6 bg-[#131415] border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 px-10">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center">
                                <ShieldCheck className="w-6 h-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm font-black text-white">Authentic Credential</p>
                                <p className="text-xs text-white/40">This digital certificate is cryptographically verified.</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <Button
                                variant="outline"
                                onClick={onClose}
                                className="flex-1 md:flex-none bg-white/5 border-white/10 hover:bg-white/10 text-white rounded-xl h-12"
                            >
                                <X className="w-4 h-4 mr-2" />
                                Close
                            </Button>
                            <Button
                                onClick={downloadPDF}
                                className="flex-1 md:flex-none bg-gradient-to-r from-[#d4af37] to-[#926d00] hover:from-[#f7ef8a] hover:to-[#d4af37] text-black font-black uppercase text-xs tracking-widest h-12 px-8 rounded-xl shadow-lg shadow-[#d4af37]/20 group transition-all"
                            >
                                <Download className="w-4 h-4 mr-2 group-hover:-translate-y-1 transition-transform" />
                                Download Final PDF
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
