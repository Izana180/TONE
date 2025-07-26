import React, { useState } from 'react';
import { LoginFormData, FormErrors } from '../types/auth';
import { useAuth } from '../hooks/useAuth';
import { ErrorPage } from './ErrorPage';
import './AuthForms.css';

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: () => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onSwitchToRegister, 
  onLoginSuccess 
}) => {
  // フォームデータの状態管理
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  });

  // フィールドエラーの状態管理
  const [fieldErrors, setFieldErrors] = useState<FormErrors>({});

  // エラーページ表示の状態管理
  const [showErrorPage, setShowErrorPage] = useState(false);
  const [authError, setAuthError] = useState<any>(null);

  // 認証フックの使用
  const { login, loading, error } = useAuth();

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
    
    // メールアドレスのバリデーション
    if (!formData.email.trim()) {
      errors.email = 'メールアドレスは必須です';
    }

    // パスワードのバリデーション
    if (!formData.password) {
      errors.password = 'パスワードは必須です';
    }

    // エラーがある場合は表示して処理を停止
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      // ログイン処理を実行
      const success = await login(formData);
      if (success) {
        onLoginSuccess();
      } else {
        // 認証エラーの場合、エラーページを表示
        setAuthError({
          code: 'INVALID_CREDENTIALS',
          message: 'メールアドレスまたはパスワードが正しくありません',
          details: {
            attemptedEmail: formData.email,
            errorType: 'authentication_failed',
            suggestion: '正しいメールアドレスとパスワードを入力してください',
            testAccounts: [
              {
                email: 'test@example.com',
                password: 'password123',
                username: 'testuser'
              },
              {
                email: 'admin@tone-app.com',
                password: 'admin123',
                username: 'admin'
              },
              {
                email: 'demo@demo.com',
                password: 'demo123',
                username: 'demouser'
              }
            ]
          }
        });
        setShowErrorPage(true);
      }
    } catch (err: any) {
      // APIエラーの場合
      if (err.response?.data?.error) {
        setAuthError(err.response.data.error);
      } else {
        setAuthError({
          code: 'UNKNOWN_ERROR',
          message: '予期しないエラーが発生しました',
          details: {
            errorType: 'unknown_error',
            suggestion: 'しばらく時間をおいてから再試行してください'
          }
        });
      }
      setShowErrorPage(true);
    }
  };

  // エラーページの再試行ハンドラー
  const handleRetry = () => {
    setShowErrorPage(false);
    setAuthError(null);
  };

  // ログイン画面に戻るハンドラー
  const handleBackToLogin = () => {
    setShowErrorPage(false);
    setAuthError(null);
    setFormData({ email: '', password: '' });
    setFieldErrors({});
  };

  // エラーページが表示されている場合
  if (showErrorPage && authError) {
    return (
      <ErrorPage
        error={authError}
        onRetry={handleRetry}
        onBackToLogin={handleBackToLogin}
      />
    );
  }

  return (
    <div className="auth-form-container">
      <h2 className="auth-title">ログイン</h2>
      
      {/* エラーメッセージの表示 */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
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

        {/* 送信ボタン */}
        <button 
          type="submit" 
          className="submit-button"
          disabled={loading}
        >
          {loading ? 'ログイン中...' : 'ログイン'}
        </button>
      </form>

      {/* ユーザー登録画面への切り替えリンク */}
      <div className="auth-switch">
        <p>
          アカウントをお持ちでないですか？{' '}
          <button 
            type="button" 
            onClick={onSwitchToRegister}
            className="switch-link"
            disabled={loading}
          >
            新規登録
          </button>
        </p>
      </div>
    </div>
  );
}; 