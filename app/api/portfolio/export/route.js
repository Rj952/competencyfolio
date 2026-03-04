import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import prisma from '@/lib/db';

// GET - Export portfolio as JSON
export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  // Only admins can export JSON
  if (session.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  try {
    const portfolio = await prisma.portfolio.findUnique({
      where: { userId: session.userId },
    });

    if (!portfolio) {
      return NextResponse.json({ error: 'No portfolio found' }, { status: 404 });
    }

    const exportData = {
      _meta: {
        app: 'CompetencyFolio v3',
        author: 'Dr. Rohan Jowallah',
        exportedAt: new Date().toISOString(),
        version: portfolio.version,
      },
      ...portfolio.data,
    };

    return new NextResponse(JSON.stringify(exportData, null, 2), {
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="competencyfolio-${new Date().toISOString().slice(0, 10)}.json"`,
      },
    });
  } catch (error) {
    console.error('Export error:', error);
    return NextResponse.json({ error: 'Export failed' }, { status: 500 });
  }
}
