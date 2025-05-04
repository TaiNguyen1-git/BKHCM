'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Forgot password request for:', email);
    // Xử lý gửi yêu cầu đặt lại mật khẩu ở đây
    setIsSubmitted(true);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Column - Form */}
        <div className="login-left-column">
          <div className="login-company-name">
            <Image
              src="/hcmut.png"
              alt="HCMUT Logo"
              width={24}
              height={24}
              priority
            />
            <span>Smart Study Space - HCMUT</span>
          </div>

          <h1 className="login-title">Quên mật khẩu</h1>
          <p className="login-subtitle">
            {!isSubmitted 
              ? 'Vui lòng nhập email của bạn để nhận liên kết đặt lại mật khẩu' 
              : 'Chúng tôi đã gửi email hướng dẫn đặt lại mật khẩu cho bạn'
            }
          </p>

          <div className="login-steps">
            <div className="login-step active"></div>
            <div className="login-step"></div>
            <div className="login-step"></div>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="login-form">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="login-input"
                placeholder="Nhập email của bạn"
              />

              <button
                type="submit"
                className="login-button"
              >
                Gửi yêu cầu đặt lại mật khẩu
              </button>
            </form>
          ) : (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-blue-700 text-sm">
              <p className="mb-2 font-medium">Email đã được gửi!</p>
              <p>Vui lòng kiểm tra hộp thư đến của bạn và làm theo hướng dẫn để đặt lại mật khẩu.</p>
              <p className="mt-2">Nếu bạn không nhận được email, vui lòng kiểm tra thư mục spam hoặc thử lại.</p>
            </div>
          )}

          <div className="mt-8 pt-4 pb-4 text-center text-sm border-t border-gray-100" style={{ backgroundColor: 'transparent', color: '#4B5563' }}>
            <span>Quay lại</span>{' '}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
              Đăng nhập
            </Link>
          </div>
        </div>

        {/* Right Column - Welcome Message */}
        <div className="login-right-column">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</h2>
            <p className="text-white/80">
              Đừng lo lắng! Việc quên mật khẩu là điều bình thường. Chúng tôi sẽ giúp bạn đặt lại mật khẩu 
              và truy cập lại vào hệ thống Smart Study Space của trường Đại học Bách Khoa TP.HCM.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
