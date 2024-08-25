import { ActionFunctionArgs, json, redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { authenticateUser, getAuthResponseHeaders } from "~/.server/auth";
import { getUserModel } from "~/.server/controller/user";
import { getImageModel, uploadImage } from "~/.server/controller/image";
import { Image } from "~/model/image";

export const meta: MetaFunction = () => {
  return [
    { title: "Upload Image" },
    { name: "description", content: "Upload an image to the site" },
  ];
};

export const links: MetaFunction = () => {
  return [
    {
      rel: "icon",
      type: "image/png",
      href: "/bc_icon1s.png",
    },
  ];
};

export async function loader({
    request,
}: LoaderFunctionArgs) {
    const sessionResult = await authenticateUser(request);
    if (!sessionResult) {
        return redirect("/login");
    }
    const responseHeaders: HeadersInit = await getAuthResponseHeaders(sessionResult);
    return json({user: getUserModel(sessionResult.user)}, {headers: responseHeaders});
}

type ActionResponse = {
  success?: boolean;
  image?: Image
  error?: string;
};


export async function action({
  request,
}: ActionFunctionArgs) {
  const sessionResult = await authenticateUser(request);
  if (!sessionResult) {
    return redirect("/login");
  }
  const responseHeaders: HeadersInit = await getAuthResponseHeaders(sessionResult);

  const formData = await request.formData();
  const imageFile = formData.get("image") as File;

  if (!imageFile) {
    return json({ error: "No image file uploaded" }, { status: 400, headers: responseHeaders });
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(imageFile.type)) {
    return json({ error: "Invalid file type. Only JPEG, PNG, and GIF are allowed." }, { status: 400, headers: responseHeaders });
  }

  const maxSize = 5 * 1024 * 1024; // 5MB
  if (imageFile.size > maxSize) {
    return json({ error: "File size exceeds 5MB limit" }, { status: 400, headers: responseHeaders });
  }

  try {
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const resultImage = await uploadImage(
      buffer,
      sessionResult.user.id,
      imageFile.name,
      imageFile.type
    );

    return json({ success: true, image: getImageModel(resultImage)}, { headers: responseHeaders });
  } catch (error) {
    console.error("Error uploading image:", error);
    return json({ error: "An error occurred while uploading the image" }, { status: 500, headers: responseHeaders });
  }
}

export default function UploadImage() {
  const actionData = useActionData<typeof action>() as ActionResponse;

  const inputClassName = "w-full rounded-md border-4 py-1 px-2 focus:outline-none focus:ring-0 "
    + "border-gray-400 dark:border-slate-900 bg-gray-200 dark:bg-slate-800 "
    + "focus:border-gray-600 focus:dark:border-slate-700";

  return (
    <div className="font-sans p-4 max-w-2xl mx-auto">
      <div className="w-full border rounded-lg p-8 border-gray-300 bg-gray-200 dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-3xl mb-4">Upload Image</h1>
        <Form method="post" encType="multipart/form-data">
          <div className="my-4">
            <label htmlFor="image" className="block mb-2">Select Image</label>
            <input type="file" id="image" name="image" accept="image/jpeg,image/png,image/gif" className={inputClassName}/>
          </div>
          <div className="my-4">
            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Upload</button>
          </div>
        </Form>
        {actionData?.error && (
          <div className="text-red-600 dark:text-red-400 mt-4">
            {actionData.error}
          </div>
        )}
        {actionData?.success && (
          <div className="text-green-600 dark:text-green-400 mt-4">
            Image uploaded successfully!
            { actionData.image && (
              <a href={actionData.image?.url} className="text-blue-600 hover:text-blue-500 dark:text-blue-600 dark:hover:text-blue-700">
                <img src={actionData.image?.url} alt={actionData.image?.name} className="mt-4"/>
                View image
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
