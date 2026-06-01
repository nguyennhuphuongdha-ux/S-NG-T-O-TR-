import React from 'react';
import { ShieldAlert, Heart, ArrowRight, Activity, Sparkles, MessageCircleWarning, Lock } from 'lucide-react';
import { motion } from 'motion/react';

interface HomeViewProps {
  onStartSurvey: () => void;
  onGoToDashboard: () => void;
}

export default function HomeView({ onStartSurvey, onGoToDashboard }: HomeViewProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4 min-h-[80vh] bg-transparent">
      
      {/* Decorative spark backgrounds */}
      <div className="relative w-full max-w-4xl text-center">
        
        {/* Floating elements */}
        <div className="absolute top-0 left-10 text-blue-400/60 animate-bounce delay-100 hidden md:block">
          <Heart className="w-8 h-8 fill-blue-100/30" />
        </div>
        <div className="absolute bottom-10 right-10 text-blue-500/50 animate-pulse hidden md:block">
          <Sparkles className="w-8 h-8" />
        </div>

        {/* Dynamic Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-100 text-[#1E40AF] text-xs sm:text-sm font-bold mb-6 border border-blue-200">
          <Activity className="w-4 h-4 animate-pulse text-[#1E40AF]" />
          <span>Chiến dịch học đường không bạo lực 2026</span>
        </div>

        {/* App Logo Emblem */}
        <div className="relative flex justify-center mb-8">
          <div className="relative p-6 bg-gradient-to-br from-[#1E40AF] to-blue-700 text-white rounded-3xl shadow-xl shadow-blue-500/10">
            <ShieldAlert id="logo-shield" className="w-16 h-16" />
            <div className="absolute -bottom-2 -right-2 p-2.5 bg-rose-600 rounded-2xl shadow-lg border border-white text-white">
              <Heart className="w-6 h-6 fill-current" />
            </div>
          </div>
        </div>

        {/* Main Headings */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-800 tracking-tight leading-tight max-w-3xl mx-auto">
          Ứng Dụng <span className="text-[#1E40AF] bg-clip-text text-transparent bg-gradient-to-r from-[#1E40AF] to-blue-600">Phát Hiện Sớm</span> Nguy Cơ Bắt Nạt Học Đường
        </h1>
        
        <p className="mt-6 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Nơi gieo mầm sự sẻ chia, an toàn và bảo mật tuyệt đối. Hãy dành 2 phút giúp chúng tôi rà soát rủi ro bằng trí tuệ nhân tạo để kiến tạo môi trường lớp học chan hòa ước mơ.
        </p>

        {/* Key Features Icons Block */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-10 max-w-3xl mx-auto">
          <div className="flex flex-col items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-md">
            <div className="p-3 bg-blue-50 text-[#1E40AF] rounded-xl mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Ẩn danh 100%</h3>
            <p className="text-xs text-slate-500 text-center mt-1">Họ tên của em luôn được bảo mật tuyệt đối, không chia sẻ công khai.</p>
          </div>
          
          <div className="flex flex-col items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-md">
            <div className="p-3 bg-teal-50 text-teal-600 rounded-xl mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">AI Phân Tích</h3>
            <p className="text-xs text-slate-500 text-center mt-1">Tự động nhận diện mức độ cần hỗ trợ kịp thời để lắng nghe tâm sự.</p>
          </div>

          <div className="flex flex-col items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition hover:shadow-md">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-xl mb-3">
              <MessageCircleWarning className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm sm:text-base">Hỗ Trợ Tức Thì</h3>
            <p className="text-xs text-slate-500 text-center mt-1">Kết nối với thầy cô chủ nhiệm hoặc tổng đài bảo vệ trẻ em 111.</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12 mb-8">
          <button
            onClick={onStartSurvey}
            className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#1E40AF] to-blue-700 hover:from-blue-700 hover:to-blue-850 text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 text-base md:text-lg cursor-pointer"
          >
            Bắt đầu khảo sát ngay
            <ArrowRight className="w-5 h-5 animate-pulse" />
          </button>
          
          <button
            onClick={onGoToDashboard}
            className="w-full sm:w-auto px-6 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-2xl font-bold active:scale-95 transition-all text-sm md:text-base flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Dành cho Giáo viên & Quản trị</span>
          </button>
        </div>

        <div className="mt-8 text-xs text-slate-400 max-w-sm mx-auto p-3 bg-white rounded-xl border border-slate-200">
          🔒 Bảo mật an tâm và tuân thủ các chỉ số sức khỏe tinh thần học sinh của Bộ Giáo Dục & Đào Tạo.
        </div>

      </div>
    </div>
  );
}
