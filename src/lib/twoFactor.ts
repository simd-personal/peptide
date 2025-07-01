import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export interface TwoFactorSetup {
  secret: string;
  qrCodeUrl: string;
  backupCodes: string[];
}

export function generateTwoFactorSecret(email: string): TwoFactorSetup {
  const secret = speakeasy.generateSecret({
    name: `Peptide Therapeutics (${email})`,
    issuer: 'Peptide Therapeutics',
    length: 32,
  });

  const backupCodes = generateBackupCodes();

  return {
    secret: secret.base32!,
    qrCodeUrl: secret.otpauth_url!,
    backupCodes,
  };
}

export function generateBackupCodes(): string[] {
  const codes: string[] = [];
  for (let i = 0; i < 10; i++) {
    codes.push(speakeasy.generateSecret({ length: 10 }).base32!.toUpperCase());
  }
  return codes;
}

export function verifyTwoFactorToken(token: string, secret: string): boolean {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time steps (60 seconds) for clock skew
  });
}

export function verifyBackupCode(code: string, backupCodes: string[]): boolean {
  return backupCodes.includes(code.toUpperCase());
}

export async function generateQRCode(url: string): Promise<string> {
  try {
    return await QRCode.toDataURL(url);
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
}

export function formatBackupCodes(codes: string[]): string {
  return codes.map((code, index) => `${index + 1}. ${code}`).join('\n');
} 