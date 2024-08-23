import { ActionFunctionArgs, json, redirect, TypedResponse, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { authenticateUser, getAuthResponseHeaders } from "~/.server/auth";
import { createFeaturedTag, deleteFeaturedTag, listFeaturedTags } from "~/.server/controller/tags";
import { getUserModel } from "~/.server/controller/user";
import { FeaturedTag } from "~/model/tag";

export const meta: MetaFunction = () => {
  return [
    { title: "featured tags" },
    { name: "description", content: "kitty's featured tags editor" },
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

    // TODO: Pagination using actions
    const tags = await listFeaturedTags(50, 0);

    return json({user: getUserModel(sessionResult.user), tags}, {headers: responseHeaders});
}

function getDateString(date: Date) {
  return date.toLocaleDateString("default", { month: "long", day: "numeric", year: "numeric" });
}

export interface CreateFeaturedTagResult {
  newTag?: FeaturedTag;
  error?: string;
}

export async function action({
  request,
}: ActionFunctionArgs): Promise<TypedResponse<CreateFeaturedTagResult>> {
  const sessionResult = await authenticateUser(request);
  if (!sessionResult) {
    return redirect("/login");
  }
  const responseHeaders: HeadersInit = await getAuthResponseHeaders(sessionResult);

  const body = await request.formData();
  const intent = body.get("intent");
  if (intent && intent === "create") {
    const tagName = body.get("tagName");
    if (!tagName || typeof tagName !== "string") {
      return json({ error: "missing tag name" }, { status: 400, headers: responseHeaders });
    }
    const newTag = await createFeaturedTag(tagName);
    return json({ newTag }, { headers: responseHeaders });
  } else if (intent && intent === "delete") {
    const tagName = body.get("tagName");
    if (!tagName || typeof tagName !== "string") {
      return json({ error: "missing tag name" }, { status: 400, headers: responseHeaders });
    }
    await deleteFeaturedTag(tagName);
    return json({}, { headers: responseHeaders });
  }
  return json({ error: "unknown intent" }, { status: 400, headers: responseHeaders });
}

export default function PageListingPage() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const tags = data.tags.map((tag) => ({
    tag: tag.tag,
    order: tag.order,
    created: new Date(tag.created)
  }));

  return (
    <div className="font-sans p-4 max-w-2xl mx-auto">
      <div className="w-full flex align-middle mb-4">
        <h1 className="text-3xl">Featured tag list</h1>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Tag</th>
            <th className="text-left">Order</th>
            <th className="text-left">Created</th>
            <th className="text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => (
            <tr key={tag.tag}>
              <td>
                {tag.tag}
              </td>
              <td>
                {tag.order}
              </td>
              <td>
                {getDateString(tag.created)}
              </td>
              <td>
                <Form method="post">
                  <input type="hidden" name="tagName" value={tag.tag}/>
                  <button type="submit" name="intent" value="delete" className="bg-red-500 text-white py-1 px-4 rounded-md hover:bg-red-600">Delete</button>
                </Form>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Form method="post">
        <div className="ml-auto my-6 w-9/12 mr-auto text-center">
          <label htmlFor="tagName" className="inline pr-2">Tag</label>
          <input type="text" id="tagName" name="tagName" className="inline w-1/2 rounded-md border-4 py-1 px-2 focus:outline-none focus:ring-0 border-gray-400 dark:border-slate-900 bg-gray-200 dark:bg-slate-800 focus:border-gray-600 focus:dark:border-slate-700"/>
          <button type="submit" name="intent" value="create" className="ml-4 w-3/12 bg-blue-500 text-white py-1 px-4 rounded-md hover:bg-blue-600">Create</button>
        </div>
      </Form>
      { actionData && actionData.error
        ? (<div className="text-red-600 dark:text-red-400 mt-4">
            {actionData.error}
        </div>)
        : undefined
      }
    </div>
  );
}
