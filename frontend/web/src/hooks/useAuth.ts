import { useState } from 'react';
import { RegisterFormData, LoginFormData, AuthResponse, FormErrors } from '../types/auth';

// バリデーション関数
const validateRegisterForm = (data: RegisterFormData): FormErrors => {
  const errors: FormErrors = {};

  // ユーザー名のバリデーション
  if (!data.username.trim()) {
    errors.username = 'ユーザー名は必須です';
  } else if (data.username.length < 3) {
    errors.username = 'ユーザー名は3文字以上で入力してください';
  }

  // メールアドレスのバリデーション
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim()) {
    errors.email = 'メールアドレスは必須です';
  } else if (!emailRegex.test(data.email)) {
    errors.email = '有効なメールアドレスを入力してください';
  }

  // パスワードのバリデーション
  if (!data.password) {
    errors.password = 'パスワードは必須です';
  } else if (data.password.length < 6) {
    errors.password = 'パスワードは6文字以上で入力してください';
  }

  // パスワード確認のバリデーション
  if (!data.confirmPassword) {
    errors.confirmPassword = 'パスワード確認は必須です';
  } else if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'パスワードが一致しません';
  }

  return errors;
};

const validateLoginForm = (data: LoginFormData): FormErrors => {
  const errors: FormErrors = {};

  // メールアドレスのバリデーション
  if (!data.email.trim()) {
    errors.email = 'メールアドレスは必須です';
  }

  // パスワードのバリデーション
  if (!data.password) {
    errors.password = 'パスワードは必須です';
  }

  return errors;
};

// 認証フック
export const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ユーザー登録処理
  const register = async (formData: RegisterFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // バリデーション
      const errors = validateRegisterForm(formData);
      if (Object.keys(errors).length > 0) {
        setError('入力内容にエラーがあります');
        return false;
      }

      // API呼び出し（実際の実装ではここでAPIを呼び出します）
      const response = await mockRegisterAPI(formData);
      
      // 成功時の処理
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return true;
    } catch (err) {
      setError('登録に失敗しました');
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ログイン処理
  const login = async (formData: LoginFormData): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // バリデーション
      const errors = validateLoginForm(formData);
      if (Object.keys(errors).length > 0) {
        setError('入力内容にエラーがあります');
        return false;
      }

      // API呼び出し
      const response = await mockLoginAPI(formData);
      
      // 成功時の処理
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return true;
    } catch (err: any) {
      // エラー情報を設定
      if (err.message) {
        setError(err.message);
      } else {
        setError('ログインに失敗しました');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト処理
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return {
    register,
    login,
    logout,
    loading,
    error
  };
};

// モックAPI関数（実際のAPI呼び出しに置き換え）
const mockRegisterAPI = async (data: RegisterFormData): Promise<AuthResponse> => {
  // モックAPIサーバーを呼び出し
  const response = await fetch('http://localhost:3000/api/v1/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || '登録に失敗しました');
  }

  return response.json();
};

const mockLoginAPI = async (data: LoginFormData): Promise<AuthResponse> => {
  // モックAPIサーバーを呼び出し
  const response = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    const errorData = await response.json();
    const error = new Error(errorData.error?.message || 'ログインに失敗しました');
    (error as any).response = { data: errorData };
    throw error;
  }

  return response.json();
}; 