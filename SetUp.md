TONE プロジェクト 環境構築手順

このドキュメントでは、TONE プロジェクトの開発に参加するメンバーが、ローカル環境でプロジェクトを動かすために必要なすべてのステップを解説しています。

⸻

📌 前提条件

以下のソフトを事前にインストールしてください：

✅ Docker Desktop
	•	Mac: https://www.docker.com/products/docker-desktop/
	•	Windows: 同上（インストーラーは自動で判別されます）

インストール後、Docker Desktop が起動していること（ステータスバーにクジラのアイコンが表示されていればOK）

⸻

1. Gitでプロジェクトを取得

まずはTONEプロジェクトのコードをローカルにダウンロード（=クローン）します。

git clone <リポジトリのURL>
cd TONE

TONE というフォルダに入って作業を続けます。

⸻

2. .env ファイルを作る

環境変数という設定ファイルが必要です。テンプレートからコピーして作成します：

cp .env.example .env

これで .env ファイルができるので、中身は特に変更しなくてOKです。

⸻

3. Docker で準備・起動

まず Docker を使ってアプリを構築（build）します：

docker compose build --no-cache

その後、アプリを起動します：

docker compose up

初回は数分かかります。ログがたくさん流れますが、止まらなければ成功です！

⸻

4. 起動後の確認方法

それぞれのURLをブラウザで開いて確認できます：

種類	アクセスURL	内容
フロント（Web）	http://localhost:5173	Reactアプリ
バックエンドAPI	http://localhost:8000	FastAPI
DB UI（Adminer）	http://localhost:8081	DB管理画面
ファイルストレージ	http://localhost:9001	MinIOコンソール


⸻

5. エラー時の対処法 🔧

✅ web-1 exited with code 1（vite not found など）

これはフロントエンドの依存モジュール（ライブラリ）が正しく入っていない時です：

cd frontend/web
rm -rf node_modules package-lock.json
npm install

その後、もう一度：

cd ../..
docker compose build --no-cache
docker compose up

✅ ポート競合エラー

例えば :5173 や :8000 が他のアプリで使われていると起きます。

対処法：docker-compose.yml を開いて、該当の 5173:5173 などを別のポート番号に変更（例：5174:5173）して保存。

⸻

6. よく使うコマンド 🧑‍💻

目的	コマンド
一度全て終了してきれいにしたい	docker compose down --volumes --remove-orphans
変更を反映して再起動したい	docker compose build + docker compose up
バックエンドだけログ確認	docker logs -f tone-backend-1


⸻

7. 注意点（初学者向け）
	•	ターミナルのコマンドは1行ずつコピペしてください
	•	cd で移動する時は、実際に存在するフォルダ名を確認してください（例：frontend/web）
	•	コマンド実行後に Permission denied や command not found が出たら、間違った場所でコマンドを打っている可能性があります。

⸻

8. React Native (モバイルアプリ) について

frontend/mobile/ 以下にExpoベースで配置済み。

iOS/Android の開発は別途 Expo Go アプリや Xcode, Android Studio が必要です。詳細は別ドキュメントにて。