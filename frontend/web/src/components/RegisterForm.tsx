import React, { useState } from 'react';
import { RegisterFormData, FormErrors } from '../types/auth';
import { useAuth } from '../hooks/useAuth';
import './AuthForms.css';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
  onRegisterSuccess: () => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSwitchToLogin, 
  onRegisterSuccess 
}) => {
  // フォームデータの状態管理
  const [formData, setFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  // フィールドエラーの状態管理
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  // 認証フックの使用
  const { register, loading, error } = useAuth();

  // 入力フィールドの変更ハンドラー
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // フォームデータを更新
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // エラーをクリア
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // フォーム送信ハンドラー
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // バリデーション
    const errors: FormErrors = {};
    
    // ユーザー名のバリデーション
    if (!formData.username.trim()) {
      errors.username = 'ユーザー名は必須です';
    } else if (formData.username.length < 3) {
      errors.username = 'ユーザー名は3文字以上で入力してください';
    }

    // メールアドレスのバリデーション
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      errors.email = 'メールアドレスは必須です';
    } else if (!emailRegex.test(formData.email)) {
      errors.email = '有効なメールアドレスを入力してください';
    }

    // パスワードのバリデーション
    if (!formData.password) {
      errors.password = 'パスワードは必須です';
    } else if (formData.password.length < 6) {
      errors.password = 'パスワードは6文字以上で入力してください';
    }

    // パスワード確認のバリデーション
    if (!formData.confirmPassword) {
      errors.confirmPassword = 'パスワード確認は必須です';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'パスワードが一致しません';
    }

    // エラーがある場合は表示して処理を停止
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    // 登録処理を実行
    const success = await register(formData);
    if (success) {
      onRegisterSuccess();
    }
  };

  return (
    <div className="auth-form-container">
      <h2 className="auth-title">ユーザー登録</h2>
      
      {/* エラーメッセージの表示 */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {/* ユーザー名フィールド */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            ユーザー名
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            className={`form-input ${fieldErrors.username ? 'error' : ''}`}
            placeholder="ユーザー名を入力"
            disabled={loading}
          />
          {fieldErrors.username && (
            <span className="error-text">{fieldErrors.username}</span>
          )}
        </div>

        {/* メールアドレスフィールド */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            メールアドレス
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`form-input ${fieldErrors.email ? 'error' : ''}`}
            placeholder="example@email.com"
            disabled={loading}
          />
          {fieldErrors.email && (
            <span className="error-text">{fieldErrors.email}</span>
          )}
        </div>

        {/* パスワードフィールド */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            パスワード
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`form-input ${fieldErrors.password ? 'error' : ''}`}
            placeholder="パスワードを入力"
            disabled={loading}
          />
          {fieldErrors.password && (
            <span className="error-text">{fieldErrors.password}</span>
          )}
        </div>

        {/* パスワード確認フィールド */}
        <div className="form-group">
          <label htmlFor="confirmPassword" className="form-label">
            パスワード確認
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`form-input ${fieldErrors.confirmPassword ? 'error' : ''}`}
            placeholder="パスワードを再入力"
            disabled={loading}
          />
          {fieldErrors.confirmPassword && (
            <span className="error-text">{fieldErrors.confirmPassword}</span>
          )}
        </div>

        {/* 送信ボタン */}
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? '登録中...' : '登録'}
        </button>
      </form>

      {/* ログイン画面への切り替えリンク */}
      <div className="auth-switch">
        <p>
          すでにアカウントをお持ちですか？{' '}
          <button 
            type="button" 
            onClick={onSwitchToLogin}
            className="switch-link"
            disabled={loading}
          >
            ログイン
          </button>
        </p>
      </div>
    </div>
  );
}; 