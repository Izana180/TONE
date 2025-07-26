# TONE Authentication API (Mock)

## 概要

TONEアプリケーションの認証APIの**モック版**です。実際のデータベース操作や認証処理を行わず、固定のレスポンスを返すため、フロントエンド開発やテストに最適です。

## 🎯 モックAPIの特徴

### ✅ **開発効率の向上**
- **バックエンド完成前にフロントエンド開発**が可能
- **固定レスポンス**により予測可能な動作
- **即座にテスト**が可能

### ✅ **テストの簡素化**
- **複雑なセットアップ**が不要
- **データベース**や**認証サーバー**が不要
- **一貫したテスト環境**を提供

### ✅ **学習・デモ用途**
- **APIの動作**を理解しやすい
- **プロトタイプ作成**に最適
- **チーム内での共有**が容易

## 🚀 クイックスタート

### 1. Swagger UIで確認
```bash
# Swagger UIを起動（Docker使用）
docker run --rm -p 8080:8080 -v $(pwd)/swagger-mock.yaml:/usr/share/nginx/html/swagger.yaml swaggerapi/swagger-ui

# ブラウザでアクセス
open http://localhost:8080
```

### 2. オンラインエディタで確認
- [Swagger Editor](https://editor.swagger.io/) にアクセス
- `swagger-mock.yaml` の内容をコピー&ペースト

## 📋 テスト用アカウント

### メインアカウント
```json
{
  "email": "test@example.com",
  "password": "password123",
  "username": "testuser"
}
```

### レスポンス例
```json
{
  "user": {
    "id": "mock-user-001",
    "username": "testuser",
    "email": "test@example.com",
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "token": "mock-jwt-token-12345"
}
```

## 🔧 APIエンドポイント

### 認証関連

| メソッド | エンドポイント | 説明 | 認証 |
|---------|---------------|------|------|
| POST | `/auth/register` | ユーザー登録（モック） | 不要 |
| POST | `/auth/login` | ユーザーログイン（モック） | 不要 |
| POST | `/auth/logout` | ユーザーログアウト（モック） | 任意 |
| GET | `/auth/me` | 現在のユーザー情報取得（モック） | 任意 |
| GET | `/auth/health` | APIヘルスチェック（モック） | 不要 |

## 🎲 モック動作の詳細

### ユーザー登録 (`POST /auth/register`)
```yaml
モック動作:
  - 実際のデータベースには保存されません
  - 常に成功レスポンスを返します
  - バリデーションは最小限です
  - 固定のユーザーID: "mock-user-001"
```

### ユーザーログイン (`POST /auth/login`)
```yaml
モック動作:
  - テストアカウント (test@example.com): 100%成功
  - その他のアカウント: 50%成功（ランダム）
  - 空の認証情報: 100%失敗
  - 固定のJWTトークン: "mock-jwt-token-12345"
```

### ユーザー情報取得 (`GET /auth/me`)
```yaml
モック動作:
  - 固定のテストユーザー情報を返します
  - 認証ヘッダーは任意です
  - 常に同じユーザー情報を返します
```

### ログアウト (`POST /auth/logout`)
```yaml
モック動作:
  - 実際のトークン無効化は行いません
  - 常に成功レスポンスを返します
  - 認証ヘッダーは任意です
```

## 🧪 テスト方法

### 1. Swagger UIでのテスト

#### ユーザー登録テスト
1. `/auth/register` エンドポイントを開く
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
1. `/auth/login` エンドポイントを開く
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

### 2. cURLでのテスト

#### ヘルスチェック
```bash
curl -X GET "http://localhost:3000/api/v1/auth/health" \
  -H "Content-Type: application/json"
```

#### ユーザー登録
```bash
curl -X POST "http://localhost:3000/api/v1/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "confirmPassword": "password123"
  }'
```

#### ログイン
```bash
curl -X POST "http://localhost:3000/api/v1/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

#### ユーザー情報取得
```bash
curl -X GET "http://localhost:3000/api/v1/auth/me" \
  -H "Authorization: Bearer mock-jwt-token-12345"
```

### 3. JavaScriptでのテスト

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

## 🔄 フロントエンドとの連携

### 現在のフロントエンドコードの更新

`frontend/web/src/hooks/useAuth.ts` のモックAPI関数を以下のように更新：

```typescript
// モックAPI関数（実際のAPI呼び出しに置き換え）
const mockLoginAPI = async (data: LoginFormData): Promise<AuthResponse> => {
  // モックAPIのエンドポイントを呼び出し
  const response = await fetch('http://localhost:3000/api/v1/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  });

  if (!response.ok) {
    throw new Error('Login failed');
  }

  return response.json();
};
```

## 📊 レスポンス例

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

### エラーレスポンス
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "メールアドレスまたはパスワードが正しくありません",
    "details": {}
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

## ⚠️ 注意事項

### セキュリティ
- **本番環境では絶対に使用しないでください**
- **セキュリティ機能は無効化**されています
- **データは永続化されません**

### 制限事項
- **実際の認証処理**は行われません
- **データベース操作**は行われません
- **セッション管理**は実装されていません

### 推奨用途
- **フロントエンド開発**
- **APIテスト**
- **プロトタイプ作成**
- **学習・デモ**

## 🚀 次のステップ

### 1. 実際のAPI実装
モックAPIでフロントエンド開発が完了したら、実際のAPIサーバーを実装：

```bash
# バックエンドプロジェクトの作成
mkdir backend
cd backend
npm init -y
npm install express jsonwebtoken bcrypt cors
```

### 2. データベース設計
```sql
-- ユーザーテーブ
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. 環境変数の設定
```bash
# .env
DATABASE_URL=postgresql://username:password@localhost:5432/tone_db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=24h
PORT=3000
```

## 📚 参考資料

- [OpenAPI Specification](https://swagger.io/specification/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)
- [Express.js](https://expressjs.com/)
- [JWT](https://jwt.io/)

## 🤝 サポート

- **メール**: support@tone-app.com
- **GitHub Issues**: [プロジェクトのIssuesページ]
- **ドキュメント**: [APIドキュメント]

---

**注意**: このモックAPIは開発・テスト用途のみです。本番環境では使用しないでください。 