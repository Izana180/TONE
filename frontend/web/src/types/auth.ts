// ユーザー登録フォームの型定義
export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// ログインフォームの型定義
export interface LoginFormData {
  email: string;
  password: string;
}

// ユーザー情報の型定義
export interface User {
  id: string;
  username: string;
  email: string;
  createdAt: string;
}

// APIレスポンスの型定義
export interface AuthResponse {
  user: User;
  token: string;
}

// フォームエラーの型定義
export interface FormErrors {
  [key: string]: string;
} 