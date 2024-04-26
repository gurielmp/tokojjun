import prismadb from '@/lib/prismadb';
import { NextResponse } from 'next/server';


const midtransClient = require('midtrans-client')

let snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.NEXT_SERVER_KEY_MIDTRANS,
})

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
  "Access-Control-Allow-Headers": "Authorization ,Content-Type",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: Request, { params }: { params: { storeId: string } }) {
  const { productIds } = await req.json()

  if (!productIds || productIds.length === 0) {
    return new NextResponse("Product ids are required", { status: 400 })
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds
      }
    }
  })

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId
            }
          }
        }))
      }
    }
  })

  const token = await snap.createTransactionToken(order);
  console.log("token", token)
  return NextResponse.json({ token }, { headers: corsHeaders })
}