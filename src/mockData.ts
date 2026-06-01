import { Question, SurveyResponse, IncidentDetails } from './types';

export const SURVEY_QUESTIONS: Question[] = [
  {
    id: 'q1',
    text: 'Em có thường bị bạn bè trêu chọc, giễu cợt hay chế giễu không?',
    minLabel: 'Không bao giờ',
    maxLabel: 'Rất thường xuyên'
  },
  {
    id: 'q2',
    text: 'Em có cảm thấy mình bị ngó lơ, cô lập hoặc bị tẩy chay khỏi nhóm bạn không?',
    minLabel: 'Không bao giờ',
    maxLabel: 'Rất thường xuyên'
  },
  {
    id: 'q3',
    text: 'Em có hay nhận được tin nhắn xúc phạm, bêu rếu hoặc công kích trên mạng xã hội không?',
    minLabel: 'Không bao giờ',
    maxLabel: 'Rất thường xuyên'
  },
  {
    id: 'q4',
    text: 'Em có cảm thấy hoang mang, lo lắng hay sợ hãi khi bước chân đến trường học không?',
    minLabel: 'Rất an toàn',
    maxLabel: 'Rất sợ hãi, lo lắng'
  },
  {
    id: 'q5',
    text: 'Hiện tại, em có ai để tin tưởng và chia sẻ khi gặp bế tắc hay khó khăn không?',
    minLabel: 'Có nhiều người giúp đỡ',
    maxLabel: 'Hoàn toàn đơn độc và sợ sệt'
  }
];

