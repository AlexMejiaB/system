import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET: Fetch assets or assignments
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'assets' or 'assignments'
    const employeeId = searchParams.get('employeeId')
    const assetType = searchParams.get('assetType')
    const status = searchParams.get('status')

    if (type === 'assignments') {
      const where: any = {}
      if (employeeId) where.employeeId = parseInt(employeeId)

      const assignments = await prisma.assetAssignment.findMany({
        where,
        include: {
          asset: true,
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
              department: { select: { name: true } },
              position: { select: { title: true } }
            }
          }
        },
        orderBy: {
          assignedDate: 'desc'
        }
      })

      return NextResponse.json(assignments)
    } else {
      // Fetch assets
      const where: any = {}
      if (assetType) where.type = assetType
      if (status) where.status = status

      const assets = await prisma.asset.findMany({
        where,
        include: {
          assignments: {
            where: {
              returnDate: null // Current assignments
            },
            include: {
              employee: {
                select: {
                  id: true,
                  name: true,
                  employeeId: true,
                  department: { select: { name: true } }
                }
              }
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      })

      return NextResponse.json(assets)
    }
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json(
      { error: 'Failed to fetch assets' },
      { status: 500 }
    )
  }
}

// POST: Create asset or assignment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, ...data } = body

    if (type === 'asset') {
      const asset = await prisma.asset.create({
        data: {
          name: data.name,
          type: data.assetType,
          serialNumber: data.serialNumber,
          model: data.model,
          brand: data.brand,
          purchaseDate: data.purchaseDate ? new Date(data.purchaseDate) : null,
          purchasePrice: data.purchasePrice ? parseFloat(data.purchasePrice) : null,
          warrantyExpiry: data.warrantyExpiry ? new Date(data.warrantyExpiry) : null,
          location: data.location,
          notes: data.notes
        }
      })

      return NextResponse.json(asset, { status: 201 })
    } else if (type === 'assignment') {
      // Check if asset is available
      const asset = await prisma.asset.findUnique({
        where: { id: parseInt(data.assetId) },
        include: {
          assignments: {
            where: {
              returnDate: null
            }
          }
        }
      })

      if (!asset) {
        return NextResponse.json(
          { error: 'Asset not found' },
          { status: 404 }
        )
      }

      if (asset.assignments.length > 0) {
        return NextResponse.json(
          { error: 'Asset is already assigned to another employee' },
          { status: 400 }
        )
      }

      // Create assignment
      const assignment = await prisma.assetAssignment.create({
        data: {
          assetId: parseInt(data.assetId),
          employeeId: parseInt(data.employeeId),
          assignedDate: new Date(data.assignedDate || new Date()),
          condition: data.condition,
          notes: data.notes
        },
        include: {
          asset: true,
          employee: {
            select: {
              id: true,
              name: true,
              employeeId: true,
              department: { select: { name: true } }
            }
          }
        }
      })

      // Update asset status to ASSIGNED
      await prisma.asset.update({
        where: { id: parseInt(data.assetId) },
        data: { status: 'ASSIGNED' }
      })

      return NextResponse.json(assignment, { status: 201 })
    }

    return NextResponse.json(
      { error: 'Invalid type specified' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Error creating asset data:', error)
    return NextResponse.json(
      { error: 'Failed to create asset data' },
      { status: 500 }
    )
  }
}

