import { NextResponse } from 'next/server'
import { PositionService } from '@/modules/position'
import { positionSchema } from '@/schemas/position'

// GET: Obtener una posición por ID
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const position = PositionService.getById(Number(params.id))
  return position
    ? NextResponse.json(position)
    : NextResponse.json({ error: 'No encontrado' }, { status: 404 })
}

// PUT: Actualizar una posición por ID con validación
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const result = positionSchema.safeParse(body)

  if (!result.success) {
    return NextResponse.json({ error: result.error.format() }, { status: 400 })
  }

  const updated = PositionService.update(Number(params.id), result.data)
  return updated
    ? NextResponse.json(updated)
    : NextResponse.json({ error: 'No encontrado' }, { status: 404 })
}

// DELETE: Eliminar una posición por ID
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const deleted = PositionService.delete(Number(params.id))
  return deleted
    ? NextResponse.json({ success: true })
    : NextResponse.json({ error: 'No encontrado' }, { status: 404 })
}
