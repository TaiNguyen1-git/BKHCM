'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

// Định nghĩa kiểu dữ liệu cho Feedback
export type Feedback = {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  userEmail: string;
  type: string;
  subject: string;
  message: string;
  rating: number;
  status: 'pending' | 'processing' | 'resolved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  adminResponse?: string;
  adminId?: string;
  adminName?: string;
};

// Định nghĩa kiểu dữ liệu cho FeedbackContext
type FeedbackContextType = {
  feedbacks: Feedback[];
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateFeedback: (feedback: Feedback) => void;
  deleteFeedback: (id: string) => void;
  getFeedbackById: (id: string) => Feedback | undefined;
  getFeedbacksByUserId: (userId: string) => Feedback[];
  getFeedbacksByStatus: (status: Feedback['status']) => Feedback[];
  respondToFeedback: (id: string, response: string, status: Feedback['status']) => void;
};

// Dữ liệu mẫu cho các loại phản hồi
export const feedbackTypes = [
  {
    id: 'general',
    label: 'Góp ý chung',
  },
  {
    id: 'bug',
    label: 'Báo lỗi',
  },
  {
    id: 'feature',
    label: 'Đề xuất tính năng',
  },
  {
    id: 'complaint',
    label: 'Khiếu nại',
  },
  {
    id: 'question',
    label: 'Câu hỏi',
  },
];

// Dữ liệu mẫu cho các phản hồi
const initialFeedbacksData: Feedback[] = [
  {
    id: 'FB001',
    userId: 'SV2021000123',
    userName: 'Nguyễn Văn A',
    userRole: 'Sinh viên',
    userEmail: 'student@hcmut.edu.vn',
    type: 'bug',
    subject: 'Lỗi khi đặt phòng',
    message: 'Khi tôi cố gắng đặt phòng H1.101, hệ thống báo lỗi "Không thể đặt phòng vào thời gian này". Nhưng khi tôi kiểm tra lịch, phòng này vẫn còn trống.',
    rating: 3,
    status: 'pending',
    createdAt: '2023-12-10T08:30:00Z',
    updatedAt: '2023-12-10T08:30:00Z',
  },
  {
    id: 'FB002',
    userId: 'GV2021000456',
    userName: 'Trần Thị B',
    userRole: 'Giảng viên',
    userEmail: 'teacher@hcmut.edu.vn',
    type: 'feature',
    subject: 'Đề xuất thêm tính năng lọc phòng',
    message: 'Tôi muốn đề xuất thêm tính năng lọc phòng theo thiết bị có sẵn, ví dụ như máy chiếu, máy tính, v.v. Điều này sẽ giúp việc tìm phòng phù hợp dễ dàng hơn.',
    rating: 5,
    status: 'processing',
    createdAt: '2023-12-11T10:15:00Z',
    updatedAt: '2023-12-12T14:20:00Z',
    adminResponse: 'Cảm ơn góp ý của bạn. Chúng tôi đang xem xét tính năng này và sẽ cập nhật trong phiên bản tới.',
    adminId: 'AD2021000789',
    adminName: 'Lê Văn C',
  },
  {
    id: 'FB003',
    userId: 'SV2021000123',
    userName: 'Nguyễn Văn A',
    userRole: 'Sinh viên',
    userEmail: 'student@hcmut.edu.vn',
    type: 'general',
    subject: 'Góp ý về giao diện người dùng',
    message: 'Giao diện người dùng hiện tại khá khó sử dụng trên điện thoại di động. Tôi đề xuất cải thiện responsive design để trải nghiệm trên mobile tốt hơn.',
    rating: 4,
    status: 'resolved',
    createdAt: '2023-12-12T09:45:00Z',
    updatedAt: '2023-12-14T11:30:00Z',
    adminResponse: 'Cảm ơn góp ý của bạn. Chúng tôi đã cập nhật giao diện mobile trong phiên bản mới nhất. Mời bạn kiểm tra và tiếp tục góp ý nếu còn vấn đề.',
    adminId: 'AD2021000789',
    adminName: 'Lê Văn C',
  },
  {
    id: 'FB004',
    userId: 'GV2021000456',
    userName: 'Trần Thị B',
    userRole: 'Giảng viên',
    userEmail: 'teacher@hcmut.edu.vn',
    type: 'complaint',
    subject: 'Khiếu nại về việc hủy đặt phòng',
    message: 'Tôi đã đặt phòng H3.201 cho buổi hướng dẫn đồ án vào ngày 20/12/2023, nhưng đặt phòng của tôi bị hủy mà không có thông báo trước. Điều này gây ra nhiều khó khăn cho tôi và sinh viên.',
    rating: 2,
    status: 'rejected',
    createdAt: '2023-12-13T14:20:00Z',
    updatedAt: '2023-12-15T10:10:00Z',
    adminResponse: 'Sau khi kiểm tra, chúng tôi thấy rằng phòng H3.201 đã được đặt trước bởi một sự kiện của nhà trường. Chúng tôi đã gửi email thông báo về việc này vào ngày 18/12/2023. Xin lỗi vì sự bất tiện này.',
    adminId: 'AD2021000789',
    adminName: 'Lê Văn C',
  },
  {
    id: 'FB005',
    userId: 'SV2021000123',
    userName: 'Nguyễn Văn A',
    userRole: 'Sinh viên',
    userEmail: 'student@hcmut.edu.vn',
    type: 'question',
    subject: 'Câu hỏi về quy trình mượn thiết bị',
    message: 'Tôi muốn hỏi về quy trình mượn máy chiếu. Tôi cần mượn máy chiếu cho buổi thuyết trình nhóm vào tuần sau. Tôi cần làm gì và cần chuẩn bị những giấy tờ gì?',
    rating: 5,
    status: 'pending',
    createdAt: '2023-12-14T08:30:00Z',
    updatedAt: '2023-12-14T08:30:00Z',
  },
];

