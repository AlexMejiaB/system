import { NextResponse } from 'next/server'
import { PositionService } from '@/modules/position'
import { positionSchema } from '@/schemas/position'

// GET: Lista todas las posiciones
export async function GET() {
  const positions = PositionService.getAll()
  return NextResponse.json(positions)
}

// POST: Crea una nueva posición con validación Zod
export async function POST(req: Request) {
  const body = await req.json()
  const result = positionSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ error: result.error.format() }, { status: 400 })
  }

  const position = PositionService.create(result.data)
  return NextResponse.json(position, { status: 201 })
}
