import 'express';

declare module 'express-session' {
  interface SessionData {
    oauth2return?: string;
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: Session & Partial<SessionData>;
  }
}