// Tạo context
const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined);

// Tạo provider component
export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const { user } = useAuth();

  // Khởi tạo dữ liệu từ localStorage hoặc dữ liệu mẫu
  useEffect(() => {
    const storedFeedbacks = localStorage.getItem('feedbacks');
    if (storedFeedbacks) {
      setFeedbacks(JSON.parse(storedFeedbacks));
    } else {
      setFeedbacks(initialFeedbacksData);
      localStorage.setItem('feedbacks', JSON.stringify(initialFeedbacksData));
    }
  }, []);

  // Lưu dữ liệu vào localStorage khi có thay đổi
  useEffect(() => {
    if (feedbacks.length > 0) {
      localStorage.setItem('feedbacks', JSON.stringify(feedbacks));
    }
  }, [feedbacks]);

  // Thêm phản hồi mới
  const addFeedback = (feedback: Omit<Feedback, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => {
    const now = new Date().toISOString();
    const newId = `FB${String(feedbacks.length + 1).padStart(3, '0')}`;
    
    const newFeedback: Feedback = {
      ...feedback,
      id: newId,
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    
    setFeedbacks(prevFeedbacks => [...prevFeedbacks, newFeedback]);
  };

  // Cập nhật phản hồi
  const updateFeedback = (updatedFeedback: Feedback) => {
    setFeedbacks(prevFeedbacks => 
      prevFeedbacks.map(feedback => 
        feedback.id === updatedFeedback.id ? {
          ...updatedFeedback,
          updatedAt: new Date().toISOString()
        } : feedback
      )
    );
  };

  // Xóa phản hồi
  const deleteFeedback = (id: string) => {
    setFeedbacks(prevFeedbacks => prevFeedbacks.filter(feedback => feedback.id !== id));
  };

  // Lấy phản hồi theo ID
  const getFeedbackById = (id: string) => {
    return feedbacks.find(feedback => feedback.id === id);
  };

  // Lấy phản hồi theo userId
  const getFeedbacksByUserId = (userId: string) => {
    return feedbacks.filter(feedback => feedback.userId === userId);
  };

  // Lấy phản hồi theo trạng thái
  const getFeedbacksByStatus = (status: Feedback['status']) => {
    return feedbacks.filter(feedback => feedback.status === status);
  };

  // Phản hồi cho feedback
  const respondToFeedback = (id: string, response: string, status: Feedback['status']) => {
    if (!user) return;
    
    setFeedbacks(prevFeedbacks => 
      prevFeedbacks.map(feedback => 
        feedback.id === id ? {
          ...feedback,
          adminResponse: response,
          adminId: user.id,
          adminName: user.name,
          status: status,
          updatedAt: new Date().toISOString()
        } : feedback
      )
    );
  };

  return (
    <FeedbackContext.Provider value={{ 
      feedbacks, 
      addFeedback, 
      updateFeedback, 
      deleteFeedback, 
      getFeedbackById,
      getFeedbacksByUserId,
      getFeedbacksByStatus,
      respondToFeedback
    }}>
      {children}
    </FeedbackContext.Provider>
  );
};

// Hook để sử dụng FeedbackContext
export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
