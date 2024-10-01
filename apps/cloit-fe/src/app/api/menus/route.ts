import { axiosV1Api } from "@/lib/axios";
import { NextResponse } from "next/server";
export async function GET() {
  try {
    const response = await axiosV1Api.get(`/menu`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error fetching menu:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { parent_id, name, menu_id, order, depth } = body;
    const payload = {
      parent_id,
      name,
      menu_id,
      order,
      depth,
    };

    const response = await axiosV1Api.post(`/menu`, payload);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error creating menu item:", error);
    return NextResponse.json(
      { error: "Failed to create menu item" },
      { status: 500 }
    );
  }
}
