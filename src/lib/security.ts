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
export function sanitizeSafeFilename(
  originalName: string,
  allowedExtensions = ['.mp4', '.webm', '.mov', '.mkv'],
  prefix = 'file'
): string | null {
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

  return `${prefix}_${Date.now()}_${namePart || 'item'}_${randomSuffix}${ext}`;
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
 * Verify magic bytes of uploaded documents (PDF, DOCX, DOC, TXT)
 */
export function verifyDocumentMagicBytes(buffer: Buffer, ext: string): boolean {
  if (!buffer || buffer.length < 4) return false;

  const cleanExt = ext.toLowerCase();

  // 1. PDF: starts with '%PDF-'
  if (cleanExt === '.pdf') {
    return buffer.slice(0, 5).toString('ascii') === '%PDF-';
  }

  // 2. DOCX: ZIP archive starting with PK\x03\x04
  if (cleanExt === '.docx') {
    return buffer[0] === 0x50 && buffer[1] === 0x4b && buffer[2] === 0x03 && buffer[3] === 0x04;
  }

  // 3. DOC (legacy binary compound document): D0 CF 11 E0
  if (cleanExt === '.doc') {
    return buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0;
  }

  // 4. TXT: Plaintext UTF-8 / ASCII (no null bytes in beginning)
  if (cleanExt === '.txt') {
    return !buffer.slice(0, Math.min(512, buffer.length)).includes(0x00);
  }

  return false;
}

/**
 * Constant-time dummy comparison to prevent side-channel timing attacks
 */
export const DUMMY_BCRYPT_HASH = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy';
