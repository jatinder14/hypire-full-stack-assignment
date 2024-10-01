import { axiosV1Api } from "@/lib/axios";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { name } = body;
    const payload = {
      name,
    };

    const { pathname } = new URL(request.url);
    const menuId = pathname.split("/").pop();
    if (!menuId) {
      return NextResponse.json(
        { error: "Menu ID is missing" },
        { status: 400 }
      );
    }
    const response = await axiosV1Api.put(`/menu/${menuId}`, payload);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error updating menu:", error);
    return NextResponse.json(
      { error: "Failed to update menu" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { pathname } = new URL(request.url);
    const menuId = pathname.split("/").pop();
    if (!menuId) {
      return NextResponse.json(
        { error: "Menu ID is missing" },
        { status: 400 }
      );
    }
    const response = await axiosV1Api.delete(`/menu/${menuId}`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Error delete menu item:", error);
    return NextResponse.json(
      { error: "Failed to delte menu item" },
      { status: 500 }
    );
  }
}
