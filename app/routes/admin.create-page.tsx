import { ActionFunctionArgs, json, redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { authenticateUser, getAuthResponseHeaders } from "~/.server/auth";
import { createPage, publishPage } from "~/.server/controller/page";
import { getUserModel } from "~/.server/controller/user";
import { parseMarkdown } from "~/.server/markdown";

export const meta: MetaFunction = () => {
  return [
    { title: "page list" },
    { name: "description", content: "kitty's cool pages" },
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

export async function action({
  request,
}: ActionFunctionArgs) {
  const sessionResult = await authenticateUser(request);
  if (!sessionResult) {
    return redirect("/login");
  }
  const responseHeaders: HeadersInit = await getAuthResponseHeaders(sessionResult);

  const body = await request.formData();
  const title = body.get("title");
  const slug = body.get("slug");
  const content = body.get("content");
  const publish = body.get("publish") ?? false;
  if (!title || !slug || !content) {
    return json({ error: "missing title, slug, or content" }, { status: 400, headers: responseHeaders });
  }
  if (typeof title !== "string" || typeof slug !== "string" || typeof content !== "string") {
    return json({ error: "invalid title, slug, or content" }, { status: 400, headers: responseHeaders });
  }
  const markdown = parseMarkdown(content);
  const page = await createPage(slug, title, markdown, content);
  
  if (publish) {
    await publishPage(page.identifier);
  }
  return redirect("/admin/page-list", { headers: responseHeaders });
}

export default function CreatePage() {
  const actionData = useActionData<typeof action>();

  const inputClassName = "w-full rounded-md border-4 py-1 px-2 focus:outline-none focus:ring-0 "
    + "border-gray-400 dark:border-slate-900 bg-gray-200 dark:bg-slate-800 "
    + "focus:border-gray-600 focus:dark:border-slate-700";
  return (
    <div className="font-sans p-4 max-w-2xl mx-auto">
      <div className="w-full border rounded-lg p-8 border-gray-300 bg-gray-200 dark:border-slate-700 dark:bg-slate-800">
        <h1 className="text-3xl">Create Page</h1>
        <Form method="post">
          <div className="my-4">
            <label htmlFor="title" className="block">title</label>
            <input type="text" id="title" name="title" className={inputClassName}/>
          </div>
          <div className="my-4">
            <label htmlFor="slug" className="block">slug</label>
            <input type="text" id="slug" name="slug" className={inputClassName}/>
          </div>
          <div className="my-4">
            <label htmlFor="content" className="block">content</label>
            <textarea id="content" name="content" className={inputClassName}></textarea>
          </div>
          <div className="my-4 align-middle">
            <label htmlFor="publish" className="inline-block">publish immediately</label>
            <div className="ml-2 inline-block align-middle">
              <input type="checkbox" id="publish" name="publish" className="
              appearance-none cursor-pointer w-6 h-6 rounded border-4
              border-gray-400 dark:border-slate-900 bg-gray-200 dark:bg-slate-700
              checked:bg-blue-500 checked:border-blue-700 
              "/>
            </div>
          </div>
          <div className="my-2">
            <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Create</button>
          </div>
        </Form>
        { actionData && actionData.error
          ? (<div className="text-red-600 dark:text-red-400 mt-4">
              {actionData.error}
          </div>)
          : undefined
        }
      </div>
    </div>
  );
}
