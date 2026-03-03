import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

function generateSlug() {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

// POST - Create share link
export async function POST() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    // Deactivate existing links
    await prisma.shareLink.updateMany({
      where: { userId: session.userId },
      data: { isActive: false },
    });

    // Create new share link
    const link = await prisma.shareLink.create({
      data: {
        userId: session.userId,
        slug: generateSlug(),
        isActive: true,
      },
    });

    return NextResponse.json({ slug: link.slug, url: `/share/${link.slug}` });
  } catch (error) {
    console.error('Share link error:', error);
    return NextResponse.json({ error: 'Failed to create share link' }, { status: 500 });
  }
}

// GET - Get active share link
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    const link = await prisma.shareLink.findFirst({
      where: { userId: session.userId, isActive: true },
    });

    if (!link) {
      return NextResponse.json({ slug: null });
    }

    return NextResponse.json({
      slug: link.slug,
      url: `/share/${link.slug}`,
      viewCount: link.viewCount,
      createdAt: link.createdAt,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get share link' }, { status: 500 });
  }
}

// DELETE - Deactivate share link
export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  try {
    await prisma.shareLink.updateMany({
      where: { userId: session.userId },
      data: { isActive: false },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to deactivate link' }, { status: 500 });
  }
}
