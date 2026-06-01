import React from 'react';
import { SPECIALIST_ADVICE } from '../mockData';
import { Heart, Phone, HelpCircle, School, ArrowLeft, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface SupportViewProps {
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  incidentDetails?: {
    involvedNames?: string;
    description: string;
    timeOccurred: string;
    locationOccurred: string;
  };
  onRestart: () => void;
}

export default function SupportView({ riskLevel, incidentDetails, onRestart }: SupportViewProps) {
  const advice = SPECIALIST_ADVICE[riskLevel];

  // Config mapping for styling/visual cues
  const theme = {
    LOW: {
      accent: 'emerald',
      bgColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      iconBg: 'bg-emerald-600 text-white',
      bannerTheme: 'from-[#1E40AF] via-blue-700 to-teal-600'
    },
    MEDIUM: {
      accent: 'amber',
      bgColor: 'bg-amber-50 text-amber-800 border-amber-250',
      iconBg: 'bg-amber-600 text-white',
      bannerTheme: 'from-[#1E40AF] via-amber-600 to-orange-600'
    },
    HIGH: {
      accent: 'rose',
      bgColor: 'bg-rose-50 text-rose-800 border-rose-250 font-bold',
      iconBg: 'bg-rose-600 text-white',
      bannerTheme: 'from-[#1E40AF] via-rose-600 to-red-650 animate-pulse'
    }
  }[riskLevel];

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-3xl border border-slate-300 shadow-md mt-4 space-y-8">
      
      {/* Visual Header card */}
      <div className={`p-6 sm:p-8 rounded-2xl bg-gradient-to-r ${theme.bannerTheme} text-white shadow-md relative overflow-hidden`}>
        {/* background blobs */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-6 -mt-6"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full blur-xl -ml-6 -mb-6"></div>

        <div className="relative flex flex-col sm:flex-row items-center gap-5">
          <div className="p-4 bg-white/10 backdrop-blur-xs rounded-2xl shrink-0">
            <Heart className="w-10 h-10 fill-current" />
          </div>
          <div className="text-center sm:text-left space-y-1.5">
            <h2 className="text-xl sm:text-2xl font-black tracking-tight">
              {advice.title}
            </h2>
            <p className="text-xs sm:text-sm text-blue-50/90 leading-relaxed font-bold max-w-xl">
              {advice.tagline}
            </p>
          </div>
        </div>
      </div>

      {/* Personalized AI Recommendations based on Incident Details */}
      {incidentDetails && (
        <div className="p-5.5 bg-amber-50/55 border border-amber-300 rounded-2xl shadow-xs text-left space-y-3.5">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-amber-600 rounded-lg text-[10px] font-black text-white uppercase tracking-wider">AI PERSONALIZED ADVICE</span>
            <h3 className="font-extrabold text-amber-900 text-sm sm:text-base">
              🔍 Giải Pháp Cá Nhân Hóa Đặc Biệt
            </h3>
          </div>
          
          <div className="text-xs text-slate-700 leading-relaxed space-y-2.5 font-medium">
            <p>
              Dựa trên thông tin về sự việc em báo cáo xảy ra{incidentDetails.timeOccurred ? ` vào [${incidentDetails.timeOccurred}]` : ''}{incidentDetails.locationOccurred ? ` tại [${incidentDetails.locationOccurred}]` : ''}, AI đề xuất kế hoạch an toàn cá nhân sau:
            </p>
            <div className="space-y-2 pl-1">
              {/* Cyberbullying smart checks */}
              {(incidentDetails.locationOccurred?.toLowerCase().includes('mạng') || 
                incidentDetails.locationOccurred?.toLowerCase().includes('facebook') || 
                incidentDetails.locationOccurred?.toLowerCase().includes('zalo') || 
                incidentDetails.locationOccurred?.toLowerCase().includes('messenger') || 
                incidentDetails.locationOccurred?.toLowerCase().includes('online')) ? (
                <div className="flex gap-2.5 items-start p-3 bg-white border border-amber-200 rounded-xl">
                  <span className="text-amber-600 font-bold">🌐 Bẫy mạng xã hội:</span>
                  <span>Hãy lập tức bấm Chặn (Block) hoặc tắt tính năng bình luận ẩn danh. Nhớ chụp màn hình lưu chứng cứ làm bằng chứng, tránh tranh cãi trực diện làm tăng bực tức cho những cá nhân đó.</span>
                </div>
              ) : (
                <div className="flex gap-2.5 items-start p-3 bg-white border border-amber-200 rounded-xl">
                  <span className="text-amber-600 font-bold">🏫 Đề phòng góc khuất:</span>
                  <span>Trong các khung thời gian nhạy cảm, em hãy đi học qua hành lang trung tâm có thầy cô, hoặc di chuyển cùng bạn bè thân thiết. Tránh tối đa việc đi một mình tại {incidentDetails.locationOccurred || 'các điểm vắng vẻ'}.</span>
                </div>
              )}

              {/* Involved names check */}
              {incidentDetails.involvedNames && (
                <div className="flex gap-2.5 items-start p-3 bg-white border border-amber-200 rounded-xl">
                  <span className="text-amber-600 font-bold">👥 Quản lý đối tượng:</span>
                  <span>Em đã cung cấp thông tin liên quan tới ({incidentDetails.involvedNames}). Thông tin này được chuyển kín mật trực tiếp tới Cổng Thầy Cô. Thầy cô sẽ bảo lưu danh tính cho em, gặp riêng các cá nhân này để có cuộc trò chuyện giáo huấn mà không làm ảnh hưởng tới sự an toàn của em.</span>
                </div>
              )}

              {/* General check */}
              <div className="flex gap-2.5 items-start p-3 bg-white border border-amber-200 rounded-xl">
                <span className="text-amber-600 font-bold">🛡️ Hành động khuyên dùng:</span>
                <span>Vụ việc: "{incidentDetails.description}" đã được chuyển hóa an toàn sang Cổng Quản Trị Đỏ. Em hãy duy trì tâm trạng thả lỏng, việc còn lại em hoàn toàn có thể tin tưởng vào quy trình giải quyết mật của nhà trường và chuyên gia tư vấn nhé!</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Core Recommendations bullets checklist */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-[#1E40AF] text-base sm:text-lg flex items-center gap-2">
          <span>📝</span> Lời khuyên thiết thực dành riêng cho em:
        </h3>
        
        <div className="grid grid-cols-1 gap-3.5">
          {advice.bullets.map((bullet, idx) => {
            // Check if bullet starts with bold format like **HÃY NÓI RA NGAY...**
            const hasBold = bullet.includes('**');
            let contentText = bullet;
            let boldPart = '';
            
            if (hasBold) {
              const parts = bullet.split('**');
              if (parts.length >= 3) {
                boldPart = parts[1];
                contentText = parts.slice(2).join('');
              }
            }

            return (
              <div key={idx} className="flex gap-3.5 p-4.5 bg-slate-50 border border-slate-200 rounded-2xl transition hover:border-[#1E40AF] duration-205">
                <div className="mt-0.5 shrink-0 text-[#1E40AF]">
                  <CheckCircle2 id={`bullet-check-${idx}`} className="w-5.5 h-5.5 fill-blue-50" />
                </div>
                <div className="text-slate-700 text-sm sm:text-base font-semibold leading-relaxed">
                  {hasBold ? (
                    <span>
                      <strong className="text-slate-900 font-black">{boldPart}</strong>
                      {contentText}
                    </span>
                  ) : (
                    <span>{bullet}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reassuring Hotlines contact boxes */}
      <div className="space-y-4 border-t border-slate-200 pt-6">
        <h3 className="font-extrabold text-[#1E40AF] text-base sm:text-lg flex items-center gap-2">
          <span>📞</span> Số điện thoại trợ giúp khẩn trợ bảo mật:
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Card 1: National Children Hotline */}
          <div className="p-4.5 bg-rose-50 border border-rose-200 rounded-2xl text-center space-y-3 relative hover:scale-[1.01] transition shadow-xs">
            <div className="flex justify-center">
              <span className="p-3 bg-rose-600 text-white rounded-full">
                <Phone className="w-5 h-5" />
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-850 text-sm">Tổng đài Trẻ em Quốc gia</h4>
              <p className="text-xs text-slate-550 mt-0.5 font-semibold">Hỗ trợ 24/7 bảo mật danh tính</p>
            </div>
            <div className="pt-1.5">
              <a href="tel:111" className="inline-flex px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white font-black text-lg rounded-xl shadow-xs transition cursor-pointer">
                Số 111
              </a>
            </div>
          </div>

          {/* Card 2: School Mental Counseling Department */}
          <div className="p-4.5 bg-blue-50 border border-blue-200 rounded-2xl text-center space-y-3 relative hover:scale-[1.01] transition shadow-xs">
            <div className="flex justify-center">
              <span className="p-3 bg-[#1E40AF] text-white rounded-full">
                <School className="w-5 h-5" />
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-850 text-sm">Phòng Tâm Lý Học Đường</h4>
              <p className="text-xs text-slate-550 mt-0.5 font-semibold">Gặp thầy cô tư vấn tại trường</p>
            </div>
            <div className="pt-1.5">
              <div className="inline-flex px-4 py-2 bg-[#1E40AF] font-bold text-white text-sm rounded-xl">
                Tầng 2 - Nhà A
              </div>
            </div>
          </div>

          {/* Card 3: School Hot line emergency */}
          <div className="p-4.5 bg-indigo-50 border border-indigo-200 rounded-2xl text-center space-y-3 relative hover:scale-[1.01] transition shadow-xs">
            <div className="flex justify-center">
              <span className="p-3 bg-indigo-650 text-white rounded-full">
                <HelpCircle className="w-5 h-5" />
              </span>
            </div>
            <div>
              <h4 className="font-bold text-slate-850 text-sm">Đường Dây Nóng Ban Giám Hiệu</h4>
              <p className="text-xs text-slate-550 mt-0.5 font-semibold">Tiếp nhận khiếu nại bạo lực</p>
            </div>
            <div className="pt-1.5">
              <a href="tel:0908765432" className="inline-flex px-4 py-2 bg-indigo-600 text-white font-black text-xs sm:text-sm rounded-xl hover:bg-indigo-700 transition cursor-pointer">
                090.876.5432
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom finish line */}
      <div className="pt-6 border-t border-slate-205 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Thông tin truyền đi mã hóa hoàn toàn bảo lãnh danh tính.</span>
        </div>
        
        <button
          onClick={onRestart}
          className="w-full sm:w-auto px-6 py-3 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 rounded-xl font-bold text-sm flex items-center justify-center gap-2 cursor-pointer transition active:scale-95"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại Trang chủ
        </button>
      </div>

    </div>
  );
}
