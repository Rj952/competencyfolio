import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';
import { getDefaultPortfolio } from '@/lib/constants';

// GET - Load portfolio
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    let portfolio = await prisma.portfolio.findUnique({
      where: { userId: session.userId },
    });

    // Create default portfolio if none exists
    if (!portfolio) {
      portfolio = await prisma.portfolio.create({
        data: {
          userId: session.userId,
          data: getDefaultPortfolio(),
          version: 3,
        },
      });
    }

    return NextResponse.json({
      data: portfolio.data,
      version: portfolio.version,
      lastSavedAt: portfolio.lastSavedAt,
    });
  } catch (error) {
    console.error('Portfolio load error:', error);
    return NextResponse.json({ error: 'Failed to load portfolio' }, { status: 500 });
  }
}

// PUT - Save portfolio
export async function PUT(request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const { data } = await request.json();

    if (!data) {
      return NextResponse.json({ error: 'Portfolio data is required' }, { status: 400 });
    }

    const portfolio = await prisma.portfolio.upsert({
      where: { userId: session.userId },
      update: {
        data: data,
        lastSavedAt: new Date(),
        version: 3,
      },
      create: {
        userId: session.userId,
        data: data,
        version: 3,
      },
    });

    return NextResponse.json({
      success: true,
      lastSavedAt: portfolio.lastSavedAt,
    });
  } catch (error) {
    console.error('Portfolio save error:', error);
    return NextResponse.json({ error: 'Failed to save portfolio' }, { status: 500 });
  }
}
