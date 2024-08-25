import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';
import { writeFile, unlink, stat, mkdir } from 'fs/promises';
import path from "path";
import { db } from '../db/db';
import { DbImage, images } from '../db/schema/images';
import { Image } from '~/model/image';

export function getImageModel(dbImage: DbImage): Image {
    return {
        name: dbImage.filename,
        type: dbImage.mimeType,
        url: `/uploads/${dbImage.filename}`,
        created: dbImage.created,
    };
}

export async function uploadImage(file: Buffer, authorId: number, filename: string, mimeType: string) {
    // Generate a unique filename
    const uniqueFilename = `${uuidv4()}${path.extname(filename)}`;

    // Define the upload directory
    const baseDir = process.env.BOOKCAT_DATA_DIR ?? process.cwd();
    const uploadDir = path.join(baseDir, 'uploads');

    try {
        await stat(uploadDir);
    } catch (err: unknown) {
        if (err instanceof Error) {
            if ("code" in err && err.code === "ENOENT") {
                await mkdir(uploadDir);
            } else {
                throw err;
            }
        } else {
            throw err;
        }
    }

    // Create the full file path
    const filePath = path.join(uploadDir, uniqueFilename);

    try {
        // Write the file to the uploads directory
        await writeFile(filePath, file);

        // Insert the image record into the database
        const [insertedImage] = await db.insert(images).values({
            author: authorId,
            mimeType,
            filename: uniqueFilename,
            path: filePath,
        }).returning();

        return insertedImage;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw new Error('Failed to upload image');
    }
}

export async function listImages(limit: number, offset: number): Promise<Image[]> {
    try {
        const dbImages = await db
            .select()
            .from(images)
            .orderBy(images.created)
            .limit(limit)
            .offset(offset);

        return dbImages.map(getImageModel);
    } catch (error) {
        console.error('Error listing images:', error);
        throw new Error('Failed to list images');
    }
}

export async function deleteImage(filename: string): Promise<boolean> {
    try {
        // First, fetch the image details
        const [imageToDelete] = await db
            .select()
            .from(images)
            .where(eq(images.filename, filename))
            .limit(1);

        if (!imageToDelete) {
            throw new Error('Image not found');
        }

        // Delete the file from the filesystem
        await unlink(imageToDelete.path);

        // Delete the image record from the database
        const result = await db
            .delete(images)
            .where(eq(images.filename, filename));

        return result.rowCount !== null && result.rowCount > 0;
    } catch (error) {
        console.error('Error deleting image:', error);
        throw new Error('Failed to delete image');
    }
}

export async function getImage(filename: string) {
    try {
        const [image] = await db
            .select()
            .from(images)
            .where(eq(images.filename, filename))
            .limit(1);

        if (!image) {
            return undefined;
        }

        return image;
    } catch (error) {
        console.error('Error fetching image:', error);
        throw new Error('Failed to fetch image');
    }
}