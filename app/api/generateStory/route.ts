import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': `${process.env.NEXT_PUBLIC_SITE_URL}`,
      'X-Title': 'Personalized Story Generator',
    },
    body: JSON.stringify({
      model: 'mistralai/mistral-nemo',
      messages: [
        { role: 'system', content: 'Вы - креативный писатель, который создает короткие, увлекательные истории на основе подсказок пользователей. Используйте переносы строк для разделения абзацев.' },
        { role: 'user', content: prompt }
      ],
      stream: true,
    }),
  });

  if (!response.ok) {
    return NextResponse.json({ error: 'Failed to generate story' }, { status: 500 });
  }

  return new NextResponse(response.body, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}