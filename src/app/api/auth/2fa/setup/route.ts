import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { generateTwoFactorSecret, generateQRCode } from '@/lib/twoFactor';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    // Verify user is authenticated
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    const userId = decoded.userId;

    // Generate 2FA secret
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const twoFactorSetup = generateTwoFactorSecret(user.email);
    const qrCodeDataUrl = await generateQRCode(twoFactorSetup.qrCodeUrl);

    // Store secret temporarily (will be confirmed when user verifies)
    await prisma.user.update({
      where: { id: userId },
      data: {
        twoFactorSecret: twoFactorSetup.secret,
        backupCodes: JSON.stringify(twoFactorSetup.backupCodes),
      },
    });

    return NextResponse.json({
      secret: twoFactorSetup.secret,
      qrCode: qrCodeDataUrl,
      backupCodes: twoFactorSetup.backupCodes,
    });
  } catch (error) {
    console.error('2FA setup error:', error);
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 