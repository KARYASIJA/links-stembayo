import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable');
}

function parseExpiresIn(expiresIn: string): number {
  const units: Record<string, number> = {
    's': 1,
    'm': 60,
    'h': 3600,
    'd': 86400,
    'w': 604800,
    'y': 31536000
  };
  
  const match = expiresIn.match(/^(\d+)([smhdwy])$/);
  if (!match) {
    throw new Error('Invalid expiresIn format. Use format like "1d", "7d", "1h", etc.');
  }
  
  const [, value, unit] = match;
  return parseInt(value) * units[unit];
}

export function signJwt(payload: object, expiresIn = '1d') {
  const expiresInSeconds = parseExpiresIn(expiresIn);
  return jwt.sign(payload, JWT_SECRET, { expiresIn: expiresInSeconds });
}

export function verifyJwt(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch {
    return null;
  }
}