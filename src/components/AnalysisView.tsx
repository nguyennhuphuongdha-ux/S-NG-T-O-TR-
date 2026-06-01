import React, { useEffect, useState } from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Heart, AlertTriangle, MessageCircle } from 'lucide-react';

interface AnalysisViewProps {
  score: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  aiComments: string;
  onNext: () => void;
}

export default function AnalysisView({ score, riskLevel, aiComments, onNext }: AnalysisViewProps) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const steps = [
    '🔐 Đang bảo mật mã hóa thông tin của em...',
    '📊 Đang ghi nhận & tính tổng số điểm khảo sát...',
    '🧠 Đang kích hoạt phân tích AI ngôn ngữ dựa trên Thang Sức Khỏe Tinh Thần...',
    '💡 Đang biên soạn lời khuyên học đường bảo vệ em...'
  ];

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (loadingStep < steps.length) {
      timer = setTimeout(() => {
        setLoadingStep(prev => prev + 1);
      }, 1200);
    } else {
      setIsDone(true);
    }
    return () => clearTimeout(timer);
  }, [loadingStep]);

  // Styling based on risk level
  const theme = {
    LOW: {
      bg: 'from-emerald-50 to-teal-50/50 border-emerald-100',
      text: 'text-emerald-800',
      badge: 'bg-emerald-100 text-emerald-800 border-emerald-200',
      title: 'Nguy Cơ Thấp (An Toàn)',
      desc: 'Môi trường học tập bình thường lành mạnh. Em có bộ lọc tâm lý tốt vững chãi.',
      scoreBg: 'bg-emerald-500',
      percentage: 'w-1/4'
    },
    MEDIUM: {
      bg: 'from-amber-50 to-orange-50/50 border-amber-100',
      text: 'text-amber-800',
      badge: 'bg-amber-100 text-amber-800 border-amber-200',
      title: 'Nguy Cơ Trung Bình (Cần Chú Ý)',
      desc: 'Có dấu hiệu xích mích hoặc trêu đùa quá trớn. Em cần được hướng dẫn bảo vệ bản thân và chia sẻ nhiều hơn.',
      scoreBg: 'bg-amber-500',
      percentage: 'w-2/3'
    },
    HIGH: {
      bg: 'from-rose-50 to-red-50/50 border-rose-100',
      text: 'text-rose-800',
      badge: 'bg-rose-100 text-rose-800 border-rose-200 animate-pulse',
      title: 'Nguy Cơ Cao (Khẩn Cấp)',
      desc: 'Tình trạng bắt nạt học đường hoặc đe dọa trực tuyến đang ở mức báo động lớn. Em đang rất áp lực, cần có sự trợ giúp kịp thời ngay.',
      scoreBg: 'bg-rose-500',
      percentage: 'w-full'
    }
  }[riskLevel];

  if (!isDone) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-3xl border border-slate-300 shadow-md mt-4 text-center min-h-[50vh] flex flex-col justify-center items-center">
        <div className="relative mb-6">
          <div className="w-16 h-16 border-4 border-blue-100 border-t-[#1E40AF] rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center text-[#1E40AF]">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
        </div>

        <h3 className="text-xl font-black text-slate-800 animate-pulse">Trí tuệ nhân tạo (AI) đang phân tích...</h3>
        <p className="text-xs text-slate-500 mt-1 max-w-sm">
          Vui lòng đợi giây lát, hệ thống đang bảo mật đầu vào và khởi động mô đun chấm điểm tự động.
        </p>

        {/* Loading Steps status container */}
        <div className="mt-8 space-y-3 w-full max-w-md bg-slate-50 p-4 rounded-2xl border border-slate-200 text-left">
          {steps.map((step, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs sm:text-sm">
              <span className="shrink-0">
                {idx < loadingStep ? '✅' : idx === loadingStep ? '🔄' : '⏳'}
              </span>
              <span className={`font-bold ${idx === loadingStep ? 'text-[#1E40AF] font-black animate-pulse' : idx < loadingStep ? 'text-slate-700' : 'text-slate-450'}`}>
                {step}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 bg-white rounded-3xl border border-slate-300 shadow-md mt-4 space-y-6">
      
      {/* Title */}
      <div className="text-center">
        <div className="inline-flex p-3 bg-indigo-50 text-[#1E40AF] rounded-2xl mb-2 border border-indigo-100">
          <Sparkles className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Kết Quả Phân Tích Thực Trạng Tự Động</h2>
        <p className="text-sm text-slate-500 mt-1">
          Bản ghi báo cáo đã được chuyển cho hệ thống an toàn thông tin chuyên khoa tư vấn học đường.
        </p>
      </div>

      {/* Main Scoring Meter & Risk badge card */}
      <div className={`p-6 bg-gradient-to-br ${theme.bg} border-2 rounded-2xl space-y-4`}>
        
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left space-y-1">
            <div className={`inline-flex px-3.5 py-1 rounded-full text-xs font-black border ${theme.badge} uppercase tracking-wider`}>
              {theme.title}
            </div>
            <p className="text-xs text-slate-600 pt-1 font-medium">
              Thang điểm đánh giá: <strong>0 – 25 điểm</strong>
            </p>
          </div>

          {/* Huge circle score */}
          <div className="flex items-center gap-2">
            <div className="text-center">
              <span className="text-5xl font-black text-slate-800">{score}</span>
              <span className="text-slate-400 text-lg font-bold">/25</span>
            </div>
            <div className="text-xs text-slate-400 font-bold text-left border-l border-slate-300 pl-2">
              Điểm số<br/>nguy cơ
            </div>
          </div>
        </div>

        {/* Progress Bar visualizer */}
        <div className="space-y-1.5">
          <div className="h-3 w-full bg-slate-200 rounded-full overflow-hidden">
            <div className={`h-full ${theme.scoreBg} transition-all duration-1000 ${theme.percentage} rounded-full`}></div>
          </div>
          <div className="flex justify-between items-center text-[10px] text-slate-500 font-bold px-0.5">
            <span>Nguy Cơ Thấp (0-10đ)</span>
            <span>Nguy Cơ Trung Bình (11-18đ)</span>
            <span>Nguy Cơ Cao (19-25đ)</span>
          </div>
        </div>

        <div className="p-4 bg-white/80 backdrop-blur-xs rounded-xl border border-white/50 text-slate-700 text-sm font-semibold leading-relaxed shadow-xs">
          {theme.desc}
        </div>
      </div>

      {/* AI Detailed Comments Block with speech bubbles */}
      <div className="p-5 bg-blue-50/40 rounded-2xl border border-blue-200/60 space-y-3">
        <h4 className="font-extrabold text-slate-800 text-xs sm:text-sm flex items-center gap-1.5 uppercase tracking-wider">
          <MessageCircle className="w-4 h-4 text-[#1E40AF]" />
          Nhận xét tự động từ Trí Tuệ Nhân Tạo (AI Support)
        </h4>

        <div className="relative bg-white p-4 rounded-xl border border-slate-200 text-sm text-slate-700 italic font-medium leading-relaxed shadow-xs">
          "{aiComments}"
          {/* subtle tail indicator for speech bubble */}
          <div className="absolute -top-2 left-6 w-3.5 h-3.5 bg-white border-l border-t border-slate-250 rotate-45"></div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1.5">
          <span className="flex items-center gap-1 font-bold">
            <ShieldCheck className="w-3.5 h-3.5 text-teal-600" /> Nhập liệu ẩm danh
          </span>
          <span className="font-mono">Phân tích lúc: {new Date().toLocaleTimeString('vi-VN')}</span>
        </div>
      </div>

      {/* Encouragement / Call to Action to support view */}
      <div className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-left flex items-start gap-3">
          <div className="p-2.5 bg-rose-50 text-rose-500 rounded-xl shrink-0 border border-rose-100">
            <Heart className="w-5 h-5 fill-rose-150" />
          </div>
          <div>
            <h4 className="font-bold text-slate-800 text-sm">Xem ngay chỉ dẫn y học tư vấn tâm lý</h4>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Chúng tôi đã thiết kế những bước thực hành ngắn, lời khuyên an tâm và số cứu viện để hỗ trợ em ngay lập tức.
            </p>
          </div>
        </div>
        <button
          onClick={onNext}
          className="w-full md:w-auto px-6 py-4 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-md active:scale-95 transition cursor-pointer"
        >
          <span>Xem Lời Khuyên Hỗ Trợ</span>
          <ArrowRight className="w-4.5 h-4.5" />
        </button>
      </div>

    </div>
  );
}
