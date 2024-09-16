import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const id = params.id;

  console.log('Fetching story with id:', id);

  try {
    const story = await prisma.story.findUnique({
      where: { id },
    });

    if (!story) {
      console.log('Story not found');
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    console.log('Story found:', story);
    return NextResponse.json(story);
  } catch (error) {
    console.error('Failed to get story:', error);
    return NextResponse.json({ error: 'Failed to get story' }, { status: 500 });
  }
}