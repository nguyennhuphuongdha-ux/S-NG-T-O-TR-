export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

export interface IncidentDetails {
  involvedNames?: string;
  description: string;
  timeOccurred: string;
  locationOccurred: string;
}

export interface SurveyResponse {
  id: string;
  timestamp: Date;
  grade: string; // e.g. "Khối 6", "Khối 7", "Khối 8", "Khối 9"
  className: string; // e.g. "6A1", "7B2"
  answers: {
    q1: number; // Trêu chọc
    q2: number; // Cô lập
    q3: number; // Mạng xã hội
    q4: number; // Sợ hãi
    q5: number; // Không có người chia sẻ
  };
  customStory?: string; // Tâm sự tự do của học sinh
  incidentDetails?: IncidentDetails; // Thông tin vụ việc bắt nạt cụ thể
  totalScore: number;
  riskLevel: RiskLevel;
  aiComments: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'RESOLVED';
  teacherNotes?: string;
}

export interface Question {
  id: string;
  text: string;
  minLabel: string;
  maxLabel: string;
}

export interface ClassStat {
  className: string;
  grade: string;
  totalResponses: number;
  lowCount: number;
  mediumCount: number;
  highCount: number;
}
