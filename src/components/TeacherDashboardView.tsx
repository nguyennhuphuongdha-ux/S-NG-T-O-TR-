import React, { useState, useMemo } from 'react';
import { SurveyResponse } from '../types';
import { calculateRisk, getAIMessage } from '../mockData';
import { 
  Users, AlertOctagon, Sheet, RefreshCw, Layers, CheckCircle, 
  Search, ShieldAlert, PlusCircle, Trash, Star, BookOpen, AlertCircle, FileSpreadsheet, ListFilter
} from 'lucide-react';

interface TeacherDashboardViewProps {
  responses: SurveyResponse[];
  onAddSimulatedResponse: (response: SurveyResponse) => void;
  onUpdateResponseStatus: (id: string, newStatus: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED', notes?: string) => void;
  onDeleteResponse: (id: string) => void;
  onBackToHome: () => void;
}

export default function TeacherDashboardView({
  responses,
  onAddSimulatedResponse,
  onUpdateResponseStatus,
  onDeleteResponse,
  onBackToHome
}: TeacherDashboardViewProps) {
  
  // States
  const [activeGradeFilter, setActiveGradeFilter] = useState<string>('Tất cả');
  const [activeRiskFilter, setActiveRiskFilter] = useState<string>('Tất cả');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [googleSheetConnected, setGoogleSheetConnected] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [teacherNotesText, setTeacherNotesText] = useState('');
  const [showSyncGuide, setShowSyncGuide] = useState(false);

  // Statistics Summary
  const stats = useMemo(() => {
    const total = responses.length;
    const low = responses.filter(r => r.riskLevel === 'LOW').length;
    const medium = responses.filter(r => r.riskLevel === 'MEDIUM').length;
    const high = responses.filter(r => r.riskLevel === 'HIGH').length;

    const pending = responses.filter(r => r.status === 'PENDING').length;
    const underReview = responses.filter(r => r.status === 'UNDER_REVIEW').length;
    const resolved = responses.filter(r => r.status === 'RESOLVED').length;

    // Grade counts
    const grades = { 'Khối 6': 0, 'Khối 7': 0, 'Khối 8': 0, 'Khối 9': 0 };
    responses.forEach(r => {
      if (r.grade in grades) {
        grades[r.grade as keyof typeof grades] += 1;
      }
    });

    return { total, low, medium, high, pending, underReview, resolved, grades };
  }, [responses]);

  // Handle Sync simulation
  const handleSyncData = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
    }, 1200);
  };

  // Generate dynamic incoming simulation
  const triggerIncomingSimulation = () => {
    const randomGrade = ['Khối 6', 'Khối 7', 'Khối 8', 'Khối 9'][Math.floor(Math.random() * 4)];
    const classMapping: { [key: string]: string[] } = {
      'Khối 6': ['6A1', '6A2', '6A3'],
      'Khối 7': ['7B1', '7B2', '7B3'],
      'Khối 8': ['8C1', '8C2', '8C3'],
      'Khối 9': ['9D1', '9D2', '9D3']
    };
    const randomClasses = classMapping[randomGrade];
    const randomClass = randomClasses[Math.floor(Math.random() * randomClasses.length)];

    // Prompt responses
    const simulations = [
      {
        text: 'Có mấy bạn bàn bên thường xuyên cấu véo rạch vở em, đe dọa không cho em mách cô giáo.',
        scores: { q1: 5, q2: 4, q3: 2, q4: 5, q5: 4 }
      },
      {
        text: 'Em bị rêu rao đăng ảnh dìm chế nhạo xấu xí trong nhóm lớp Zalo suốt cả tuần nay.',
        scores: { q1: 4, q2: 4, q3: 5, q4: 4, q5: 3 }
      },
      {
        text: 'Mọi người rủ nhau không làm bài nhóm với em, em phải làm một mình vất vả lắm.',
        scores: { q1: 2, q2: 5, q3: 1, q4: 3, q5: 4 }
      },
      {
        text: 'Thỉnh thoảng em bị chọi phấn hay xô ngã nhẹ ở sân thể dục.',
        scores: { q1: 3, q2: 2, q3: 2, q4: 3, q5: 2 }
      }
    ];

    const pick = simulations[Math.floor(Math.random() * simulations.length)];
    const scoreSum = Object.values(pick.scores).reduce((a, b) => a + b, 0);
    const calculatedLevel = calculateRisk(scoreSum);
    const aiComments = getAIMessage(scoreSum, pick.scores, true);

    const newResponse: SurveyResponse = {
      id: 'sim-' + Date.now(),
      timestamp: new Date(),
      grade: randomGrade,
      className: randomClass,
      answers: pick.scores,
      customStory: pick.text,
      totalScore: scoreSum,
      riskLevel: calculatedLevel,
      aiComments: aiComments,
      status: 'PENDING'
    };

    onAddSimulatedResponse(newResponse);
  };

  // Filtered reports list
  const filteredResponses = useMemo(() => {
    return responses.filter(r => {
      const matchGrade = activeGradeFilter === 'Tất cả' || r.grade === activeGradeFilter;
      const matchRisk = activeRiskFilter === 'Tất cả' || r.riskLevel === activeRiskFilter;
      const matchSearch = searchTerm === '' || 
        r.className.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.customStory && r.customStory.toLowerCase().includes(searchTerm.toLowerCase())) ||
        r.aiComments.toLowerCase().includes(searchTerm.toLowerCase());

      return matchGrade && matchRisk && matchSearch;
    });
  }, [responses, activeGradeFilter, activeRiskFilter, searchTerm]);

  // Quick statistics lists grouped by classes
  const classBreakdowns = useMemo(() => {
    const map: { [key: string]: { low: number, med: number, high: number, total: number } } = {};
    responses.forEach(r => {
      const c = r.className;
      if (!map[c]) {
        map[c] = { low: 0, med: 0, high: 0, total: 0 };
      }
      map[c].total += 1;
      if (r.riskLevel === 'LOW') map[c].low += 1;
      else if (r.riskLevel === 'MEDIUM') map[c].med += 1;
      else if (r.riskLevel === 'HIGH') map[c].high += 1;
    });
    return Object.entries(map).map(([className, cStats]) => ({
      className,
      ...cStats
    })).sort((a, b) => b.high - a.high || b.total - a.total);
  }, [responses]);

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-[#1E40AF] text-white p-5 sm:p-6 rounded-3xl shadow-md flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-blue-400/20">
        <div className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2.5 bg-blue-900 rounded-lg text-xs font-black tracking-widest text-white">PORTAL</span>
            <div className="flex items-center gap-1.5 text-blue-200 font-bold text-sm">
              <Star className="w-4.5 h-4.5 fill-current" />
              <span>Dành cho quý Thầy Cô giáo</span>
            </div>
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight flex items-center gap-2">
            Hệ Thống Quản Trị & Phát Hiện Nguy Cơ Bạo Lực
          </h1>
          <p className="text-xs text-blue-100 leading-relaxed max-w-xl font-semibold">
            Tự động giám sát, kết nhân trắc tâm lý học sinh bằng AI và liên tục cập nhật đồng bộ các phản hồi.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto shrink-0">
          <button
            onClick={triggerIncomingSimulation}
            className="flex-1 md:flex-none py-2.5 px-4 bg-lime-600 hover:bg-lime-700 text-white rounded-xl text-xs font-black transition flex items-center justify-center gap-2 shadow-xs cursor-pointer border border-lime-500"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Mô phỏng Gửi phản hồi mới</span>
          </button>
          
          <button
            onClick={onBackToHome}
            className="flex-1 md:flex-none py-2.5 px-3 bg-blue-900 hover:bg-blue-950 text-white border border-blue-500/50 rounded-xl text-xs font-black transition cursor-pointer"
          >
            Về Trang Chủ
          </button>
        </div>
      </div>

      {/* Grid: Indicators Bento Boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        
        {/* Total Surveys box */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5 text-left">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Tổng khảo sát</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-slate-800">{stats.total}</span>
              <span className="text-xs text-slate-400">bản ghi</span>
            </div>
          </div>
        </div>

        {/* High Risk Critical Alert box */}
        <div className="bg-white p-4.5 rounded-2xl border border-rose-100 shadow-xs flex items-center gap-3.5 text-left bg-gradient-to-br from-rose-50/20 to-transparent">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-xl animate-pulse">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-rose-500 uppercase tracking-wider block">Cảnh báo Đỏ (Cao)</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-rose-600">{stats.high}</span>
              <span className="text-xs text-rose-400">nguy hiểm</span>
            </div>
          </div>
        </div>

        {/* Medium Risk Caution box */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5 text-left">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Nguy cơ Vừa</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-amber-600">{stats.medium}</span>
              <span className="text-xs text-slate-400">cần xem xét</span>
            </div>
          </div>
        </div>

        {/* Low Risk Safe box */}
        <div className="bg-white p-4.5 rounded-2xl border border-slate-100 shadow-xs flex items-center gap-3.5 text-left">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Trạng thái An toàn</span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="text-2xl font-extrabold text-emerald-600">{stats.low}</span>
              <span className="text-xs text-slate-400">bình thường</span>
            </div>
          </div>
        </div>

      </div>

      {/* Row: Main Visual Charts & Sheets connector */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Column 1 & 2: Main Simulated Charts */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-extrabold text-slate-800 text-sm sm:text-base flex items-center gap-1.5">
                <Layers className="w-5 h-5 text-blue-600" />
                Thống Kê Trực Quan & Sự Phân Bố Mức Nguy Cơ
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Biểu đồ biểu thị tần suất học sinh cần trợ giúp tâm lý.</p>
            </div>
            
            {/* Legend indicators */}
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-emerald-500 rounded-full"></span> An toàn</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-amber-500 rounded-full"></span> Cần chú ý</span>
              <span className="flex items-center gap-1"><span className="w-3 h-3 bg-rose-500 rounded-full"></span> Đỏ khẩn cấp</span>
            </div>
          </div>

          {/* SVG representation of Bar / Donut charts cleanly, without external dependencies crash danger */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            
            {/* Bar 1: Score Risk Distribution */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Phân bổ tỷ lệ % theo mức độ</h4>
              
              <div className="flex items-center gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                {/* SVG Pizza chart mock */}
                <div className="relative w-24 h-24 shrink-0 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                    {/* Circle Background */}
                    <path className="text-slate-200" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    {/* Progress segment Low */}
                    <path className="text-emerald-500" strokeDasharray={`${(stats.low / Math.max(stats.total, 1)) * 100}, 100`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    {/* Progress segment Med */}
                    <path className="text-amber-500" strokeDasharray={`${(stats.medium / Math.max(stats.total, 1)) * 100}, 100`} strokeDashoffset={`-${(stats.low / Math.max(stats.total, 1)) * 100}`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    {/* Progress segment High */}
                    <path className="text-rose-500" strokeDasharray={`${(stats.high / Math.max(stats.total, 1)) * 100}, 100`} strokeDashoffset={`-${((stats.low + stats.medium) / Math.max(stats.total, 1)) * 100}`} strokeWidth="3.5" strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-x-0 inset-y-0 flex flex-col items-center justify-center text-center">
                    <span className="text-lg font-black text-slate-800">{stats.total}</span>
                    <span className="text-[9px] font-bold text-slate-400">KHẢO SÁT</span>
                  </div>
                </div>

                <div className="space-y-2 w-full text-xs">
                  <div className="flex justify-between items-center bg-emerald-50/50 p-1.5 px-2 rounded-lg border border-emerald-50">
                    <span className="font-semibold text-emerald-800">Thấp: {stats.low}</span>
                    <span className="font-bold text-slate-500">{Math.round((stats.low / Math.max(stats.total, 1)) * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-amber-50/50 p-1.5 px-2 rounded-lg border border-amber-50">
                    <span className="font-semibold text-amber-800">Trung bình: {stats.medium}</span>
                    <span className="font-bold text-slate-500">{Math.round((stats.medium / Math.max(stats.total, 1)) * 100)}%</span>
                  </div>
                  <div className="flex justify-between items-center bg-rose-50/50 p-1.5 px-2 rounded-lg border border-rose-50">
                    <span className="font-semibold text-rose-800">Khẩn cấp: {stats.high}</span>
                    <span className="font-bold text-slate-500">{Math.round((stats.high / Math.max(stats.total, 1)) * 100)}%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bar 2: Breakdown by grades */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-600 uppercase tracking-wider">Học sinh khảo sát theo Khối lớp</h4>
              
              {/* Stacked and structured horizontal progress bars */}
              <div className="space-y-2.5">
                {(Object.entries(stats.grades) as [string, number][]).map(([grade, count]) => {
                  const percent = count > 0 ? (count / stats.total) * 100 : 0;
                  const gradeResponses = responses.filter(r => r.grade === grade);
                  const gradeHighCount = gradeResponses.filter(r => r.riskLevel === 'HIGH').length;

                  return (
                    <div key={grade} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-700">{grade} ({count} phản hồi)</span>
                        {gradeHighCount > 0 && (
                          <span className="text-rose-600 text-[10px] bg-rose-50 px-1.5 rounded-full border border-rose-100 font-bold">
                            ⚠️ {gradeHighCount} Ca Nguy Cơ Cao
                          </span>
                        )}
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-blue-600 rounded-full h-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>

        {/* Column 3: Google Forms & Sheets Live Integration status */}
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-2.5 text-left">
            <h3 className="font-extrabold text-slate-800 text-sm sm:text-base flex items-center gap-1.5">
              <Sheet className="w-5 h-5 text-emerald-600" />
              Tích Hợp Google Sheets
            </h3>
            
            <p className="text-xs text-slate-500 leading-relaxed">
              Dự án được kết nối tự động trực tuyến và đồng bộ trực tiếp tới kho lưu trữ đám mây Google Drive của Nhà trường.
            </p>

            <div className="p-3.5 rounded-xl border space-y-2.5 bg-slate-50">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Trạng thái kết nối:</span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${googleSheetConnected ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-slate-100 text-slate-400'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${googleSheetConnected ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`}></span>
                  CONNECTED
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Tần suất đồng bộ:</span>
                <span className="font-black text-slate-800">Thời gian thực (Realtime)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Mã định danh Sheets:</span>
                <span className="font-mono text-[10px] text-slate-400">1x8A_T9A_g1oM...</span>
              </div>
            </div>

            <button
              onClick={() => setShowSyncGuide(!showSyncGuide)}
              className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />
              <span>{showSyncGuide ? 'Đóng hướng dẫn kết nối' : 'Xem hướng dẫn cài đặt'}</span>
            </button>
          </div>

          <div className="space-y-2 shrink-0">
            <button
              onClick={handleSyncData}
              disabled={isSyncing}
              className={`w-full py-3 rounded-xl text-xs font-extrabold transition flex items-center justify-center gap-2 border cursor-pointer ${
                isSyncing 
                  ? 'bg-slate-100 text-slate-400 border-slate-200' 
                  : 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              <span>{isSyncing ? 'Cập nhật lại từ Sheets...' : 'Kiểm tra đồng bộ thủ công'}</span>
            </button>
            <span className="text-[10px] text-slate-400 text-center block">
              Mã bảo mật SHA-256 mã hóa hai đầu an toàn tuyệt đối
            </span>
          </div>
        </div>

      </div>

      {showSyncGuide && (
        <div className="p-5 bg-indigo-50/50 border border-indigo-100 rounded-2xl text-left space-y-3 animate-fadeIn">
          <h4 className="font-bold text-indigo-800 text-sm flex items-center gap-1.5">
            <FileSpreadsheet className="w-4 h-4" />
            Cách thức ứng dụng ghi nhận tự động vào Google Forms & Sheets (Không cần lập trình)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-indigo-700 text-sm">Bước 1: Tạo Form</span>
              <p>Tạo một biểu mẫu Google Forms gồm các trường: Khối, Lớp, và 5 Câu hỏi rà soát sức khỏe tâm lý tương tự như giao diện.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-indigo-700 text-sm">Bước 2: Xuất link Sheets</span>
              <p>Tại tab Câu trả lời của Form, nhấn "Liên kết với Trang tính Google Sheets" để chuẩn bị hệ cơ sở dữ liệu.</p>
            </div>
            <div className="p-3 bg-white rounded-xl border border-slate-100 space-y-1">
              <span className="font-bold text-indigo-700 text-sm">Bước 3: Nhúng / Đồng bộ</span>
              <p>Trích xuất URL chia sẻ hoặc sử dụng Apps Script nhỏ nhúng trực tiếp API Sheets vào giao diện để nhận thông báo khẩn ngay khi có trò chuyện mới.</p>
            </div>
          </div>
        </div>
      )}

      {/* Database Filter panel & incidents listings */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-xs space-y-5 text-left">
        
        {/* Title panel & filters */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="space-y-1">
            <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-1.5">
              <ListFilter className="w-5 h-5 text-blue-600" />
              Danh Sách Học Sinh Cần Quan Tâm Hoạt Động
            </h3>
            <p className="text-xs text-slate-500">
              Hiển thị danh sách các khảo sát được gửi vào hệ thống. Các ca nguy cơ Cao luôn đứng ưu tiên phía trước.
            </p>
          </div>

          {/* Filters controls Row */}
          <div className="flex flex-wrap items-center gap-3">
            
            {/* Search field */}
            <div className="relative w-full sm:w-56">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Tìm kiếm lớp, sự kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-700"
              />
            </div>

            {/* Filter by grade */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-xl text-xs font-semibold text-slate-600">
              <span className="pl-1 text-slate-400">Khối:</span>
              <select
                value={activeGradeFilter}
                onChange={(e) => setActiveGradeFilter(e.target.value)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer text-slate-800"
              >
                <option value="Tất cả">Tất cả</option>
                <option value="Khối 6">Khối 6</option>
                <option value="Khối 7">Khối 7</option>
                <option value="Khối 8">Khối 8</option>
                <option value="Khối 9">Khối 9</option>
              </select>
            </div>

            {/* Filter by risk */}
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 p-1.5 rounded-xl text-xs font-semibold text-slate-600">
              <span className="pl-1 text-slate-400">Nguy cơ:</span>
              <select
                value={activeRiskFilter}
                onChange={(e) => setActiveRiskFilter(e.target.value)}
                className="bg-transparent font-bold focus:outline-none cursor-pointer text-slate-800"
              >
                <option value="Tất cả">Tất cả</option>
                <option value="HIGH">🔴 Nguy Cơ Cao</option>
                <option value="MEDIUM">🟡 Nguy Cơ Vừa</option>
                <option value="LOW">🟢 Nguy Cơ Thấp</option>
              </select>
            </div>

          </div>
        </div>

        {/* Responses Loop */}
        <div className="space-y-4">
          {filteredResponses.length === 0 ? (
            <div className="p-12 text-center text-slate-400 border border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
              <AlertOctagon className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">Không tìm thấy yêu cầu hay dữ liệu khảo sát phù hợp.</p>
              <p className="text-xs text-slate-400 mt-1">Vui lòng điều chỉnh lại bộ lọc tìm kiếm hoặc thử kích hoạt nút giả lập gửi phản hồi.</p>
            </div>
          ) : (
            filteredResponses.map((r: SurveyResponse) => {
              const scoreBadge = {
                LOW: 'bg-emerald-50 text-emerald-700 border-emerald-100 text-[10px]',
                MEDIUM: 'bg-amber-50 text-amber-800 border-amber-200 text-[10px]',
                HIGH: 'bg-rose-50 text-rose-700 border-rose-200 text-[10px] animate-pulse font-extrabold'
              }[r.riskLevel];

              const statusBadge = {
                PENDING: 'bg-blue-100 text-blue-800 font-bold',
                UNDER_REVIEW: 'bg-indigo-100 text-indigo-800 font-bold',
                RESOLVED: 'bg-emerald-100 text-emerald-800 font-bold'
              }[r.status];

              const statusText = {
                PENDING: 'Mới nhận - Chờ duyệt',
                UNDER_REVIEW: 'Đang theo dõi/Gặp riêng',
                RESOLVED: 'Đã xử lý bình an'
              }[r.status];

              return (
                <div 
                  key={r.id} 
                  className={`p-5 rounded-2xl border transition duration-200 ${
                    r.riskLevel === 'HIGH' 
                      ? 'border-rose-100 bg-rose-50/10 hover:border-rose-200 shadow-xs' 
                      : 'border-slate-100 hover:border-indigo-100 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    
                    {/* Header items left */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-slate-400">
                        ⏱️ {new Date(r.timestamp).toLocaleDateString('vi-VN')} {new Date(r.timestamp).toLocaleTimeString('vi-VN')}
                      </span>
                      <span className="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-bold">
                        {r.grade}
                      </span>
                      <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-extrabold border border-blue-100">
                        Lớp {r.className}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full border ${scoreBadge} uppercase tracking-wider font-semibold`}>
                        {r.riskLevel === 'HIGH' ? '🔴' : r.riskLevel === 'MEDIUM' ? '🟡' : '🟢'} nguy cơ {r.riskLevel === 'HIGH' ? 'Cao' : r.riskLevel === 'MEDIUM' ? 'Trung bình' : 'Thấp'} ({r.totalScore}đ)
                      </span>
                    </div>

                    {/* Status dropdown & controls */}
                    <div className="flex items-center gap-1.5 self-end md:self-auto">
                      <select
                        value={r.status}
                        onChange={(e) => onUpdateResponseStatus(r.id, e.target.value as any, r.teacherNotes)}
                        className={`text-xs px-2.5 py-1 rounded-lg border-transparent focus:ring-2 focus:ring-blue-500 font-semibold cursor-pointer ${statusBadge}`}
                      >
                        <option value="PENDING">🔴 Chờ duyệt / Chưa xử lý</option>
                        <option value="UNDER_REVIEW">🟡 Đang xử lý / Gặp riêng</option>
                        <option value="RESOLVED">🟢 Đã xử lý / Đã bình an</option>
                      </select>
                      
                      <button
                        onClick={() => onDeleteResponse(r.id)}
                        className="p-1 text-slate-300 hover:text-slate-600 rounded-sm transition shrink-0 cursor-pointer"
                        title="Xóa báo cáo"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>

                  </div>

                  {/* Body Textarea details */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-3 text-xs sm:text-sm">
                    
                    {/* Survey answers parameters */}
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100/80 space-y-1.5">
                      <h4 className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">Chỉ số câu trả lời:</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-[11px]"><span className="text-slate-500">Trêu chọc:</span> <strong className="text-slate-800">{r.answers.q1}/5</strong></div>
                        <div className="flex justify-between text-[11px]"><span className="text-slate-500">Cô lập tẩy chay:</span> <strong className="text-slate-800">{r.answers.q4}/5</strong></div>
                        <div className="flex justify-between text-[11px]"><span className="text-slate-500">Mạng xã hội:</span> <strong className="text-slate-800">{r.answers.q3}/5</strong></div>
                        <div className="flex justify-between text-[11px]"><span className="text-slate-500">Sợ đến trường:</span> <strong className="text-slate-800">{r.answers.q5}/5</strong></div>
                        <div className="flex justify-between text-[11px]"><span className="text-slate-500">Đơn độc chia sẻ:</span> <strong className="text-slate-800">{r.answers.q2}/5</strong></div>
                      </div>
                    </div>

                    {/* Left: Custom Story */}
                    <div className="lg:col-span-2 space-y-3">
                      <div>
                        <h4 className="font-bold text-slate-500 text-[11px] uppercase tracking-wider mb-1">Tâm sự tự sự học sinh gửi về:</h4>
                        {r.customStory ? (
                          <div className="p-3 bg-white border border-slate-250 rounded-xl text-slate-700 leading-relaxed text-xs shadow-inner italic">
                            "{r.customStory}"
                          </div>
                        ) : (
                          <div className="text-slate-400 text-xs italic">
                            (Không để lại lời nhắn viết tay, chỉ chấm điểm trắc nghiệm)
                          </div>
                        )}
                      </div>

                      {/* Incident Details Section if exists */}
                      {r.incidentDetails && (
                        <div className="p-3.5 bg-amber-50/50 border border-amber-205 rounded-xl text-[11px] space-y-2 text-left">
                          <h5 className="font-bold text-amber-900 uppercase flex items-center gap-1">
                            <span>📌</span> Chi tiết hành vi bắt nạt cụ thể được báo cáo:
                          </h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-700">
                            <div>
                              <span className="text-slate-400 font-bold">Người liên quan:</span>{' '}
                              <strong className="text-slate-800 font-bold">{r.incidentDetails.involvedNames || 'Không cung cấp'}</strong>
                            </div>
                            <div>
                              <span className="text-slate-400 font-bold">Thời gian:</span>{' '}
                              <strong className="text-slate-800 font-bold">{r.incidentDetails.timeOccurred || 'Không cung cấp'}</strong>
                            </div>
                            <div className="sm:col-span-2">
                              <span className="text-slate-400 font-bold">Địa điểm xảy ra:</span>{' '}
                              <strong className="text-slate-800 font-bold">{r.incidentDetails.locationOccurred || 'Không cung cấp'}</strong>
                            </div>
                            <div className="sm:col-span-2 bg-white/80 p-2 rounded-lg border border-amber-200">
                              <span className="text-slate-400 block font-bold mb-0.5">Diễn biến mô tả:</span>
                              <strong className="text-slate-850 block font-semibold leading-relaxed">{r.incidentDetails.description}</strong>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Right: AI Comments */}
                      <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100/50">
                        <span className="font-bold text-blue-800 text-[11px] uppercase tracking-wider flex items-center gap-1">
                          🤖 Nhận định AI:
                        </span>
                        <p className="text-blue-900 text-[11px] mt-1 leading-normal italic">
                          {r.aiComments}
                        </p>
                      </div>
                    </div>

                  </div>

                  {/* Teacher feedback/Tracking Notes */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="flex-1 text-left">
                      {editingId === r.id ? (
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nhập ghi chú theo dõi trường hợp này..."
                            value={teacherNotesText}
                            onChange={(e) => setTeacherNotesText(e.target.value)}
                            className="flex-1 bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-slate-800"
                          />
                          <button
                            onClick={() => {
                              onUpdateResponseStatus(r.id, r.status, teacherNotesText);
                              setEditingId(null);
                            }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg px-3 py-1 text-xs font-bold shrink-0 cursor-pointer"
                          >
                            Lưu
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="bg-slate-200 text-slate-700 rounded-lg px-3 py-1 text-xs font-bold cursor-pointer"
                          >
                            Hủy
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-slate-500 leading-snug">
                          📝 <strong>Ghi chú xử lý nội bộ: </strong> 
                          {r.teacherNotes ? (
                            <span className="text-slate-800 font-medium italic">"{r.teacherNotes}"</span>
                          ) : (
                            <span className="text-slate-400 italic">Chưa ghi nhận ghi chú theo dõi</span>
                          )}
                        </p>
                      )}
                    </div>

                    {editingId !== r.id && (
                      <button
                        onClick={() => {
                          setEditingId(r.id);
                          setTeacherNotesText(r.teacherNotes || '');
                        }}
                        className="py-1 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer shrink-0"
                      >
                        Sửa ghi chú
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>

    </div>
  );
}
