import prisma from '@/lib/db';
import { notFound } from 'next/navigation';
import PortfolioPreview from '@/components/portfolio/PortfolioPreview';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const link = await prisma.shareLink.findUnique({
    where: { slug },
    include: { user: true },
  });

  if (!link || !link.isActive) {
    return { title: 'Portfolio Not Found' };
  }

  return {
    title: `${link.user.name}'s Portfolio — CompetencyFolio`,
    description: `Professional competency portfolio by ${link.user.name}`,
  };
}

export default async function SharePage({ params }) {
  const { slug } = await params;

  const link = await prisma.shareLink.findUnique({
    where: { slug },
    include: {
      user: {
        include: { portfolio: true },
      },
    },
  });

  if (!link || !link.isActive || !link.user.portfolio) {
    notFound();
  }

  // Increment view count
  await prisma.shareLink.update({
    where: { id: link.id },
    data: { viewCount: { increment: 1 } },
  });

  const portfolioData = link.user.portfolio.data;

  return (
    <div className="min-h-screen bg-stone-50">
      <PortfolioPreview data={portfolioData} ownerName={link.user.name} />
    </div>
  );
}
