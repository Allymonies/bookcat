import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, json, redirect, useActionData, useLoaderData } from "@remix-run/react";
import { getPageLatestVersion, updatePage } from "~/.server/controller/page";
import PageNotFound from "./$";
import { authenticateUser, getAuthResponseHeaders } from "~/.server/auth";
import { parseMarkdown } from "~/.server/markdown";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data?.title ? `edit ${data.title}` : "page not found" },
        { name: "description", content: data?.title ? `editing ${data.title}` : "page not found" },
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
    params,
    request,
}: LoaderFunctionArgs) {
    const sessionResult = await authenticateUser(request);
    if (!sessionResult) {
        return redirect("/login");
    }
    const responseHeaders: HeadersInit = await getAuthResponseHeaders(sessionResult);
    if (!params.id) {
        throw new Response('Not Found', { status: 404, headers: responseHeaders });
    }
    const page = await getPageLatestVersion(params.id);
    if (!page) {
        throw new Response('Not Found', { status: 404, headers: responseHeaders });
    }
    return json(page, { headers: responseHeaders });
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
    const publish = body.get("publish") === "on";

    if (!title || !slug || !content) {
        return json({ error: "missing title, slug, or content" }, { status: 400, headers: responseHeaders });
    }
    if (typeof title !== "string" || typeof slug !== "string" || typeof content !== "string") {
        return json({ error: "invalid title, slug, or content" }, { status: 400, headers: responseHeaders });
    }

    const markdown = parseMarkdown(content);
    const updatedPage = await updatePage(slug, title, markdown, content, publish);
    return redirect(`/pages/${updatedPage.identifier}`, { headers: responseHeaders });
}

export default function EditPage() {
    const page = useLoaderData<typeof loader>();
    const actionData = useActionData<typeof action>();

    const inputClassName = "w-full rounded-md border-4 py-1 px-2 focus:outline-none focus:ring-0 "
        + "border-gray-400 dark:border-slate-900 bg-gray-200 dark:bg-slate-800 "
        + "focus:border-gray-600 focus:dark:border-slate-700";
    return (
        <div className="font-sans p-4 max-w-2xl mx-auto">
            <div className="w-full border rounded-lg p-8 border-gray-300 bg-gray-200 dark:border-slate-700 dark:bg-slate-800">
                <h1 className="text-3xl">Edit Page {page.title}</h1>
                <Form method="post">
                    <div className="my-4">
                        <label htmlFor="title" className="block">title</label>
                        <input defaultValue={page.title} type="text" id="title" name="title" className={inputClassName}/>
                    </div>
                    <div className="my-4">
                        <label htmlFor="slug" className="block">slug</label>
                        <input defaultValue={page.identifier} type="text" id="slug" name="slug" className={inputClassName}/>
                    </div>
                    <div className="my-4">
                        <label htmlFor="content" className="block">content</label>
                        <textarea defaultValue={page.content} id="content" name="content" className={inputClassName}></textarea>
                    </div>
                    <div className="my-4 align-middle">
                        <label htmlFor="publish" className="inline-block">publish</label>
                        <div className="ml-2 inline-block align-middle">
                            <input defaultChecked={page.published} type="checkbox" id="publish" name="publish" className="
                            appearance-none cursor-pointer w-6 h-6 rounded border-4
                            border-gray-400 dark:border-slate-900 bg-gray-200 dark:bg-slate-700
                            checked:bg-blue-500 checked:border-blue-700 
                            "/>
                        </div>
                    </div>
                    <div className="my-2">
                        <button type="submit" className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">update page</button>
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

export function ErrorBoundary() {
    return (
        <PageNotFound/>
    );
}