import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { sql } = await request.json();

    if (!sql) {
      return NextResponse.json(
        { error: 'SQL sorğusu tələb olunur' },
        { status: 400 }
      );
    }

    // Basic validation - only allow SELECT queries for safety
    const trimmedSql = sql.trim().toUpperCase();
    const isSelect = trimmedSql.startsWith('SELECT') ||
                     trimmedSql.startsWith('WITH') ||
                     (trimmedSql.includes('SET SEARCH_PATH') && trimmedSql.includes('SELECT'));

    if (!isSelect) {
      return NextResponse.json(
        { error: 'Yalnız SELECT sorğularına icazə verilir. INSERT, UPDATE, DELETE və s. istifadə edilə bilməz.' },
        { status: 403 }
      );
    }

    // Execute the SQL query
    const startTime = Date.now();
    const result = await query(sql);
    const executionTime = Date.now() - startTime;

    return NextResponse.json({
      success: true,
      data: result.rows,
      rowCount: result.rowCount,
      executionTime: `${executionTime}ms`,
      columns: result.fields?.map(f => ({
        name: f.name,
        dataType: f.dataTypeID,
      })) || [],
    });
  } catch (error: any) {
    console.error('SQL execution error:', error);

    // Parse PostgreSQL error for user-friendly message
    let errorMessage = error.message || 'SQL sorğusu zamanı xəta baş verdi';

    if (error.code === '42P01') {
      errorMessage = 'Cədvəl tapılmadı. Schema adını yoxlayın (demo_bank.customers)';
    } else if (error.code === '42703') {
      errorMessage = 'Sütun tapılmadı. Sütun adını yoxlayın';
    } else if (error.code === '42601') {
      errorMessage = 'SQL sintaksis xətası';
    }

    return NextResponse.json(
      {
        error: errorMessage,
        detail: error.detail || null,
        hint: error.hint || null,
        position: error.position || null,
        code: error.code || null,
      },
      { status: 500 }
    );
  }
}