export const INITIAL_MOCK_RESPONSES: SurveyResponse[] = [
  {
    id: 'rep-1',
    timestamp: new Date('2026-05-30T08:30:00Z'),
    grade: 'Khối 6',
    className: '6A1',
    answers: { q1: 5, q2: 4, q3: 4, q4: 5, q5: 4 },
    customStory: 'Mấy ngày nay cứ giờ ra chơi là các bạn giấu cặp sách của em, xô đẩy em ở hành lang làm em sợ không dám ra ngoài. Em mệt mỏi và không muốn đi học nữa.',
    totalScore: 22,
    riskLevel: 'HIGH',
    aiComments: 'Cảnh báo mức độ đặc biệt nghiêm trọng. Học sinh đang phải hứng chịu các hành vi bạo lực thể chất và tinh thần liên tiếp. Em xuất hiện dấu hiệu sợ hãi cực độ khi đến trường, không có điểm tựa nâng đỡ tâm lý vững chắc. Yêu cầu thầy cô liên hệ tham vấn ngay lập tức.',
    status: 'PENDING'
  },
  {
    id: 'rep-2',
    timestamp: new Date('2026-05-29T14:15:00Z'),
    grade: 'Khối 8',
    className: '8B3',
    answers: { q1: 4, q2: 5, q3: 2, q4: 4, q5: 4 },
    customStory: 'Cả nhóm trong tổ không cho em làm bài tập nhóm chung, nói em là đồ gàn dở rồi cô lập em. Các bạn còn tạo nhóm chat riêng để nói xấu em.',
    totalScore: 19,
    riskLevel: 'HIGH',
    aiComments: 'Nguy cơ bạo lực tinh thần dạng cô lập học đường mức độ cao. Học sinh bị tước đi tinh thần đồng đội và hoạt động nhóm, dẫn đến trạng thái tự ti và lo âu kéo dài.',
    status: 'UNDER_REVIEW',
    teacherNotes: 'Đã gặp riêng giáo viên chủ nhiệm lớp 8B3 để xác minh tình trạng chia nhóm trong lớp.'
  },
  {
    id: 'rep-3',
    timestamp: new Date('2026-05-30T10:05:00Z'),
    grade: 'Khối 7',
    className: '7C2',
    answers: { q1: 3, q2: 3, q3: 3, q4: 2, q5: 2 },
    customStory: 'Có một số bạn hay nói đùa quá trớn về ngoại hình của em trên mạng xã hội Facebook. Em thấy buồn nhưng vẫn có chị gái để chia sẻ chuyện này.',
    totalScore: 13,
    riskLevel: 'MEDIUM',
    aiComments: 'Nguy cơ trung bình, chủ yếu xuất phát từ hiện tượng trêu chọc ngoại hình trực tuyến. Điểm may mắn là học sinh vẫn duy trì được nguồn động viên chia sẻ tốt từ người thân.',
    status: 'RESOLVED',
    teacherNotes: 'Đã trao đổi nhóm nhỏ với lớp 7C2 về văn hóa ứng xử văn minh trên mạng xã hội. Ngoại hình không phải là trò đùa.'
  },
  {
    id: 'rep-4',
    timestamp: new Date('2026-05-28T09:40:00Z'),
    grade: 'Khối 9',
    className: '9A4',
    answers: { q1: 5, q2: 3, q3: 5, q4: 4, q5: 3 },
    customStory: 'Có một tài khoản ẩn danh cũ liên tục đăng ảnh chế của em vào nhóm trường, còn nhắn tin đe dọa đòi đánh. Em sợ quá, tối nào cũng mất ngủ.',
    totalScore: 20,
    riskLevel: 'HIGH',
    aiComments: 'Cyberbullying nguy cơ cao diễn tiến sang bạo lực thể chất. Học sinh đang chịu áp lực tâm lý khủng khiếp trực tuyến kèm đe dọa trực diện ngoại đời. Cần can thiệp an ninh học đường gấp.',
    status: 'PENDING'
  },
  {
    id: 'rep-5',
    timestamp: new Date('2026-05-30T16:22:00Z'),
    grade: 'Khối 6',
    className: '6A2',
    answers: { q1: 2, q2: 1, q3: 1, q4: 2, q5: 1 },
    customStory: 'Em đi học rất vui, thỉnh thoảng các bạn đùa giỡn chút nhưng không có ý gì xấu cả.',
    totalScore: 7,
    riskLevel: 'LOW',
    aiComments: 'Môi trường an toàn, tâm lý ổn định và giao lưu bè bạn tích cực tốt. Học sinh có khả năng kết nối cảm xúc xã hội khỏe mạnh.',
    status: 'RESOLVED'
  },
  {
    id: 'rep-6',
    timestamp: new Date('2026-05-27T10:11:00Z'),
    grade: 'Khối 7',
    className: '7B1',
    answers: { q1: 3, q2: 4, q3: 1, q4: 3, q5: 3 },
    customStory: 'Em mới chuyển trường đến nên chưa quen ai, giờ ra chơi thường phải ngồi một mình ở thư viện xem sách. Em cũng muốn chơi với các bạn mà ngại mở lời.',
    totalScore: 14,
    riskLevel: 'MEDIUM',
    aiComments: 'Biểu hiện nguy cơ cô lập học đường mức độ nhẹ do yếu tố chuyển trường học mới. Tâm trạng hơi u uất nhẹ, cần các hoạt động phong trào tạo cơ hội hòa nhập bè bạn cho em.',
    status: 'PENDING'
  },
  {
    id: 'rep-7',
    timestamp: new Date('2026-05-29T11:45:00Z'),
    grade: 'Khối 8',
    className: '8A5',
    answers: { q1: 2, q2: 2, q3: 1, q4: 2, q5: 1 },
    customStory: '',
    totalScore: 8,
    riskLevel: 'LOW',
    aiComments: 'Chưa phát hiện hành vi bắt nạt hoặc các dấu hiệu bạo lực học đường đối với học sinh này chăm sóc bình thường.',
    status: 'RESOLVED'
  },
  {
    id: 'rep-8',
    timestamp: new Date('2026-05-31T01:10:00Z'),
    grade: 'Khối 9',
    className: '9B2',
    answers: { q1: 4, q2: 4, q3: 3, q4: 4, q5: 4 },
    customStory: 'Có một nhóm anh chị lớp trên cứ chặn cổng yêu cầu nộp tiền ăn sáng mỗi ngày. Em hết tiền nên dạo này nhịn ăn sáng và hay đi trễ để tránh gặp họ.',
    totalScore: 20,
    riskLevel: 'HIGH',
    aiComments: 'Bắt nạt trấn lột kinh tế nguy kịch kèm nguy cơ trấn áp thể chất ngoài cổng trường. Học sinh buộc phải nhịn ăn ảnh hưởng nghiêm trọng thể chất tinh thần. Đề xuất ban giám hiệu trích xuất camera cổng trường.',
    status: 'PENDING'
  }
];

