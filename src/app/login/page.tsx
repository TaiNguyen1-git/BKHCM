'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Xử lý đăng nhập ở đây
  };

  return (
    <div className="login-page">
      <div className="login-container">
        {/* Left Column - Login Form */}
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

          <h1 className="login-title">Đăng nhập vào tài khoản</h1>
          <p className="login-subtitle">Vui lòng nhập thông tin đăng nhập của bạn để tiếp tục</p>

          <div className="login-steps">
            <div className="login-step active"></div>
            <div className="login-step"></div>
            <div className="login-step"></div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="login-input"
              placeholder="Nhập email của bạn"
            />

            <div className="password-input-container">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                value={formData.password}
                onChange={handleChange}
                className="login-input"
                placeholder="Nhập mật khẩu của bạn"
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex={-1}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            <div className="flex items-center justify-between mb-4 mt-2">
              <div className="login-remember-me">
                <input
                  id="remember"
                  name="remember"
                  type="checkbox"
                  checked={formData.remember}
                  onChange={handleChange}
                  className="login-checkbox"
                />
                <label htmlFor="remember">
                  Ghi nhớ đăng nhập
                </label>
              </div>
              <Link href="/forgot-password" className="login-forgot-link">
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className="login-button"
            >
              Đăng nhập
            </button>
          </form>

          <div className="mt-8 pt-4 pb-4 text-center text-sm border-t border-gray-100" style={{ backgroundColor: 'transparent', color: '#4B5563' }}>
            <span>Chưa có tài khoản?</span>{' '}
            <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
              Đăng ký ngay
            </Link>
          </div>
        </div>

        {/* Right Column - Welcome Message */}
        <div className="login-right-column">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-2">Xin chào, bạn!</h2>
            <p className="text-white/80">
              Chào mừng bạn đến với hệ thống Smart Study Space của trường Đại học Bách Khoa TP.HCM.
              Đăng nhập để quản lý việc học tập và sử dụng không gian học tập hiệu quả.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}