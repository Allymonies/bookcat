import type { LoaderFunctionArgs, MetaFunction, TypedResponse } from "@remix-run/node";
import { json, Link, useLoaderData } from "@remix-run/react";
import { getPageLatestVersion } from "~/.server/controller/page";
import PageNotFound from "./$";
import { Markdown } from "~/components/markdown/Markdown";
import { TokensList } from "marked";
import { authenticateUser, getAuthResponseHeaders } from "~/.server/auth";
import { getUserModel } from "~/.server/controller/user";
import { Page } from "~/model/page";
import { User } from "~/model/user";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: data?.page.title ? `${data.page.title} | ally cat` : "page not found" },
    { name: "description", content: data?.page.title ? `read ${data.page.title} on ally cat :3` : "page not found" },
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

type LoaderData = TypedResponse<{ page: Page, user?: User }>;

export async function loader({
    params,
    request,
}: LoaderFunctionArgs): Promise<LoaderData> {
    if (!params.id) {
        throw new Response('Not Found', { status: 404 });
    }
    const page = await getPageLatestVersion(params.id);
    if (!page) {
        throw new Response('Not Found', { status: 404 });
    }
    const sessionResult = await authenticateUser(request);
    if (sessionResult) {
      const responseHeaders = await getAuthResponseHeaders(sessionResult);
      return json({page, user: getUserModel(sessionResult.user)}, {headers: responseHeaders});
    } else {
      if (!page.published) {
        throw new Response('Not Found', { status: 404 });
      }
      return json({page});
    }
}

export default function ContentPage() {
    const data = useLoaderData<typeof loader>();
    const page = data.page;
    return (
        <div className="font-sans p-4 max-w-2xl mx-auto">
            <div className="w-full flex align-middle mb-4">
              <h1 className="font-bold text-2xl pb-2">{page.title}</h1>
              { data.user && (
                  <Link to={`/pages/${page.identifier}/edit`} className="ml-auto align-middle h-full align-center text-black dark:text-white hover:text-gray-600 hover:dark:text-gray-300">
                    Edit
                  </Link>
                )
              }
            </div>
            <Markdown markdown={page.markdown as TokensList}/>
        </div>
    );
}

export function ErrorBoundary() {
    return (
        <PageNotFound/>
    );
}
