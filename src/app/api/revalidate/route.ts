import { NextRequest, NextResponse } from 'next/server';
import { revalidateProperties } from '@/services/ssgDataService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret, tag } = body;

    // Проверяем секретный ключ для безопасности
    if (secret !== process.env.REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Инвалидируем кэш для апартаментов
    if (tag === 'properties' || tag === 'apartments') {
      await revalidateProperties();
      return NextResponse.json({ 
        message: 'Cache invalidated successfully',
        revalidated: true,
        now: Date.now()
      });
    }

    return NextResponse.json({ 
      message: 'Invalid tag',
      revalidated: false 
    }, { status: 400 });

  } catch (error) {
    console.error('Error revalidating cache:', error);
    return NextResponse.json({ 
      message: 'Error revalidating cache',
      revalidated: false 
    }, { status: 500 });
  }
}