export const SPECIALIST_ADVICE = {
  LOW: {
    title: 'Gìn giữ sự tích cực & Kết nối yêu thương',
    tagline: 'Môi trường học tập của em thật tuyệt vời. Hãy lan tỏa nguồn năng lượng tươi sáng này đến mọi người xung quanh nhé!',
    bullets: [
      'Tiếp tục giữ mối liên kết chia sẻ cởi mở với cha mẹ, thầy cô khi đi học.',
      'Nếu thấy bạn bè xung quanh có dấu hiệu buồn bã hoặc bị trêu chọc, hãy đưa tay giúp đỡ hoặc báo kính thầy cô.',
      'Tích cực tham gia các câu lạc bộ thể thao, nghệ thuật để phát huy năng khiếu.'
    ]
  },
  MEDIUM: {
    title: 'Xây dựng lá chắn cá nhân & Tìm kiếm hỗ trợ nhẹ nhàng',
    tagline: 'Em đang phải trải qua một vài tình huống hơi khó chịu. Đây không phải lỗi của em, và chia sẻ sớm sẽ giúp mọi việc tốt lên rất nhiều.',
    bullets: [
      'Ghi chép lại thời gian, sự kiện và những lời trêu chọc để làm bằng chứng nếu tình hình chuyển biến nghiêm trọng hơn.',
      'Chủ động từ chối bằng thái độ tự tin, kiên định: nói rõ ràng rằng "Tôi không thích đùa kiểu này, đề nghị dừng lại".',
      'Tìm và nói chuyện với một người bạn thân, anh chị lớn, thầy cô giáo chủ nhiệm hoặc chuyên viên tư vấn học đường mà em tin tưởng nhất.'
    ]
  },
  HIGH: {
    title: 'Nhận trợ giúp khẩn cấp - Em không hề cô đơn!',
    tagline: 'Hãy vững tâm rằng nhà trường, gia đình và toàn xã hội luôn ở cạnh bảo vệ em. Đây hoàn cảnh khẩn cấp, em cần thực hiện các bước sau ngay lập tức để an toàn:',
    bullets: [
      '**HÃY NÓI RA NGAY LẬP TỨC:** Gặp trực tiếp Giáo viên chủ nhiệm, Thầy cô Tổng phụ trách, hoặc Cha Mẹ báo cáo toàn bộ vụ việc.',
      'Gọi miễn phí tới **Tổng đài Quốc gia Bảo vệ Trẻ em 111** (hoạt động 24/7 bảo mật tuyệt đối danh tính tốt nhất).',
      'Tránh đi một mình ở những góc khuất, hãy luôn di chuyển cùng nhóm bạn tích cực hoặc đi gần thầy cô.',
      'Tạm thời ngắt kết nối với các tin nhắn tiêu cực trên mạng, chụp màn hình lưu chứng cứ và bàn giao lại cho thầy cô điều tra.'
    ]
  }
};

// Local scoring logic
export function calculateRisk(score: number, hasIncidentDetails?: boolean): 'LOW' | 'MEDIUM' | 'HIGH' {
  if (hasIncidentDetails) {
    if (score <= 8) return 'MEDIUM'; // Nâng cấp từ THẤP lên TRUNG BÌNH nếu có vụ việc thực tế
    if (score <= 15) return 'MEDIUM';
    return 'HIGH'; // Nâng cấp từ TRUNG BÌNH lên CAO nếu điểm ranh giới 16-18 kèm chi tiết bắt nạt
  }
  if (score <= 10) return 'LOW';
  if (score <= 18) return 'MEDIUM';
  return 'HIGH';
}

