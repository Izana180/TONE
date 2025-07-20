import React, { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { useAuth } from './hooks/useAuth';
import './App.css';

function App() {
  // 認証状態の管理
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // 認証フックの使用
  const { logout } = useAuth();

  // 初期化時に認証状態をチェック
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      setIsAuthenticated(true);
    }
    
    setIsLoading(false);
  }, []);

  // 認証成功時の処理
  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  // ログアウト処理
  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
  };

  // ローディング中
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>読み込み中...</p>
      </div>
    );
  }

  // 認証されていない場合は認証画面を表示
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={handleAuthSuccess} />;
  }

  // 認証済みの場合はメインアプリケーションを表示
  return (
    <div className="app">
      <header className="app-header">
        <h1>TONE</h1>
        <button onClick={handleLogout} className="logout-button">
          ログアウト
        </button>
      </header>
      <main className="app-main">
        <h2>ようこそ！</h2>
        <p>ログインに成功しました。</p>
        <p>ここにメインアプリケーションのコンテンツが表示されます。</p>
      </main>
    </div>
  );
}

export default App; 