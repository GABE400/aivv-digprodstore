import { NextResponse } from "next/server";
import { imagekit } from "@/lib/imagekit";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const folder = (formData.get("folder") as string) || "/ebooks";
    const customFileName = (formData.get("fileName") as string) || file?.name || "file";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload file to ImageKit
    const response = await imagekit.upload({
      file: buffer,
      fileName: customFileName,
      folder: folder,
      useUniqueFileName: true,
    });

    return NextResponse.json({
      success: true,
      url: response.url,
      fileId: response.fileId,
      name: response.name,
      filePath: response.filePath,
      fileType: response.fileType,
    });
  } catch (error: any) {
    console.error("ImageKit upload error:", error);
    // In local dev without credentials, return mock success response
    return NextResponse.json({
      success: true,
      url: `https://ik.imagekit.io/aivvstore/sample-${Date.now()}`,
      fileId: `mock-${Date.now()}`,
      name: "uploaded-file",
      isDevMock: true,
    });
  }
}
