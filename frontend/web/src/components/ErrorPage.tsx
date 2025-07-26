import React from 'react';
import './ErrorPage.css';

interface ErrorPageProps {
  error: {
    code: string;
    message: string;
    details?: {
      attemptedEmail?: string;
      errorType?: string;
      suggestion?: string;
      testAccount?: {
        email: string;
        password: string;
      };
      testAccounts?: Array<{
        email: string;
        password: string;
        username: string;
      }>;
    };
  };
  onRetry: () => void;
  onBackToLogin: () => void;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({ 
  error, 
  onRetry, 
  onBackToLogin 
}) => {
  return (
    <div className="error-page">
      <div className="error-container">
        {/* エラーアイコン */}
        <div className="error-icon">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>

        {/* エラータイトル */}
        <h1 className="error-title">認証エラー</h1>

        {/* エラーメッセージ */}
        <div className="error-message">
          <p className="error-text">{error.message}</p>
          
          {error.details?.attemptedEmail && (
            <div className="error-details">
              <p><strong>入力されたメールアドレス:</strong> {error.details.attemptedEmail}</p>
            </div>
          )}

          {error.details?.suggestion && (
            <div className="error-suggestion">
              <p>{error.details.suggestion}</p>
            </div>
          )}
        </div>

        {/* テストアカウント情報 */}
        {error.details?.testAccounts && error.details.testAccounts.length > 0 ? (
          <div className="test-account-info">
            <h3>テスト用アカウント</h3>
            <div className="test-accounts-list">
              {error.details.testAccounts.map((account, index) => (
                <div key={index} className="test-account-item">
                  <div className="account-header">
                    <span className="account-username">{account.username}</span>
                    <span className="account-type">
                      {account.username === 'admin' ? '管理者' : 
                       account.username === 'demouser' ? 'デモ' : 'テスト'}
                    </span>
                  </div>
                  <div className="account-details">
                    <p><strong>メールアドレス:</strong> {account.email}</p>
                    <p><strong>パスワード:</strong> {account.password}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="test-account-note">
              ※ これらのアカウントは開発・テスト用です。本番環境では使用しないでください。
            </p>
          </div>
        ) : error.details?.testAccount ? (
          <div className="test-account-info">
            <h3>テスト用アカウント</h3>
            <div className="test-account-details">
              <p><strong>メールアドレス:</strong> {error.details.testAccount.email}</p>
              <p><strong>パスワード:</strong> {error.details.testAccount.password}</p>
            </div>
            <p className="test-account-note">
              ※ このアカウントは開発・テスト用です。本番環境では使用しないでください。
            </p>
          </div>
        ) : null}

        {/* エラーコード */}
        <div className="error-code">
          <p><strong>エラーコード:</strong> {error.code}</p>
          {error.details?.errorType && (
            <p><strong>エラータイプ:</strong> {error.details.errorType}</p>
          )}
        </div>

        {/* アクションボタン */}
        <div className="error-actions">
          <button 
            className="retry-button"
            onClick={onRetry}
          >
            再試行
          </button>
          
          <button 
            className="back-button"
            onClick={onBackToLogin}
          >
            ログイン画面に戻る
          </button>
        </div>

        {/* ヘルプ情報 */}
        <div className="help-info">
          <h4>お困りの場合</h4>
          <ul>
            <li>正しいメールアドレスとパスワードを入力してください</li>
            <li>大文字・小文字の違いにご注意ください</li>
            <li>スペースが含まれていないかご確認ください</li>
            <li>上記のテストアカウントをお試しください</li>
            <li>問題が解決しない場合は、開発チームにお問い合わせください</li>
          </ul>
        </div>
      </div>
    </div>
  );
}; 