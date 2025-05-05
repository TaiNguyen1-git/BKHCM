'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import styles from './login.module.css';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, isLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !isLoading) {
      console.log('Người dùng đã đăng nhập, chuyển hướng dựa trên vai trò:', user);

      // Chuyển hướng dựa trên vai trò
      if (user.role === 'Quản trị viên' || user.role === 'Ban quản lý') {
        router.push('/admin');
      } else {
        router.push('/user');
      }
    }
  }, [user, isLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username || !password) {
      setError('Vui lòng nhập tên đăng nhập và mật khẩu');
      return;
    }

    setError('');
    setIsSubmitting(true);

    try {
      const loggedInUser = await login(username, password);

      if (loggedInUser) {
        // Kiểm tra vai trò của người dùng để chuyển hướng phù hợp
        console.log('Đăng nhập thành công, đang chuyển hướng...', loggedInUser);

        // Nếu là admin hoặc ban quản lý thì chuyển hướng đến trang admin, ngược lại chuyển đến trang user
        if (loggedInUser.role === 'Quản trị viên' || loggedInUser.role === 'Ban quản lý') {
          console.log('Chuyển hướng đến trang admin...');
          router.push('/admin');
        } else {
          console.log('Chuyển hướng đến trang user...');
          router.push('/user');
        }
      } else {
        setError('Tên đăng nhập hoặc mật khẩu không đúng');
      }
    } catch (err) {
      setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className={styles.loginContainer}>
      {/* Header */}
      <header className={styles.loginHeader}>
        <div className={styles.headerContent}>
          <Image
            src="/hcmut.png"
            alt="HCMUT Logo"
            width={40}
            height={40}
          />
          <div className={styles.logoText}>
            <h1>Trường Đại học Bách khoa - ĐHQG TPHCM</h1>
            <p>Smart Study Space Management and Reservation System for HCMUT</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className={styles.loginMain}>
        <div className={styles.loginCard}>
          <h1 className={styles.loginTitle}>Đăng nhập</h1>

          {error && (
            <div className={styles.errorMessage}>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="username" className={styles.formLabel}>Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                className={styles.formInput}
                placeholder="Nhập tên đăng nhập"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isSubmitting}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.formLabel}>Mật khẩu</label>
              <div className={styles.passwordContainer}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  className={styles.formInput}
                  placeholder="Nhập mật khẩu"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={togglePasswordVisibility}
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                      <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                      <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className={styles.rememberForgot}>
              <div className={styles.rememberMe}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  className={styles.checkbox}
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  disabled={isSubmitting}
                />
                <label htmlFor="rememberMe" className={styles.rememberLabel}>Ghi nhớ đăng nhập</label>
              </div>

              <Link href="/forgot-password" className={styles.forgotPassword}>
                Quên mật khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className={styles.loginButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className={styles.spinner} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="20" height="20">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Đang đăng nhập...
                </>
              ) : (
                <>
                  Đăng nhập
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" width="20" height="20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clipRule="evenodd" />
                  </svg>
                </>
              )}
            </button>
          </form>

          <div className={styles.registerLink}>
            Chưa có tài khoản? <Link href="/register">Đăng ký ngay</Link>
          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-4 mt-auto">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600 text-sm">© 2025 - SSMR - Trường Đại học Bách khoa - ĐHQG TPHCM. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}