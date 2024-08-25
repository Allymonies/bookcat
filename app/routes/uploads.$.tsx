import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/.server/db/db";
import { images } from "~/.server/db/schema/images";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs/promises";

export async function loader({ params }: LoaderFunctionArgs) {
    const filename = params["*"];
    if (!filename) {
        throw new Response("Not Found", { status: 404 });
    }

    
    // Query the database for the image
    const [image] = await db
        .select()
        .from(images)
        .where(eq(images.filename, filename))
        .limit(1);

    if (!image) {
        throw new Response("Image not found", { status: 404 });
    }

    try {
        // Construct the file path
        const filePath = path.join(process.cwd(), "uploads", image.filename);

        // Check if the file exists
        await fs.access(filePath);

        // Read the file
        const fileBuffer = await fs.readFile(filePath);

        // Set appropriate headers
        const headers = new Headers();
        headers.set("Content-Type", image.mimeType);
        headers.set("Content-Disposition", `inline; filename="${image.filename}"`);
        headers.set("Cache-Control", "public, max-age=31536000, immutable");

        // Return the file
        return new Response(fileBuffer, { headers });
    } catch (error) {
        console.error("Error serving image:", error);
        throw new Response("Internal Server Error", { status: 500 });
    }
}