FROM python:3.11-slim

# 作業ディレクトリを設定
WORKDIR /app

# 依存ファイルをコピーしてインストール
COPY ./requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# アプリケーションの全コードをコピー
COPY . /app

# 作業ディレクトリをmain.pyのあるディレクトリに変更
WORKDIR /app/handler

# FastAPIを起動（本番用に変更も可能）
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]