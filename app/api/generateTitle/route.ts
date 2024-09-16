import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  const { story } = await req.json();

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

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Title generation failed:', response.status, response.statusText, errorBody);
      return NextResponse.json({ error: 'Failed to generate title' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json({ title: data.choices[0].message.content.trim() });
  } catch (error) {
    console.error('Error generating title:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}