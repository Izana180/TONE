# TONE Authentication API (Mock)

## 概要

TONEアプリケーションの認証APIの**モック版**です。実際のデータベース操作や認証処理を行わず、固定のレスポンスを返すものです。


## クイックスタート

### 1. Docker Composeで起動（推奨）
```bash
# 全サービスを起動
docker compose up

# モックAPIのみ起動
docker compose --profile mock up mock-api

# フロントエンドのみ起動
docker compose up frontend
```

### 2. Swagger UIで確認
```bash
# ブラウザでアクセス
open http://localhost:3000
```

### 3. オンラインエディタで確認
- [Swagger Editor](https://editor.swagger.io/) にアクセス
- `swagger.yaml` の内容をコピー&ペースト

## テスト用アカウント

### 利用可能なテストアカウント

| ユーザー名 | メールアドレス | パスワード | アカウント種別 |
|-----------|---------------|-----------|---------------|
| testuser | test@example.com | password123 | テストユーザー |
| admin | admin@tone-app.com | admin123 | 管理者 |
| demouser | demo@demo.com | demo123 | デモユーザー |

### レスポンス例
```json
{
  "user": {
    "id": "mock-user-001",
    "username": "testuser",
    "email": "test@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "profile": {
      "firstName": "テスト",
      "lastName": "ユーザー",
      "avatar": "https://example.com/avatar.jpg"
    }
  },
  "token": "mock-jwt-token-12345"
}
```

## APIエンドポイント

### 認証関連

| メソッド | エンドポイント | 説明 | 認証 |
|---------|---------------|------|------|
| POST | `/api/v1/auth/register` | ユーザー登録（モック） | 不要 |
| POST | `/api/v1/auth/login` | ユーザーログイン（モック） | 不要 |
| POST | `/api/v1/auth/logout` | ユーザーログアウト（モック） | 任意 |
| GET | `/api/v1/auth/me` | 現在のユーザー情報取得（モック） | 任意 |
| GET | `/api/v1/auth/health` | APIヘルスチェック（モック） | 不要 |

### Swagger UI
- **URL**: `http://localhost:3000/`
- **Swagger YAML**: `http://localhost:3000/swagger.yaml`

## モック動作の詳細

### ユーザー登録 (`POST /api/v1/auth/register`)
```yaml
モック動作:
  - 実際のデータベースには保存されません
  - バリデーションエラー: メール形式、パスワード長、ユーザー名長をチェック
  - 既存ユーザーエラー: existing@example.com で409エラー
  - 成功時: 固定のユーザーID: "mock-user-001"
```

### ユーザーログイン (`POST /api/v1/auth/login`)
```yaml
モック動作:
  - テストアカウントのみ成功: test@example.com, admin@tone-app.com, demo@demo.com
  - その他のアカウント: 100%失敗
  - 詳細なエラー情報: 試行したメールアドレス、エラータイプ、提案、テストアカウント一覧
  - 固定のJWTトークン: "mock-jwt-token-12345"
```

### ユーザー情報取得 (`GET /api/v1/auth/me`)
```yaml
モック動作:
  - 固定のテストユーザー情報を返します
  - 認証ヘッダーは任意です
  - 常に同じユーザー情報を返します
```

### ログアウト (`POST /api/v1/auth/logout`)
```yaml
モック動作:
  - 実際のトークン無効化は行いません
  - 常に成功レスポンスを返します
  - 認証ヘッダーは任意です
```

## テスト方法

### 1. Swagger UIでのテスト

#### ユーザー登録テスト
1. `/api/v1/auth/register` エンドポイントを開く
2. 「Try it out」ボタンをクリック
3. 以下のJSONを入力：
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "password123",
  "confirmPassword": "password123"
}
```
4. 「Execute」ボタンをクリック
5. 成功レスポンスを確認

#### ログインテスト
1. `/api/v1/auth/login` エンドポイントを開く
2. 「Try it out」ボタンをクリック
3. 以下のJSONを入力：
```json
{
  "email": "test@example.com",
  "password": "password123"
}
```
4. 「Execute」ボタンをクリック
5. 成功レスポンスとJWTトークンを確認



### 2. JavaScriptでのテスト

#### Fetch API使用例
```javascript
// ログイン
const loginResponse = await fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@example.com',
    password: 'password123'
  })
});

const loginData = await loginResponse.json();
console.log('Login response:', loginData);

// ユーザー情報取得
const userResponse = await fetch('http://localhost:3000/api/v1/auth/me', {
  headers: {
    'Authorization': `Bearer ${loginData.token}`
  }
});

const userData = await userResponse.json();
console.log('User data:', userData);
```

## フロントエンドとの連携

### 現在のフロントエンド機能

#### エラーハンドリング
- **詳細なエラーページ**: 認証失敗時に専用のエラーページを表示
- **テストアカウント情報**: エラーページで利用可能なテストアカウントを表示
- **リトライ機能**: エラーページからログインフォームに戻る機能

#### 認証フロー
```typescript
// ログイン成功時
if (success) {
  onLoginSuccess();
} else {
  // エラーページを表示
  setShowErrorPage(true);
}
```

### フロントエンドコードの更新

`frontend/web/src/hooks/useAuth.ts` のモックAPI関数：

```typescript
// モックAPI関数（実際のAPI呼び出しに置き換え）
const mockLoginAPI = async (data: LoginFormData): Promise<AuthResponse> => {
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
```

## レスポンス例

### 成功レスポンス
```json
{
  "user": {
    "id": "mock-user-001",
    "username": "testuser",
    "email": "test@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "profile": {
      "firstName": "テスト",
      "lastName": "ユーザー",
      "avatar": "https://example.com/avatar.jpg"
    }
  },
  "token": "mock-jwt-token-12345"
}
```

### 認証エラーレスポンス
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "メールアドレスまたはパスワードが正しくありません",
    "details": {
      "attemptedEmail": "wrong@example.com",
      "errorType": "authentication_failed",
      "suggestion": "正しいメールアドレスとパスワードを入力してください",
      "testAccounts": [
        {
          "email": "test@example.com",
          "password": "password123",
          "username": "testuser"
        },
        {
          "email": "admin@tone-app.com",
          "password": "admin123",
          "username": "admin"
        },
        {
          "email": "demo@demo.com",
          "password": "demo123",
          "username": "demouser"
        }
      ]
    }
  }
}
```

### バリデーションエラー
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力内容にエラーがあります",
    "details": {
      "username": "ユーザー名は3文字以上で入力してください",
      "email": "有効なメールアドレスを入力してください",
      "password": "パスワードは6文字以上で入力してください"
    }
  }
}
```

### 既存ユーザーエラー
```json
{
  "error": {
    "code": "USER_ALREADY_EXISTS",
    "message": "このメールアドレスは既に登録されています",
    "details": {
      "email": "existing@example.com"
    }
  }
}
```

## 🐳 Docker環境

### 起動コマンド
```bash
# 全サービス起動
docker compose up

# モックAPIのみ起動
docker compose --profile mock up mock-api

# バックグラウンド起動
docker compose up -d

# ログ確認
docker compose logs -f mock-api

# サービス再起動
docker compose restart mock-api
```

### ポート設定
- **フロントエンド**: `http://localhost:5173`
- **モックAPI**: `http://localhost:3000`
- **Swagger UI**: `http://localhost:3000/`

### 制限事項
- **実際の認証処理**は行われません
- **データベース操作**は行われません
- **セッション管理**は実装されていません
- **テストアカウント以外**はログインできません
