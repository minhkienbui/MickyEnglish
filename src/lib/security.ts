import crypto from 'crypto';

/**
 * Sanitize strings to prevent XSS / script injection
 */
export function sanitizeText(str: string, maxLength = 1000): string {
  if (!str || typeof str !== 'string') return '';
  return str
    .slice(0, maxLength)
    .replace(/[<>]/g, '') // remove HTML tags
    .trim();
}

/**
 * Validate and sanitize email format
 */
export function validateEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email.trim().toLowerCase()) && email.length <= 100;
}

/**
 * Validate password strength
 * Requires at least 6 characters (recommended 8+ for production)
 */
export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Mật khẩu là bắt buộc' };
  }
  if (password.length < 6) {
    return { isValid: false, message: 'Mật khẩu phải có tối thiểu 6 ký tự' };
  }
  if (password.length > 128) {
    return { isValid: false, message: 'Mật khẩu không được dài quá 128 ký tự' };
  }
  return { isValid: true };
}

/**
 * Sanitize filenames to prevent path traversal (../, \\, null bytes, double extensions)
 */
export function sanitizeSafeFilename(originalName: string, allowedExtensions = ['.mp4', '.webm', '.mov', '.mkv']): string | null {
  if (!originalName || typeof originalName !== 'string') return null;

  // Remove any directory components, null bytes, control characters
  const cleanBase = originalName.replace(/[\x00-\x1f\x7f\/\\]/g, '').trim();

  // Extract extension and verify it's in the whitelist
  const dotIndex = cleanBase.lastIndexOf('.');
  if (dotIndex === -1) return null;

  const ext = cleanBase.slice(dotIndex).toLowerCase();
  if (!allowedExtensions.includes(ext)) return null;

  // Name part (without extension) must be alphanumeric, underscores or dashes only
  const namePart = cleanBase.slice(0, dotIndex).replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 50);
  const randomSuffix = crypto.randomBytes(8).toString('hex');

  return `video_${Date.now()}_${namePart || 'clip'}_${randomSuffix}${ext}`;
}

/**
 * Inspect magic bytes of uploaded video buffer to verify legitimate container format
 */
export function verifyVideoMagicBytes(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 12) return false;

  // 1. MP4 / MOV: typically contains 'ftyp' at offset 4
  const ftypCheck = buffer.slice(4, 8).toString('ascii');
  if (ftypCheck === 'ftyp' || ftypCheck === 'moov') {
    return true;
  }

  // 2. WebM / MKV: EBML header starts with 0x1A, 0x45, 0xDF, 0xA3
  if (buffer[0] === 0x1a && buffer[1] === 0x45 && buffer[2] === 0xdf && buffer[3] === 0xa3) {
    return true;
  }

  // 3. AVI: starts with 'RIFF' and contains 'AVI '
  if (
    buffer.slice(0, 4).toString('ascii') === 'RIFF' &&
    buffer.slice(8, 12).toString('ascii') === 'AVI '
  ) {
    return true;
  }

  // 4. QuickTime MOV alternative header (wide / mdat / moov at offset 4)
  const altCheck = buffer.slice(4, 8).toString('ascii');
  if (['wide', 'mdat', 'free', 'skip'].includes(altCheck)) {
    return true;
  }

  return false;
}

/**
 * Constant-time dummy comparison to prevent side-channel timing attacks
 */
export const DUMMY_BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
