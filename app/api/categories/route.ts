// /app/api/categories/route.ts

import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabaseClient';

const CACHE_DURATION = 3600 * 1000; // 1 hour in milliseconds
let cache: { data: Record<string, string[]>; timestamp: number } | null = null;

export async function GET() {
  const now = Date.now();

  if (cache && now - cache.timestamp < CACHE_DURATION) {
    console.log('Returning cached data');
    return NextResponse.json(cache.data, { status: 200 });
  }

  try {
    // Fetch categories and subcategories
    const { data, error } = await supabase
      .from('blueDotsBizTable')
      .select('category, subcategory')
      .neq('category', null)
      .neq('subcategory', null);

    if (error) {
      console.error('Supabase Error:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Group subcategories under their respective categories
    const categoryMap: Record<string, string[]> = {};
    (data ?? []).forEach(({ category, subcategory }) => {
      if (category && subcategory) {
        if (!categoryMap[category]) {
          categoryMap[category] = [];
        }
        if (!categoryMap[category].includes(subcategory)) {
          categoryMap[category].push(subcategory);
        }
      }
    });

    // Update cache
    cache = {
      data: categoryMap,
      timestamp: now,
    };

    return NextResponse.json(categoryMap, { status: 200 });
  } catch (error) {
    console.error('Unexpected Error:', error);
    return NextResponse.json({ error: 'Failed to fetch categories and subcategories.' }, { status: 500 });
  }
}
