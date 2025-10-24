export const SecurityConfig = {
  jwt: {
    secret: process.env.JWT_SECRET || 'change-this-in-production',
    expiresIn: '7d',
    refreshExpiresIn: '30d',
  },
  bcrypt: {
    saltRounds: 12,
  },
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
  },
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? [process.env.FRONTEND_URL || 'https://sinav-tr.com']
      : ['http://localhost:3000', 'http://localhost:3002'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  },
  csrf: {
    secret: process.env.CSRF_SECRET || 'csrf-secret-change-in-production',
  },
  session: {
    secret: process.env.SESSION_SECRET || 'session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
      sameSite: 'strict' as const,
    },
  },
  helmet: {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        imgSrc: ["'self'", 'data:', 'https:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        mediaSrc: ["'self'"],
        frameSrc: ["'none'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  },
  passwordPolicy: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  twoFactorAuth: {
    issuer: 'Sınav TR',
    window: 1,
  },
  captcha: {
    siteKey: process.env.RECAPTCHA_SITE_KEY || '',
    secretKey: process.env.RECAPTCHA_SECRET_KEY || '',
  },
};
