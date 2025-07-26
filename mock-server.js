const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS設定
app.use(cors());
app.use(express.json());

// テストアカウント定義
const TEST_ACCOUNTS = [
  {
    email: 'test@example.com',
    password: 'password123',
    user: {
      id: 'mock-user-001',
      username: 'testuser',
      email: 'test@example.com',
      createdAt: '2024-01-01T00:00:00.000Z',
      profile: {
        firstName: 'テスト',
        lastName: 'ユーザー',
        avatar: 'https://example.com/avatar.jpg'
      }
    },
    token: 'mock-jwt-token-test-12345'
  },
  {
    email: 'admin@tone-app.com',
    password: 'admin123',
    user: {
      id: 'mock-user-002',
      username: 'admin',
      email: 'admin@tone-app.com',
      createdAt: '2024-01-01T00:00:00.000Z',
      profile: {
        firstName: '管理者',
        lastName: 'ユーザー',
        avatar: 'https://example.com/admin-avatar.jpg'
      }
    },
    token: 'mock-jwt-token-admin-67890'
  },
  {
    email: 'demo@demo.com',
    password: 'demo123',
    user: {
      id: 'mock-user-003',
      username: 'demouser',
      email: 'demo@demo.com',
      createdAt: '2024-01-01T00:00:00.000Z',
      profile: {
        firstName: 'デモ',
        lastName: 'ユーザー',
        avatar: 'https://example.com/demo-avatar.jpg'
      }
    },
    token: 'mock-jwt-token-demo-11111'
  }
];

// 重複チェック用メールアドレス
const EXISTING_EMAIL = 'existing@example.com';

// バリデーション関数
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateRegisterData = (data) => {
  const errors = {};
  
  if (!data.username || data.username.length < 3) {
    errors.username = 'ユーザー名は3文字以上で入力してください';
  }
  
  if (!data.email || !validateEmail(data.email)) {
    errors.email = '有効なメールアドレスを入力してください';
  }
  
  if (!data.password || data.password.length < 6) {
    errors.password = 'パスワードは6文字以上で入力してください';
  }
  
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = 'パスワードが一致しません';
  }
  
  return errors;
};

const validateLoginData = (data) => {
  const errors = {};
  
  if (!data.email) {
    errors.email = 'メールアドレスは必須です';
  }
  
  if (!data.password) {
    errors.password = 'パスワードは必須です';
  }
  
  return errors;
};

// ユーザー登録（モック）
app.post('/api/v1/auth/register', (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  // バリデーション
  const validationErrors = validateRegisterData({ username, email, password, confirmPassword });
  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: '入力内容にエラーがあります',
        details: validationErrors
      }
    });
  }

  // 重複チェック（existing@example.comの場合のみ）
  if (email === EXISTING_EMAIL) {
    return res.status(409).json({
      error: {
        code: 'USER_ALREADY_EXISTS',
        message: 'このメールアドレスは既に登録されています',
        details: {}
      }
    });
  }

  // 成功レスポンス（モック）
  const response = {
    user: {
      id: `mock-user-${Date.now()}`,
      username: username,
      email: email,
      createdAt: new Date().toISOString(),
      profile: {
        firstName: username,
        lastName: 'ユーザー',
        avatar: 'https://example.com/default-avatar.jpg'
      }
    },
    token: `mock-jwt-token-${Date.now()}`
  };
  
  return res.status(201).json(response);
});

// ユーザーログイン（モック）
app.post('/api/v1/auth/login', (req, res) => {
  const { email, password } = req.body;

  // バリデーション
  const validationErrors = validateLoginData({ email, password });
  if (Object.keys(validationErrors).length > 0) {
    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: '入力内容にエラーがあります',
        details: validationErrors
      }
    });
  }

  // テストアカウントとの照合
  const testAccount = TEST_ACCOUNTS.find(account => 
    account.email === email && account.password === password
  );

  if (testAccount) {
    // 成功レスポンス
    return res.status(200).json({
      user: testAccount.user,
      token: testAccount.token
    });
  } else {
    // 認証失敗レスポンス
    return res.status(401).json({
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'メールアドレスまたはパスワードが正しくありません',
        details: {
          attemptedEmail: email,
          errorType: 'authentication_failed',
          suggestion: '正しいメールアドレスとパスワードを入力してください',
          testAccounts: TEST_ACCOUNTS.map(acc => ({
            email: acc.email,
            password: acc.password,
            username: acc.user.username
          }))
        }
      }
    });
  }
});

// ユーザーログアウト（モック）
app.post('/api/v1/auth/logout', (req, res) => {
  // モック版では常に成功
  return res.status(200).json({
    message: 'ログアウトしました',
    timestamp: new Date().toISOString()
  });
});

// 現在のユーザー情報取得（モック）
app.get('/api/v1/auth/me', (req, res) => {
  // モック版では固定のテストユーザー情報を返す
  const mockUser = {
    id: 'mock-user-001',
    username: 'testuser',
    email: 'test@example.com',
    createdAt: '2024-01-01T00:00:00.000Z',
    profile: {
      firstName: 'テスト',
      lastName: 'ユーザー',
      avatar: 'https://example.com/avatar.jpg'
    }
  };
  
  return res.status(200).json(mockUser);
});

// Swagger UI用のHTML
const swaggerHtml = `
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TONE Authentication API - Swagger UI</title>
    <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui.css" />
    <style>
        html { box-sizing: border-box; overflow: -moz-scrollbars-vertical; overflow-y: scroll; }
        *, *:before, *:after { box-sizing: inherit; }
        body { margin:0; background: #fafafa; }
    </style>
</head>
<body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-bundle.js"></script>
    <script src="https://unpkg.com/swagger-ui-dist@5.9.0/swagger-ui-standalone-preset.js"></script>
    <script>
        window.onload = function() {
            const ui = SwaggerUIBundle({
                url: '/swagger.yaml',
                dom_id: '#swagger-ui',
                deepLinking: true,
                presets: [
                    SwaggerUIBundle.presets.apis,
                    SwaggerUIStandalonePreset
                ],
                plugins: [
                    SwaggerUIBundle.plugins.DownloadUrl
                ],
                layout: "StandaloneLayout"
            });
        };
    </script>
</body>
</html>
`;

// Swagger UI エンドポイント
app.get('/', (req, res) => {
  res.send(swaggerHtml);
});

// Swagger YAML ファイルの提供
app.get('/swagger.yaml', (req, res) => {
  res.setHeader('Content-Type', 'text/yaml');
  res.sendFile(__dirname + '/swagger.yaml');
});

// ヘルスチェック
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    message: 'TONE Mock API Server is running'
  });
});

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'サーバー内部エラーが発生しました',
      details: {}
    }
  });
});

// 404ハンドリング
app.use((req, res) => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: 'エンドポイントが見つかりません',
      details: {
        path: req.path,
        method: req.method
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 TONE Mock API Server running on port ${PORT}`);
  console.log(`📖 Swagger UI: http://localhost:${PORT}`);
  console.log(`🔗 API Base URL: http://localhost:${PORT}/api/v1`);
  console.log('\n📋 テストアカウント:');
  TEST_ACCOUNTS.forEach(account => {
    console.log(`   ${account.email} / ${account.password} (${account.user.username})`);
  });
  console.log('\n⚠️  注意: これはモックAPIです。本番環境では使用しないでください。');
}); 