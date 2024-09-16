import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const { title, content, prompt, model } = await req.json();

  console.log('Received story data:', { title, contentLength: content.length, prompt, model });

  if (!content || content.trim().length === 0) {
    console.error('Received empty content');
    return NextResponse.json({ error: 'Content cannot be empty' }, { status: 400 });
  }

  try {
    const maxNumber = await prisma.story.aggregate({
      _max: {
        number: true
      }
    });

    const nextNumber = (maxNumber._max.number || 0) + 1;

    console.log('Creating story with number:', nextNumber);

    const story = await prisma.story.create({
      data: {
        title,
        content,
        prompt,
        model,
        number: nextNumber
      },
    });

    console.log('Story created successfully:', { id: story.id, number: story.number });

    return NextResponse.json({ id: story.id, number: story.number });
  } catch (error) {
    console.error('Failed to save story:', error);
    return NextResponse.json({ error: 'Failed to save story', details: (error as Error).message }, { status: 500 });
  }
}