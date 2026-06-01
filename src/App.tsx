import React, { useState } from 'react';
import HomeView from './components/HomeView';
import SurveyView from './components/SurveyView';
import AnalysisView from './components/AnalysisView';
import SupportView from './components/SupportView';
import TeacherDashboardView from './components/TeacherDashboardView';
import { INITIAL_MOCK_RESPONSES, calculateRisk, getAIMessage } from './mockData';
import { SurveyResponse, RiskLevel, IncidentDetails } from './types';
import { GraduationCap, ShieldAlert, Sparkles, Heart, Bell, Moon, Sun } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'survey' | 'analysis' | 'support' | 'dashboard'>('home');
  const [responses, setResponses] = useState<SurveyResponse[]>(INITIAL_MOCK_RESPONSES);
  
  // Student active session state
  const [activeScore, setActiveScore] = useState<number>(0);
  const [activeRiskLevel, setActiveRiskLevel] = useState<RiskLevel>('LOW');
  const [activeAIComments, setActiveAIComments] = useState<string>('');
  const [activeIncidentDetails, setActiveIncidentDetails] = useState<IncidentDetails | undefined>(undefined);

  // Active push alerts queue and modal views for teacher notifications
  const [activeAlerts, setActiveAlerts] = useState<SurveyResponse[]>([]);
  const [emailModalAlert, setEmailModalAlert] = useState<SurveyResponse | null>(null);

  // Unread alerts tracking count for the top bar
  const unreadCount = responses.filter(r => r.status === 'PENDING' && r.riskLevel === 'HIGH').length;

  const triggerHighRiskAlert = (record: SurveyResponse) => {
    // Play hazard dual chime sound
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      osc1.frequency.setValueAtTime(800, audioCtx.currentTime);
      osc2.frequency.setValueAtTime(1200, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.04, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
      
      osc1.start();
      osc2.start();
      osc1.stop(audioCtx.currentTime + 0.6);
      osc2.stop(audioCtx.currentTime + 0.6);
    } catch (e) {
      // Audio support blocked or missing
    }
    setActiveAlerts(prev => [...prev, record]);
  };

  const handleStartSurvey = () => {
    setCurrentView('survey');
  };

  const handleGoToDashboard = () => {
    setCurrentView('dashboard');
  };

  const handleSurveySubmit = (studentResponse: {
    grade: string;
    className: string;
    answers: { [key: string]: number };
    customStory: string;
    incidentDetails?: IncidentDetails;
  }) => {
    const total = Object.values(studentResponse.answers).reduce((a, b) => a + b, 0);
    const hasDetails = !!(studentResponse.incidentDetails && studentResponse.incidentDetails.description.trim());
    const risk = calculateRisk(total, hasDetails);
    const comments = getAIMessage(total, studentResponse.answers, !!studentResponse.customStory, studentResponse.incidentDetails);

    // Save calculation to active session
    setActiveScore(total);
    setActiveRiskLevel(risk);
    setActiveAIComments(comments);
    setActiveIncidentDetails(studentResponse.incidentDetails);

    // Append to dashboard data to emulate Sheets realtime synchronisation
    const newRecord: SurveyResponse = {
      id: 'student-rep-' + Date.now(),
      timestamp: new Date(),
      grade: studentResponse.grade,
      className: studentResponse.className,
      answers: studentResponse.answers as any,
      customStory: studentResponse.customStory,
      incidentDetails: studentResponse.incidentDetails,
      totalScore: total,
      riskLevel: risk,
      aiComments: comments,
      status: 'PENDING'
    };

    setResponses(prev => [newRecord, ...prev]);

    // Simulated Realtime Notifications setup for teacher profiles
    if (risk === 'HIGH') {
      triggerHighRiskAlert(newRecord);
    }

    setCurrentView('analysis');
  };

  const handleAddSimulatedResponse = (simRecord: SurveyResponse) => {
    setResponses(prev => [simRecord, ...prev]);
    
    // Web Audio chime to signify live response
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      gainNode.gain.setValueAtTime(0.05, audioCtx.currentTime);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.15);
    } catch (e) {
      // Audio context might be blocked or missing
    }

    // Trigger high risk alerts in teacher/manager profile if simulation is High-Risk (Mức độ Đỏ)
    if (simRecord.riskLevel === 'HIGH') {
      triggerHighRiskAlert(simRecord);
    }
  };

  const handleUpdateResponseStatus = (id: string, newStatus: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED', notes?: string) => {
    setResponses(prev => prev.map(r => r.id === id ? { ...r, status: newStatus, teacherNotes: notes } : r));
  };

  const handleDeleteResponse = (id: string) => {
    setResponses(prev => prev.filter(r => r.id !== id));
  };

  const handleRestart = () => {
    setCurrentView('home');
    setActiveScore(0);
    setActiveRiskLevel('LOW');
    setActiveAIComments('');
    setActiveIncidentDetails(undefined);
  };

  return (
    <div className="min-h-screen bg-[#F0F4F8] text-slate-800 flex flex-col font-sans">
      
      {/* Top Banner Navigation bar with #1E40AF theme */}
      <header className="sticky top-0 z-50 bg-[#1E40AF] text-white px-4 py-3 sm:px-6 shadow-md shrink-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo Identity */}
          <div 
            onClick={handleRestart}
            className="flex items-center gap-2.5 cursor-pointer select-none shrink-0 group"
          >
            <div className="p-2.5 bg-white text-[#1E40AF] rounded-xl shadow-md transition group-hover:scale-105">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-white text-xs sm:text-base tracking-tight">AI SAFEGUARD • BẢO VỆ HỌC ĐƯỜNG</span>
                <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              </div>
              <p className="text-[10px] text-blue-200 font-bold uppercase tracking-wider hidden sm:block">Chẩn Đoán Bạo Lực Học Đường</p>
            </div>
          </div>

          {/* Quick toggle menus */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            
            {/* View indicators */}
            <div className="hidden md:flex items-center gap-1.5 p-1 bg-blue-900/40 rounded-lg mr-2">
              <button 
                onClick={handleRestart}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${currentView !== 'dashboard' ? 'bg-white text-[#1E40AF] shadow-xs' : 'text-blue-100 hover:text-white'}`}
              >
                Học sinh
              </button>
              <button 
                onClick={handleGoToDashboard}
                className={`px-3 py-1 rounded-md text-xs font-bold transition ${currentView === 'dashboard' ? 'bg-white text-[#1E40AF] shadow-xs' : 'text-blue-100 hover:text-white'}`}
              >
                Nhà trường & Giáo viên
              </button>
            </div>

            {/* Simulated Live status badge button */}
            <button
              onClick={handleGoToDashboard}
              className={`relative p-2.5 rounded-xl border transition flex items-center justify-center gap-1.5 cursor-pointer ${
                unreadCount > 0 
                  ? 'bg-rose-500/25 border-rose-300 text-white animate-pulse' 
                  : 'bg-blue-800/50 border-blue-400/50 text-blue-100 hover:bg-blue-800'
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white font-bold text-[9px] w-5 h-5 rounded-full flex items-center justify-center border-2 border-[#1E40AF] shadow-xs">
                  {unreadCount}
                </span>
              )}
              <span className="text-[11px] font-bold hidden sm:block">Thông báo Đỏ</span>
            </button>

            {currentView !== 'dashboard' ? (
              <button
                onClick={handleGoToDashboard}
                className="px-4 py-2 bg-blue-900 text-white hover:bg-blue-950 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer border border-blue-700"
              >
                Cổng Giáo Viên
              </button>
            ) : (
              <button
                onClick={handleRestart}
                className="px-4 py-2 bg-white text-[#1E40AF] hover:bg-blue-50 text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
              >
                Rà Soát (Học Sinh)
              </button>
            )}

          </div>

        </div>
      </header>

      {/* Main Container Workspace */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Render Active View State Container with simple animated fading effects */}
        <div id="active-workspace-view" className="transition-all duration-300">
          {currentView === 'home' && (
            <HomeView 
              onStartSurvey={handleStartSurvey} 
              onGoToDashboard={handleGoToDashboard} 
            />
          )}

          {currentView === 'survey' && (
            <SurveyView 
              onBack={handleRestart} 
              onSubmit={handleSurveySubmit} 
            />
          )}

          {currentView === 'analysis' && (
            <AnalysisView 
              score={activeScore}
              riskLevel={activeRiskLevel}
              aiComments={activeAIComments}
              onNext={() => setCurrentView('support')}
            />
          )}

          {currentView === 'support' && (
            <SupportView 
              riskLevel={activeRiskLevel}
              incidentDetails={activeIncidentDetails}
              onRestart={handleRestart}
            />
          )}

          {currentView === 'dashboard' && (
            <TeacherDashboardView 
              responses={responses}
              onAddSimulatedResponse={handleAddSimulatedResponse}
              onUpdateResponseStatus={handleUpdateResponseStatus}
              onDeleteResponse={handleDeleteResponse}
              onBackToHome={handleRestart}
            />
          )}
        </div>

      </main>

      {/* Automated High-Risk Alerts Toast Queue (Push Notifications) */}
      <div className="fixed top-18 right-4 z-55 max-w-sm w-full space-y-3 pointer-events-none">
        {activeAlerts.map(alert => (
          <div 
            key={alert.id}
            className="pointer-events-auto bg-slate-900 border border-rose-500 text-white rounded-2xl shadow-2xl p-4 flex flex-col gap-3 animate-slideIn"
          >
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-600 rounded-xl text-white shrink-0 animate-bounce">
                <Bell className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-left space-y-1">
                <span className="text-[10px] bg-rose-600 text-white font-black px-2 py-0.5 rounded-full tracking-wider uppercase">
                  PUSH NOTIFICATION • CẢNH BÁO ĐỎ
                </span>
                <h4 className="font-extrabold text-red-300 text-sm">
                  KHẨN CẤP: Nguy cơ CAO được phát hiện!
                </h4>
                <p className="text-[11px] text-slate-300 leading-snug">
                  Học sinh khối <strong>{alert.grade}</strong> (Lớp <strong>{alert.className}</strong>) vừa cập nhật phiếu rà soát sức khỏe tâm lý rủi ro cao ({alert.totalScore} điểm).
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-slate-800 pt-2.5">
              <button
                onClick={() => {
                  setEmailModalAlert(alert);
                  // Remove from active alerts queue
                  setActiveAlerts(prev => prev.filter(x => x.id !== alert.id));
                }}
                className="flex-1 py-1.5 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-[10px] font-black transition cursor-pointer text-center flex items-center justify-center gap-1"
              >
                📬 Xem Email Thầy Cô
              </button>
              <button
                onClick={() => {
                  handleGoToDashboard();
                  // Remove from active alerts queue
                  setActiveAlerts(prev => prev.filter(x => x.id !== alert.id));
                }}
                className="flex-1 py-1.5 px-3 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 rounded-lg text-[10px] font-bold transition cursor-pointer text-center"
              >
                📂 Cổng Quản Trị
              </button>
              <button
                onClick={() => {
                  setActiveAlerts(prev => prev.filter(x => x.id !== alert.id));
                }}
                className="text-slate-400 hover:text-white text-xs font-bold px-1.5 py-1 shrink-0"
              >
                Bỏ qua
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Simulated Email Warning Modal Client */}
      {emailModalAlert && (
        <div className="fixed inset-0 z-55 bg-slate-950/85 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl border border-slate-350 shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-scaleIn">
            
            {/* Email app bar header */}
            <div className="bg-slate-900 text-white p-4 px-5 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="ml-2 font-mono text-slate-300">CỔNG THÔNG BÁO KHẨN • OUTLOOK EMAIL CLIENT</span>
              </div>
              <button
                onClick={() => setEmailModalAlert(null)}
                className="text-slate-400 hover:text-white font-black text-sm cursor-pointer"
              >
                ✕ Đóng
              </button>
            </div>

            {/* Email header details */}
            <div className="bg-slate-50 p-4 border-b border-slate-200 space-y-2 text-left text-xs text-slate-600 font-semibold leading-relaxed">
              <div>
                <span className="text-slate-400 font-bold block">TỪ:</span>
                <span className="text-[#1E40AF] font-bold">Hệ thống AI Safeguard & Bảo vệ học đường Quốc gia &lt;alerts@safeguard.edu.vn&gt;</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">TỚI:</span>
                <span className="text-slate-900 font-bold">Ban Giám Hiệu & Giáo viên chủ nhiệm Lớp {emailModalAlert.className} & Phòng Tư vấn tâm lý học đường</span>
              </div>
              <div>
                <span className="text-slate-400 font-bold block">TIÊU ĐỀ:</span>
                <span className="text-rose-600 font-extrabold uppercase bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">
                  ⚠️ [CẢNH BÁO ĐỎ - KHẨN CẤP] PHÁT HIỆN HỌC SINH NGUY CƠ BẠO LỰC MỨC ĐỘ CAO - LỚP {emailModalAlert.className}
                </span>
              </div>
            </div>

            {/* Email Content scrollable */}
            <div className="p-6 overflow-y-auto text-left space-y-6 text-sm leading-relaxed text-slate-700">
              <div className="space-y-2.5">
                <p>Kính gửi quý Thầy Cô giáo và Ban Giám Hiệu nhà trường,</p>
                <p className="font-semibold text-slate-800">
                  Hệ thống Giám sát & Phát hiện Bạo lực học đường AI Safeguard vừa ghi nhận một khảo sát có chỉ số đánh giá sức khỏe tâm lý và nguy cơ tổn thương đạt mức <span className="text-rose-600 font-black underline animate-pulse">CẢNH BÁO ĐỎ (NGUY CƠ CAO)</span>.
                </p>
                <p>Dưới đây là thông tin tóm tắt phân tích hành vi và dữ liệu khảo sát liên quan của học sinh:</p>
              </div>

              {/* Patient report card styled */}
              <div className="bg-slate-50 border border-slate-300 rounded-2xl p-4.5 space-y-4 shadow-3xs">
                <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-600 pb-3 border-b border-slate-250">
                  <div>• Khối lớp: <strong className="text-slate-900 text-sm">{emailModalAlert.grade}</strong></div>
                  <div>• Lớp học học đường: <strong className="text-slate-900 text-sm">{emailModalAlert.className}</strong></div>
                  <div>• Điểm số bế tắc: <strong className="text-rose-600 text-base font-black">{emailModalAlert.totalScore} / 25 điểm</strong></div>
                  <div>• Thời điểm gửi: <strong>{new Date(emailModalAlert.timestamp).toLocaleString('vi-VN')}</strong></div>
                </div>

                {/* Score breakdown metrics matrix */}
                <div className="space-y-2">
                  <h5 className="font-bold text-slate-750 text-xs uppercase tracking-wider">Chỉ số câu hỏi khảo sát liên quan của học sinh:</h5>
                  <div className="grid grid-cols-5 gap-2 text-center">
                    <div className="bg-white p-2 border border-slate-205 rounded-xl">
                      <div className="text-[9px] text-slate-400 font-bold whitespace-nowrap overflow-hidden">Trêu chọc</div>
                      <div className="text-xs font-extrabold text-slate-800 mt-0.5">{emailModalAlert.answers.q1}/5</div>
                    </div>
                    <div className="bg-white p-2 border border-slate-205 rounded-xl">
                      <div className="text-[9px] text-slate-400 font-bold whitespace-nowrap overflow-hidden">Tẩy chay</div>
                      <div className="text-xs font-extrabold text-slate-800 mt-0.5">{emailModalAlert.answers.q2}/5</div>
                    </div>
                    <div className="bg-white p-2 border border-slate-205 rounded-xl">
                      <div className="text-[9px] text-slate-400 font-bold whitespace-nowrap overflow-hidden">Mạng xã hội</div>
                      <div className="text-xs font-extrabold text-slate-800 mt-0.5">{emailModalAlert.answers.q3}/5</div>
                    </div>
                    <div className="bg-white p-2 border border-slate-205 rounded-xl">
                      <div className="text-[9px] text-slate-400 font-bold whitespace-nowrap overflow-hidden">Sợ đến trường</div>
                      <div className="text-xs font-extrabold text-slate-800 mt-0.5">{emailModalAlert.answers.q4}/5</div>
                    </div>
                    <div className="bg-white p-2 border border-slate-205 rounded-xl">
                      <div className="text-[9px] text-slate-400 font-bold whitespace-nowrap overflow-hidden">Đơn độc</div>
                      <div className="text-xs font-extrabold text-slate-800 mt-0.5">{emailModalAlert.answers.q5}/5</div>
                    </div>
                  </div>
                </div>

                {/* Custom Story & Detailed Incident */}
                {emailModalAlert.customStory && (
                  <div className="space-y-1">
                    <h5 className="font-bold text-slate-755 text-xs uppercase tracking-wider">Tâm sự thêm của học sinh:</h5>
                    <div className="bg-white border border-slate-300 p-3 rounded-xl text-xs text-slate-700 italic">
                      "{emailModalAlert.customStory}"
                    </div>
                  </div>
                )}

                {emailModalAlert.incidentDetails && (
                  <div className="space-y-2 bg-amber-50/50 border border-amber-250 p-3.5 rounded-xl">
                    <h5 className="font-bold text-amber-900 text-xs uppercase tracking-wider flex items-center gap-1">
                      <span>📌</span> THÔNG TIN VỤ VIỆC BẮT NẠT CHI TIẾT ĐƯỢC CUNG CẤP:
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs leading-normal">
                      <div>
                        <span className="text-slate-500 font-bold">Người liên quan:</span>{' '}
                        <strong className="text-slate-900 font-extrabold">{emailModalAlert.incidentDetails.involvedNames || 'Không cung cấp'}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 font-bold">Thời gian:</span>{' '}
                        <strong className="text-slate-900 font-extrabold">{emailModalAlert.incidentDetails.timeOccurred || 'Không cung cấp'}</strong>
                      </div>
                      <div className="md:col-span-2">
                        <span className="text-slate-500 font-bold">Địa điểm xảy ra:</span>{' '}
                        <strong className="text-slate-900 font-extrabold">{emailModalAlert.incidentDetails.locationOccurred || 'Không cung cấp'}</strong>
                      </div>
                      <div className="md:col-span-2 bg-white p-2.5 rounded-lg border border-amber-200 mt-1">
                        <span className="text-slate-500 font-semibold block mb-0.5">Mô tả chi tiết diễn biến:</span>
                        <strong className="text-slate-800 block font-semibold leading-relaxed">{emailModalAlert.incidentDetails.description}</strong>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI comments summary */}
                <div className="bg-rose-50 border border-rose-200 p-3.5 rounded-xl text-xs space-y-1">
                  <h5 className="font-bold text-rose-800 flex items-center gap-1 uppercase tracking-wider">
                    <span>🤖</span> Nhận định tự động & Hướng xử lý từ AI:
                  </h5>
                  <p className="text-rose-900 italic font-semibold leading-relaxed">{emailModalAlert.aiComments}</p>
                </div>
              </div>

              {/* Emergency recommendations buttons */}
              <div className="space-y-3 border-t border-slate-100 pt-4">
                <h4 className="font-bold text-slate-800 text-xs uppercase tracking-wider">Đề xuất hành động khẩn thiết cho giáo viên quản lý:</h4>
                <ul className="list-disc pl-5 text-xs text-slate-600 space-y-1.5 font-semibold">
                  <li><span className="text-[#1E40AF]">Liên hệ bảo mật:</span> Gặp riêng học sinh một cách kín mật nhất để em không cảm thấy bị chú ý.</li>
                  <li><span className="text-[#1E40AF]">Không chất vấn tập thể:</span> Tuyệt đối không chất vấn lớp học trực tiếp gây sẹo tâm lý thêm cho học sinh.</li>
                  <li><span className="text-[#1E40AF]">Phối hợp giám sát:</span> Trao đổi với phụ huynh và phối hợp bảo vệ cổng trường rà soát đối tượng.</li>
                </ul>
              </div>
            </div>

            {/* Email footer actions */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-[10px] text-slate-400 font-bold">
                Mã báo cáo: ALERT-SYS-{emailModalAlert.id} • AI-ENVELOPE-DIGEST
              </span>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => {
                    handleGoToDashboard();
                    setEmailModalAlert(null);
                  }}
                  className="w-full sm:w-auto px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black transition active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>Mở Cổng Quản Trị</span>
                </button>
                <button
                  onClick={() => setEmailModalAlert(null)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-extrabold transition cursor-pointer"
                >
                  Đã giải quyết & Đóng
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Footer copyright and safety badge */}
      <footer className="bg-white border-t border-slate-100 py-6 text-center text-xs text-slate-400 space-y-2 mt-8">
        <div className="flex justify-center items-center gap-2">
          <GraduationCap className="w-5 h-5 text-blue-500" />
          <span className="font-extrabold text-slate-600">Phòng Phát triển Trí Tuệ Học Đường Quốc Gia</span>
        </div>
        <p className="max-w-md mx-auto leading-relaxed">
          Ứng dụng giáo dục phi lợi nhuận trợ giúp kết hợp bảo lãnh quyền an safe học đường cho lứa tuổi vị thành niên. Sử dụng mạng thần kinh AI phân loại rủi ro trầm cảm và bạo lực.
        </p>
        <p className="text-[10px] text-slate-300">
          © 2026 AI Protect & Google Cloud Network. All rights reserved.
        </p>
      </footer>

    </div>
  );
}
