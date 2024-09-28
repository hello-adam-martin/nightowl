import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

// Add these export statements
export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        categories(id, name)
      `)
      .order('id')

    if (error) throw error

    // Transform the data to include category name directly in the product object
    const transformedData = data.map(product => ({
      ...product,
      category_name: product.categories.name,
      category_id: product.categories.id
    }))

    return NextResponse.json(transformedData)
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json({ error: 'An error occurred while fetching products' }, { status: 500 })
  }
}