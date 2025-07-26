# TONE認証API開発・モック環境構築まとめ

---

## 1. 目的

- フロントエンドとバックエンドのAPI連携仕様を明確化
- 開発・テスト効率向上のためのモックAPIサーバー構築
- Docker Composeによる統合開発環境の実現

---

## 2. Swagger（OpenAPI）ドキュメント設計

### 2.1 本番用API仕様（swagger.yaml）
- ユーザー登録、ログイン、ログアウト、ユーザー情報取得のエンドポイントを定義
- JWT認証、バリデーション、エラーハンドリングを明記
- サンプルリクエスト・レスポンス例を豊富に記載

### 2.2 モックAPI用仕様（swagger-mock.yaml）
- 本番仕様をベースに、モック用の説明・挙動を明記
- テスト用アカウント（test@example.com / password123）のみ成功
- その他は必ず認証失敗
- Swagger UIでAPI仕様をGUI確認・テスト可能

---

## 3. モックAPIサーバー構築

### 3.1 実装ファイル
- `mock-server.js` : Express.jsで実装したモックAPIサーバー
- `package.json` : 必要な依存関係（express, cors, nodemon等）
- `Dockerfile.mock` : Node.jsベースのモックAPI用Dockerfile

### 3.2 挙動
- `/api/v1/auth/login` : test@example.com / password123 以外は必ず失敗
- `/api/v1/auth/register` : 最小限のバリデーションで常に成功
- `/api/v1/auth/me` : 固定のテストユーザー情報を返す
- `/api/v1/auth/logout` : 常に成功
- `/api/v1/auth/health` : ヘルスチェック
- `/swagger` : Swagger UIでAPI仕様を確認

---

## 4. フロントエンド連携

- `frontend/web/src/hooks/useAuth.ts` でAPI呼び出しをモックAPIサーバーに変更
- テストアカウント以外ではログイン不可となるよう修正
- ローカル・Dockerどちらでも動作可能

---

## 5. Docker Composeによる統合

### 5.1 設定ファイル
- `docker-compose.yml` : frontend, mock-api サービスを統合
- `depends_on` でフロントエンドがモックAPIに依存
- ボリュームマウントでホットリロード対応

### 5.2 起動・再起動コマンド
- 全サービス起動: `docker compose --profile mock up`
- モックAPIのみ再起動: `docker compose restart mock-api`
- イメージ再ビルド: `docker compose build mock-api`

---

## 6. テスト用アカウント

```json
{
  "email": "test@example.com",
  "password": "password123"
}
```

---

## 7. 参考URL・コマンド

- フロントエンド: http://localhost:5173
- モックAPI: http://localhost:3000/api/v1
- Swagger UI: http://localhost:3000/swagger
- ヘルスチェック: http://localhost:3000/api/v1/auth/health

---

## 8. 注意事項

- モックAPIは**開発・テスト用途のみ**。本番では必ず本物の認証APIを利用すること。
- セキュリティ機能は無効化されているため、**本番環境での利用厳禁**。
- 仕様変更時はswagger.yaml / swagger-mock.yamlを必ず更新。

---

## 9. 今後の展望

- 本番用バックエンドAPIの実装・連携
- DB連携・ユーザー管理機能の拡張
- CI/CDパイプラインへのSwagger自動検証導入

---

**このドキュメントはTONE認証API開発の全体像を俯瞰し、チーム内外の連携・引き継ぎ・新規参画者のオンボーディングに活用できます。** 