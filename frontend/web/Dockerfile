# frontend/web/Dockerfile
FROM node:18

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm install

COPY . .

EXPOSE 5173

# Viteのホスト設定を追加してDockerコンテナ外からアクセス可能にする
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]