export function getAIMessage(
  score: number,
  answers: { [key: string]: number },
  hasStory: boolean,
  incidentDetails?: IncidentDetails
): string {
  let detailAlert = '';
  if (incidentDetails && incidentDetails.description.trim()) {
    const who = incidentDetails.involvedNames && incidentDetails.involvedNames.trim() 
      ? `liên quan đến các cá nhân (${incidentDetails.involvedNames})` 
      : 'hoạt động ẩn danh của cá nhân liên quan';
    const location = incidentDetails.locationOccurred ? ` tại địa điểm [${incidentDetails.locationOccurred}]` : '';
    const time = incidentDetails.timeOccurred ? ` vào thời gian [${incidentDetails.timeOccurred}]` : '';
    
    detailAlert = ` [HỒ SƠ BẮT NẠT CHI TIẾT]: Vụ việc xảy ra${location}${time} ${who}, tính chất nghiêm trọng cần xác minh tức khắc. AI xác định tăng rủi ro đối với sự việc: "${incidentDetails.description}".`;
  }

  if (score <= 10) {
    if (detailAlert) {
      return `Hệ thống phân loại rủi ro tổng quát Thấp, tuy nhiên học sinh đã cung cấp thông tin hành vi cụ thể:${detailAlert} Giáo viên chủ nhiệm cần trò chuyện bảo mật tế nhị tháo gỡ mâu thuẫn này sớm nhất có thể.`;
    }
    return 'Hệ thống nhận định học sinh đang trong trạng thái an toàn thần kinh xã hội. Không phát hiện xung đột học đường bất thường nào nguy cơ ảnh hưởng lớn. Hãy duy trì trạng thái tinh thần năng nổ và hòa đồng này!';
  } else if (score <= 18) {
    let dominantType = '';
    if (answers.q2 >= 4) dominantType = 'có biểu hiện bị cô lập trong lớp, chịu khoảng cách xã hội từ các bạn';
    else if (answers.q1 >= 4) dominantType = 'chịu các trò trêu chọc miệng lặp đi lặp lại hàng ngày';
    else if (answers.q3 >= 4) dominantType = 'chịu sức ép miệt thị và sỉ nhục từ các nền tảng mạng mạng xã hội';
    else if (answers.q4 >= 4) dominantType = 'biểu hiện hoảng sợ lo âu khi đến lớp, ảnh hưởng năng suất ôn tập';
    else dominantType = 'có một số bế tắc bạo lực nhẹ cần tư vấn hỗ trợ tháo gỡ';

    return `Tín hiệu rủi ro Trung Bình. Học sinh ${dominantType}.${detailAlert || ' Rất may học sinh vẫn có thể liên kết tự vệ nhẹ.'} Thầy cô nên quan sát lớp khéo léo để điều chỉnh các trò chơi đồng đội và giảng giải văn hóa học đường tôn trọng nhân phẩm bạn bè.`;
  } else {
    let priorityAlert = '';
    if (answers.q4 >= 5 && answers.q5 >= 4) {
      priorityAlert = 'Học sinh đang sợ hãi tột cùng lo sợ bạo lực vật lý nặng nề và gần như bị phong tỏa nguồn chia sẻ tinh thần.';
    } else if (answers.q3 >= 5) {
      priorityAlert = 'Cyberbullying quy mô lớn có tính chất hạ nhục nhân phẩm công cộng trực tuyến rất gay gắt.';
    } else if (answers.q1 >= 4 && answers.q2 >= 4) {
      priorityAlert = 'Phối hợp bạo lực tinh thần: Vừa công kích ngôn từ, vừa cô lập một cách triệt để.';
    } else {
      priorityAlert = 'Các dấu hiệu xung đột học đường vượt quá giới hạn chịu đựng chuẩn mực thông thường của lứa tuổi học sinh.';
    }

    return `CẢNH BÁO NGUY CƠ CAO (MỨC ĐỎ). ${priorityAlert}${detailAlert || ''} Đề nghị Phòng Tư vấn tâm lý phối hợp với Giáo viên chủ nhiệm lập tức can thiệp gặp gỡ bảo mật hỗ trợ sự an toàn cho học sinh.`;
  }
}
