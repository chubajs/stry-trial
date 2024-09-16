import { NextRequest, NextResponse } from 'next/server';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

export async function POST(req: NextRequest) {
  const { story } = await req.json();

  console.log('Generating title for story...');
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 секунд таймаут

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
          { role: 'system', content: 'Вы - креативный писатель, который придумывает короткие и интересные названия для историй. Ваш ответ должен содержать только одну строку с назв��нием, без кавычек или дополнительных пояснений.' },
          { role: 'user', content: `Придумайте короткое и интересное название для следующей истории:\n\n${story.substring(0, 500)}...` }
        ],
        max_tokens: 30,
        temperature: 0.7,
        stream: false,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    console.log('Title generation response status:', response.status);

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('Title generation failed:', response.status, response.statusText, errorBody);
      return NextResponse.json({ error: `Failed to generate title: ${response.status} ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    console.log('Title generation response:', data);
    
    const generatedTitle = data.choices[0].message.content.trim();
    // Убираем кавычки, если они есть
    const cleanTitle = generatedTitle.replace(/^["']|["']$/g, '');
    
    return NextResponse.json({ title: cleanTitle });
  } catch (error) {
    console.error('Error generating title:', error);
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        return NextResponse.json({ error: 'Title generation timed out' }, { status: 408 });
      }
    }
    return NextResponse.json({ error: 'Failed to generate title' }, { status: 500 });
  }
}