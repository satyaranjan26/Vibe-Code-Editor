import { scanTemplateDirectory } from "@/modules/playground/lib/path-to-json";
import { db } from "@/lib/db";
import { templatePaths } from "@/lib/template";
import path from "path";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  if (!id || id === "undefined") {
    return Response.json({ error: "Missing playground ID" }, { status: 400 });
  }

  let playground;
  try {
    playground = await db.playground.findUnique({ where: { id } });
  } catch (error) {
    console.error("DB error fetching playground:", error);
    return Response.json({ error: "Database error" }, { status: 500 });
  }

  if (!playground) {
    return Response.json({ error: "Playground not found" }, { status: 404 });
  }

  const templateKey = playground.template as keyof typeof templatePaths;
  const templatePath = templatePaths[templateKey];

  if (!templatePath) {
    return Response.json({ error: "Invalid template" }, { status: 404 });
  }

  try {
    const inputPath = path.join(process.cwd(), templatePath);

    // Scan in-memory — no filesystem writes needed (avoids Vercel read-only fs issue)
    const result = await scanTemplateDirectory(inputPath);

    return Response.json({ success: true, templateJson: result }, { status: 200 });
  } catch (error) {
    console.error("Error generating template JSON:", error);
    return Response.json({ error: "Failed to generate template" }, { status: 500 });
  }
}
