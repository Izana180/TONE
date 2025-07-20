import React, { useState } from 'react';
import { RegisterForm } from './RegisterForm';
import { LoginForm } from './LoginForm';
import './AuthForms.css';

interface AuthPageProps {
  onAuthSuccess: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onAuthSuccess }) => {
  // 現在表示するフォームの状態管理（'login' または 'register'）
  const [currentForm, setCurrentForm] = useState<'login' | 'register'>('login');

  // ログイン画面に切り替え
  const handleSwitchToLogin = () => {
    setCurrentForm('login');
  };

  // ユーザー登録画面に切り替え
  const handleSwitchToRegister = () => {
    setCurrentForm('register');
  };

  // 認証成功時の処理
  const handleAuthSuccess = () => {
    onAuthSuccess();
  };

  return (
    <div className="auth-page">
      <div className="auth-content">
        {/* ロゴやアプリ名 */}
        <div className="auth-header">
          <h1 className="app-title">TONE</h1>
          <p className="app-subtitle">アカウントにログインまたは新規登録</p>
        </div>

        {/* フォームの切り替え */}
        {currentForm === 'login' ? (
          <LoginForm
            onSwitchToRegister={handleSwitchToRegister}
            onLoginSuccess={handleAuthSuccess}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={handleSwitchToLogin}
            onRegisterSuccess={handleAuthSuccess}
          />
        )}
      </div>
    </div>
  );
}; 