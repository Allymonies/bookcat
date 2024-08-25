import { LoaderFunctionArgs } from "@remix-run/node";
import { db } from "~/.server/db/db";
import { images } from "~/.server/db/schema/images";
import { eq } from "drizzle-orm";
import path from "path";
import fs from "fs/promises";
import { Link, useRouteError } from "@remix-run/react";

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

export default function ViewUploadPage() {
    return (<></>);
}

export function ErrorBoundary() {
    const error = useRouteError();
    console.error(error);

    return (
        <div className="font-sans p-4 max-w-2xl mx-auto">
            <div className="w-full border rounded-lg p-8 border-red-300 bg-red-100 dark:border-red-700 dark:bg-red-900">
                <h1 className="text-3xl text-red-700 dark:text-red-300 mb-4">Error Loading Image</h1>
                <p className="text-red-600 dark:text-red-400">
                    {error instanceof Error
                        ? error.message
                        : error instanceof Response
                        ? `${error.status} ${error.statusText}`
                        : "An unexpected error occurred while trying to load the image."}
                </p>
                <p className="mt-4">
                    <Link to="/" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        Return to Home
                    </Link>
                </p>
            </div>
        </div>
    );
}