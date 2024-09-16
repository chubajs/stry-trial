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
      model: 'mistralai/pixtral-12b:free',
      messages: [
        { role: 'system', content: 'Вы - креативный писатель, который создает короткие, увлекательные истории на основе подсказок пользователей. Используйте переносы строк для разделения абзацев.' },
        { role: 'user', content: prompt }
      ],
      max_tokens: 2000,
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

export async function generateTitle(story: string): Promise<string> {
  console.log('Generating title for story...');
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': `${process.env.NEXT_PUBLIC_SITE_URL}`,
        'X-Title': 'Personalized Story Generator',
      },
      body: JSON.stringify({
        model: 'mistralai/pixtral-12b:free',
        messages: [
          { role: 'system', content: 'Вы - креативный писатель, который придумывает короткие и интересные названия для историй.' },
          { role: 'user', content: `Придумайте короткое и интересное название для следующей истории:\n\n${story.substring(0, 500)}...` }
        ],
      }),
    });

    console.log('Title generation response status:', response.status);
    console.log('Title generation response headers:', response.headers);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Title generation failed:', response.status, response.statusText, errorBody);
      throw new Error(`Failed to generate title: ${response.status} ${response.statusText}\n${errorBody}`);
    }

    const data = await response.json();
    console.log('Title generation response:', data);
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating title:', error);
    throw error;
  }
}