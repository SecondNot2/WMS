import jwt, { type SignOptions } from 'jsonwebtoken'
import { AppError } from './errors'

const ACCESS_SECRET = process.env.JWT_SECRET ?? 'dev-access-secret'
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? 'dev-refresh-secret'
const ACCESS_TTL: SignOptions['expiresIn'] = (process.env.JWT_ACCESS_TTL ?? '15m') as SignOptions['expiresIn']
const REFRESH_TTL: SignOptions['expiresIn'] = (process.env.JWT_REFRESH_TTL ?? '7d') as SignOptions['expiresIn']

export interface JwtPayload {
  sub: string
  role: string
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, { expiresIn: ACCESS_TTL })
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, { expiresIn: REFRESH_TTL })
}

export function verifyAccessToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, ACCESS_SECRET) as JwtPayload
    return decoded
  } catch {
    throw new AppError('UNAUTHORIZED', 'Access token không hợp lệ')
  }
}

export function verifyRefreshToken(token: string): JwtPayload {
  try {
    const decoded = jwt.verify(token, REFRESH_SECRET) as JwtPayload
    return decoded
  } catch {
    throw new AppError('UNAUTHORIZED', 'Refresh token không hợp lệ')
  }
}
