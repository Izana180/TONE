# TONE Authentication API with Docker

## 概要

Docker Composeを使用して、フロントエンドとモックAPIサーバーを同時に起動する方法を説明します。

## 🚀 クイックスタート

### 1. 全サービスを起動（フロントエンド + モックAPI）

```bash
# モックAPIサーバーを含めて全サービスを起動
docker compose --profile mock up

# バックグラウンドで起動する場合
docker compose --profile mock up -d
```

### 2. フロントエンドのみ起動

```bash
# フロントエンドのみ起動
docker compose up frontend

# バックグラウンドで起動する場合
docker compose up -d frontend
```

### 3. モックAPIサーバーのみ起動

```bash
# モックAPIサーバーのみ起動
docker compose --profile mock up mock-api

# バックグラウンドで起動する場合
docker compose --profile mock up -d mock-api
```

## 📋 サービス一覧

| サービス名 | ポート | 説明 | プロファイル |
|-----------|--------|------|-------------|
| `frontend` | 5173 | Reactフロントエンド | デフォルト |
| `mock-api` | 3000 | モックAPIサーバー | mock |
| `backend` | 3000 | 実際のバックエンド（将来） | development |
| `database` | 5432 | PostgreSQL（将来） | development |

## 🔧 使用方法

### フロントエンドアクセス
- **URL**: http://localhost:5173
- **説明**: Reactアプリケーション（ログイン画面）

### モックAPIアクセス
- **API Base URL**: http://localhost:3000/api/v1
- **Swagger UI**: http://localhost:3000/swagger
- **ヘルスチェック**: http://localhost:3000/api/v1/auth/health

## 🧪 テスト用アカウント

### メインアカウント
```json
{
  "email": "test@example.com",
  "password": "password123",
  "username": "testuser"
}
```

### テスト手順
1. フロントエンドにアクセス: http://localhost:5173
2. 上記のテストアカウントでログイン
3. 成功するとJWTトークンが発行される

## 📊 APIエンドポイント

### 認証関連
- `POST /api/v1/auth/register` - ユーザー登録
- `POST /api/v1/auth/login` - ユーザーログイン
- `POST /api/v1/auth/logout` - ユーザーログアウト
- `GET /api/v1/auth/me` - 現在のユーザー情報取得
- `GET /api/v1/auth/health` - APIヘルスチェック

## 🔄 開発ワークフロー

### 1. 開発開始
```bash
# 全サービスを起動
docker compose --profile mock up

# ログを確認
docker compose logs -f
```

### 2. コード変更
- フロントエンドの変更は自動的に反映されます
- モックAPIサーバーの変更は手動で再起動が必要です

### 3. モックAPIサーバーの再起動
```bash
# モックAPIサーバーのみ再起動
docker compose restart mock-api

# または、停止してから再起動
docker compose stop mock-api
docker compose --profile mock up mock-api
```

### 4. 開発終了
```bash
# 全サービスを停止
docker compose down

# ボリュームも削除する場合
docker compose down -v
```

## 🐛 トラブルシューティング

### ポートが既に使用されている場合
```bash
# 使用中のポートを確認
lsof -i :3000
lsof -i :5173

# プロセスを終了
kill -9 <PID>
```

### コンテナが起動しない場合
```bash
# ログを確認
docker compose logs mock-api
docker compose logs frontend

# コンテナを再ビルド
docker compose build --no-cache
```

### ネットワーク接続の問題
```bash
# ネットワークを確認
docker network ls
docker network inspect tone_tone-network

# ネットワークを再作成
docker compose down
docker network prune
docker compose --profile mock up
```

## 📁 ファイル構成

```
TONE/
├── docker-compose.yml          # Docker Compose設定
├── Dockerfile.mock             # モックAPIサーバー用Dockerfile
├── mock-server.js              # モックAPIサーバー
├── swagger-mock.yaml           # モックAPI仕様書
├── package.json                # モックAPI依存関係
├── frontend/
│   └── web/
│       ├── Dockerfile          # フロントエンド用Dockerfile
│       └── src/
│           └── hooks/
│               └── useAuth.ts  # 認証フック（更新済み）
└── README-docker.md            # このファイル
```

## 🔧 環境変数

### フロントエンド
```bash
# .env
NODE_ENV=development
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

### モックAPIサーバー
```bash
# .env
NODE_ENV=development
PORT=3000
```

## 🚀 本番環境への移行

### 1. 実際のバックエンドAPIの実装
```bash
# バックエンドプロジェクトの作成
mkdir backend
cd backend
npm init -y
npm install express jsonwebtoken bcrypt cors
```

### 2. データベースの設定
```bash
# PostgreSQLコンテナを有効化
docker compose --profile development up database
```

### 3. フロントエンドの設定変更
```typescript
// frontend/web/src/hooks/useAuth.ts
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.tone-app.com/api/v1'
  : 'http://localhost:3000/api/v1';
```

## 📚 参考資料

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Express.js](https://expressjs.com/)
- [React](https://reactjs.org/)
- [Swagger UI](https://swagger.io/tools/swagger-ui/)

## 🤝 サポート

- **メール**: support@tone-app.com
- **GitHub Issues**: [プロジェクトのIssuesページ]
- **ドキュメント**: [APIドキュメント]

---

**注意**: このセットアップは開発・テスト用途です。本番環境では適切なセキュリティ設定を行ってください。 