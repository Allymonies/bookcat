import { json, ActionFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, Form } from "@remix-run/react";
import { listImages, deleteImage } from "~/.server/controller/image";
import { Image } from "~/model/image";
import { XIcon } from "lucide-react";

export async function loader() {
  const images = await listImages(50, 0); // Fetch 50 images, starting from offset 0
  return json({ images });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const imageName = formData.get("imageName");

  if (typeof imageName === "string") {
    await deleteImage(imageName);
    return json({ success: true });
  }

  return json({ success: false }, { status: 400 });
}

export default function ImageList() {
  const { images } = useLoaderData<{ images: Image[] }>();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-black dark:text-white">Image List</h1>
        <Link to="/admin/upload-image" className="ml-auto align-middle h-full align-center text-black dark:text-white hover:text-gray-600 hover:dark:text-gray-300">
          Upload image
        </Link>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((image) => (
          <div key={image.url} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden relative">
            <img src={image.url} alt={image.name} className="w-full object-contain" />
            <div className="p-4">
              <p className="text-lg font-semibold mb-2 text-black dark:text-white">{image.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Type: {image.type}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Created: {new Date(image.created).toLocaleString()}
              </p>
            </div>
            <Form method="post" className="absolute top-2 right-2">
              <input type="hidden" name="imageName" value={image.name} />
              <button type="submit" className="p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors">
                <XIcon className="w-5 h-5 text-white" />
              </button>
            </Form>
          </div>
        ))}
      </div>
    </div>
  );
}
