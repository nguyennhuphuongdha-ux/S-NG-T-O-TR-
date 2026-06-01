import React, { useState } from 'react';
import { SURVEY_QUESTIONS } from '../mockData';
import { Question } from '../types';
import { ShieldCheck, ArrowRight, ArrowLeft, Heart, Smile, Sparkles } from 'lucide-react';

interface SurveyViewProps {
  onBack: () => void;
  onSubmit: (response: {
    grade: string;
    className: string;
    answers: { [key: string]: number };
    customStory: string;
    incidentDetails?: {
      involvedNames?: string;
      description: string;
      timeOccurred: string;
      locationOccurred: string;
    };
  }) => void;
}

const GRADES = ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'];
const CLASS_MAPPING: { [key: string]: string[] } = {
  'Khối 6': ['6A1', '6A2', '6A3', '6A4'],
  'Khối 7': ['7B1', '7B2', '7B3', '7B4'],
  'Khối 8': ['8C1', '8C2', '8C3', '8C4'],
  'Khối 9': ['9D1', '9D2', '9D3', '9D4']
};

export default function SurveyView({ onBack, onSubmit }: SurveyViewProps) {
  const [selectedGrade, setSelectedGrade] = useState('Khối 6');
  const [className, setClassName] = useState('6A1');
  const [answers, setAnswers] = useState<{ [id: string]: number }>({
    q1: 3,
    q2: 3,
    q3: 3,
    q4: 3,
    q5: 3,
  });
  const [customStory, setCustomStory] = useState('');
  const [errors, setErrors] = useState<string>('');

  // Optional Incident details state
  const [hasIncident, setHasIncident] = useState(false);
  const [involvedNames, setInvolvedNames] = useState('');
  const [incidentDesc, setIncidentDesc] = useState('');
  const [incidentTime, setIncidentTime] = useState('');
  const [incidentLoc, setIncidentLoc] = useState('');

  const handleScoreChange = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleGradeChange = (grade: string) => {
    setSelectedGrade(grade);
    const classes = CLASS_MAPPING[grade];
    if (classes && classes.length > 0) {
      setClassName(classes[0]);
    }
  };

  const getEmojiForScore = (score: number, questionId: string) => {
    if (questionId === 'q5') {
      switch (score) {
        case 1: return { emoji: '🤗', label: 'Rất nhiều chỗ dựa', color: 'text-teal-700 bg-teal-50 border-teal-250' };
        case 2: return { emoji: '😊', label: 'Có người lắng nghe', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
        case 3: return { emoji: '😐', label: 'Bình thường', color: 'text-amber-700 bg-amber-50 border-amber-200' };
        case 4: return { emoji: '😟', label: 'Hơi cô đơn', color: 'text-orange-700 bg-orange-50 border-orange-200' };
        case 5: return { emoji: '😭', label: 'Hoàn toàn một mình', color: 'text-rose-700 bg-rose-50 border-rose-250 font-bold' };
        default: return { emoji: '😐', label: 'Bình thường', color: 'text-gray-500 bg-gray-50 border-gray-200' };
      }
    }

    switch (score) {
      case 1: return { emoji: '😊', label: 'Không bao giờ', color: 'text-teal-700 bg-teal-50 border-teal-200' };
      case 2: return { emoji: '😐', label: 'Thỉnh thoảng', color: 'text-emerald-700 bg-emerald-50 border-emerald-100' };
      case 3: return { emoji: '😟', label: 'Đôi lúc có', color: 'text-amber-700 bg-amber-50 border-amber-200' };
      case 4: return { emoji: '😢', label: 'Thường xuyên', color: 'text-orange-700 bg-orange-50 border-orange-200' };
      case 5: return { emoji: '😭', label: 'Rất thường xuyên/Rất nặng nề', color: 'text-rose-700 bg-rose-50 border-rose-250 font-bold' };
      default: return { emoji: '😐', label: 'Bình thường', color: 'text-gray-500 bg-gray-50 border-gray-200' };
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!className) {
      setErrors('Vui lòng chọn hoặc nhập mã lớp học của em.');
      return;
    }
    if (hasIncident && !incidentDesc.trim()) {
      setErrors('Vui lòng điền mô tả sự việc bạo lực/bắt nạt cụ thể hoặc tắt tùy chọn báo cáo cụ thể.');
      return;
    }
    setErrors('');
    onSubmit({
      grade: selectedGrade,
      className,
      answers,
      customStory,
      incidentDetails: hasIncident ? {
        involvedNames: involvedNames.trim() || undefined,
        description: incidentDesc.trim(),
        timeOccurred: incidentTime.trim(),
        locationOccurred: incidentLoc.trim()
      } : undefined
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 bg-white rounded-3xl border border-slate-300 shadow-md mt-4">
      {/* Back link & Privacy notice */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-bold transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Quay lại Trang chủ</span>
        </button>
        <div className="flex items-center gap-2 px-3 py-1 bg-teal-50 text-[#1E40AF]-850 rounded-full text-xs font-bold border border-teal-250 shadow-sm">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Bảo mật danh tính hoàn toàn</span>
        </div>
      </div>

      <div className="text-center mb-8">
        <div className="inline-flex p-2.5 bg-blue-50 text-[#1E40AF] rounded-2xl mb-2 border border-blue-100">
          <Heart className="w-6 h-6 fill-blue-100" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Khảo Sát Chia Sẻ Trực Tuyến</h2>
        <p className="text-sm text-slate-500 mt-1 max-w-lg mx-auto">
          Các câu trả lời của em sẽ giúp trí tuệ nhân tạo (AI) nhận biết trạng thái, kết nối thầy cô giúp ích cho em tránh xa rắc rối và cô đơn.
        </p>
      </div>

      <form onSubmit={handleFormSubmit} className="space-y-8">
        
        {/* Section 1: Grade and Class Selection */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4">
          <h3 className="font-extrabold text-slate-700 text-sm tracking-wider uppercase flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#1E40AF] rounded-full"></span>
            Bước 1: Chọn Khối lớp và Lớp của em
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Khối lớp (Grade):</label>
              <div className="grid grid-cols-4 gap-2">
                {GRADES.map(grade => (
                  <button
                    key={grade}
                    type="button"
                    onClick={() => handleGradeChange(grade)}
                    className={`py-2 px-1 text-center font-bold rounded-xl text-sm transition cursor-pointer ${
                      selectedGrade === grade
                        ? 'bg-[#1E40AF] text-white shadow-sm'
                        : 'bg-white hover:bg-slate-100 border border-slate-300 text-slate-700'
                    }`}
                  >
                    {grade.replace('Khối ', 'K')}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1.5">Tên lớp học:</label>
              <select
                value={className}
                onChange={(e) => setClassName(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-sm text-slate-700 font-bold focus:outline-none focus:ring-2 focus:ring-[#1E40AF]"
              >
                {CLASS_MAPPING[selectedGrade]?.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Core Survey Questions */}
        <div className="space-y-6">
          <h3 className="font-extrabold text-slate-700 text-sm tracking-wider uppercase flex items-center gap-2">
            <span className="w-1.5 h-4 bg-[#1E40AF] rounded-full"></span>
            Bước 2: Trả lời các câu hỏi bằng cách chọn mức độ từ 1 đến 5
          </h3>

          <div className="space-y-6">
            {SURVEY_QUESTIONS.map((question: Question, idx: number) => {
              const currentScore = answers[question.id] || 3;
              const emojiDetails = getEmojiForScore(currentScore, question.id);

              return (
                <div key={question.id} className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:border-[#1E40AF] transition duration-200">
                  <div className="flex items-start gap-3">
                    <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-blue-50 text-[#1E40AF] text-sm font-extrabold shrink-0 border border-blue-100">
                      {idx + 1}
                    </span>
                    <p className="font-bold text-slate-800 text-sm sm:text-base leading-snug">
                      {question.text}
                    </p>
                  </div>

                  {/* Range Labels */}
                  <div className="flex justify-between items-center text-xs font-bold text-slate-500 mt-4 px-2">
                    <span className="text-left w-1/3 text-slate-500">{question.minLabel}</span>
                    <span className="text-right w-1/3 text-slate-500">{question.maxLabel}</span>
                  </div>

                  {/* 1-5 Scale Radio Matrix */}
                  <div className="grid grid-cols-5 gap-2.5 mt-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => handleScoreChange(question.id, level)}
                        className={`py-3.5 rounded-xl border flex flex-col items-center gap-1 transition-all relative cursor-pointer ${
                          currentScore === level
                            ? 'bg-blue-50/50 border-[#1E40AF] text-[#1E40AF] scale-[1.02] shadow-sm font-bold ring-2 ring-[#1E40AF]/10'
                            : 'border-slate-200 hover:bg-slate-50 hover:border-slate-300 text-slate-600'
                        }`}
                      >
                        <span className={`text-xl sm:text-2xl transition ${currentScore === level ? 'scale-110 animate-pulse' : 'opacity-70'}`}>
                          {getEmojiForScore(level, question.id).emoji}
                        </span>
                        <span className="text-xs font-bold">{level}</span>
                      </button>
                    ))}
                  </div>

                  {/* Selected Indicator Pill */}
                  <div className="flex justify-end mt-3">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${emojiDetails.color}`}>
                      <span>Lựa chọn của em: {currentScore} điểm - {emojiDetails.label}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 3: Open-Ended Personal Story */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-indigo-600 rounded-full"></span>
            <label htmlFor="custom-story" className="font-extrabold text-slate-700 text-sm tracking-wider uppercase">
              Bước 3: Gửi gắm tâm sự, câu chuyện của em (Không bắt buộc)
            </label>
          </div>
          
          <p className="text-xs text-slate-500 mt-1">
            Nếu có chuyện gì xảy ra khiến em buồn rầu, sợ hãi hoặc có bạn nào cư xử không tốt, em hãy viết cụ thể xuống đây nhé. AI sẽ đọc câu chuyện của em một cách bảo mật tuyệt đối. Em có thể viết tắt hoặc giấu tên các bạn nếu cảm thấy lo ngại.
          </p>

          <textarea
            id="custom-story"
            rows={4}
            value={customStory}
            onChange={(e) => setCustomStory(e.target.value)}
            placeholder="Ví dụ: Dạo này em cảm thấy buồn vì bị một số bạn trong lớp chế giễu ngoại hình và t tẩy chay không cho chơi chung trong giờ giải lao..."
            className="w-full bg-white border border-slate-300 rounded-2xl p-4 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent placeholder:text-slate-400 shadow-inner"
          />
        </div>

        {/* Section 4: Detailed Bullying Incident Report (Optional) */}
        <div className="bg-amber-50/40 p-5 rounded-2xl border border-amber-250 space-y-4 text-left">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-4 bg-amber-500 rounded-full"></span>
              <h3 className="font-extrabold text-slate-800 text-sm tracking-wider uppercase">
                Bước 4: Báo cáo vụ việc bắt nạt cụ thể (Khuyên dùng)
              </h3>
            </div>
            <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-bold">
              AI Cá Nhân Hóa Đề Xuất
            </span>
          </div>
          
          <p className="text-xs text-slate-600 leading-relaxed font-semibold">
            Nếu em vừa trải qua hoặc chứng kiến một vụ bắt nạt/bạo lực học đường cụ thể, hãy kích hoạt phần này để cung cấp thời gian, địa điểm, người liên quan. Hệ thống AI sẽ phân tích chi tiết mức độ nghiêm trọng và cung cấp cho em các giải pháp/thầy cô can thiệp an toàn và nhanh nhất.
          </p>

          <label className="flex items-center gap-3 p-3.5 bg-white border border-slate-300 hover:border-amber-400 rounded-xl cursor-pointer transition select-none shadow-xs">
            <input
              type="checkbox"
              checked={hasIncident}
              onChange={(e) => setHasIncident(e.target.checked)}
              className="w-4 h-4 text-amber-650 border-slate-300 rounded focus:ring-amber-500 cursor-pointer"
            />
            <span className="text-xs text-slate-800 font-bold">
              Kích hoạt: Báo cáo chi tiết vụ việc để AI phân tích và tăng mức phản ứng khẩn cấp
            </span>
          </label>

          {hasIncident && (
            <div className="space-y-4 pt-2 animate-fadeIn">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Tên người liên quan (nếu biết và muốn cung cấp):
                  </label>
                  <input
                    type="text"
                    value={involvedNames}
                    onChange={(e) => setInvolvedNames(e.target.value)}
                    placeholder="Ví dụ: Bạn Nam lớp 8, nhóm 3 học sinh hay chặn cổng..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">
                    Thời gian xảy ra (Ví dụ: Giờ ra chơi sáng thứ Ba, Tuần trước,...):
                  </label>
                  <input
                    type="text"
                    value={incidentTime}
                    onChange={(e) => setIncidentTime(e.target.value)}
                    placeholder="Ví dụ: Sáng thứ Năm sau tiết 3..."
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none font-bold"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700">
                  Địa điểm xảy ra vụ việc cụ thể:
                </label>
                <input
                  type="text"
                  value={incidentLoc}
                  onChange={(e) => setIncidentLoc(e.target.value)}
                  placeholder="Ví dụ: Căn tin, nhà vệ sinh tầng 2 nhà B, mạng xã hội Facebook..."
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none font-bold"
                />
              </div>

              <div className="space-y-1 bg-white p-3 rounded-xl border border-slate-200">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mô tả cụ thể diễn biến sự việc xảy ra <span className="text-rose-500">*</span>:
                </label>
                <textarea
                  rows={3}
                  value={incidentDesc}
                  onChange={(e) => setIncidentDesc(e.target.value)}
                  placeholder="Mô tả cụ thể chuyện gì đã xảy ra: đe dọa, bắt nạt thể chất, lấy đồ dùng học tập hay trấn lột tiền bạc,..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#1E40AF] focus:border-transparent outline-none font-medium"
                />
              </div>

            </div>
          )}
        </div>

        {errors && (
          <div className="p-3 bg-rose-50 text-rose-700 text-sm rounded-xl border border-rose-200 font-bold">
            ⚠️ {errors}
          </div>
        )}

        {/* Submit Block */}
        <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-left">
            <h4 className="font-extrabold text-[#1E40AF] text-sm flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#1E40AF]" />
              Sẵn sàng gửi bản báo cáo khảo sát?
            </h4>
            <p className="text-xs text-blue-700 mt-0.5 font-medium">
              Hệ thống AI sẽ nhận kết quả, đo đạc mức độ nguy cơ nguy kịch học đường để chuyển về bảng thông tin thầy cô theo dõi ngay tức khắc.
            </p>
          </div>
          <button
            type="submit"
            className="w-full md:w-auto px-8 py-3.5 bg-[#1E40AF] hover:bg-blue-800 text-white rounded-xl font-bold shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
          >
            <span>Gửi Báo Cáo Khảo Sát</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>
    </div>
  );
}
