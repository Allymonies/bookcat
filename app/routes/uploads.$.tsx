import { LoaderFunctionArgs } from "@remix-run/node";
import fs from "fs/promises";
import { getImage } from "~/.server/controller/image";

export async function loader({ params }: LoaderFunctionArgs) {
    const filename = params["*"];
    if (!filename) {
        throw new Response("Not Found", { status: 404 });
    }

    // Get image
    const image = await getImage(filename);

    if (!image) {
        throw new Response("Image not found", { status: 404 });
    }

    try {
        // Check if the file exists
        await fs.access(image.path);

        // Read the file
        const fileBuffer = await fs.readFile(image.path);

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