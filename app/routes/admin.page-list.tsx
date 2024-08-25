import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { authenticateUser, getAuthResponseHeaders } from "~/.server/auth";
import { listAllPages } from "~/.server/controller/page";
import { getUserModel } from "~/.server/controller/user";

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

    // TODO: Pagination using actions
    const pages = await listAllPages(100, 0, true);

    return json({user: getUserModel(sessionResult.user), pages}, {headers: responseHeaders});
}

function getDateString(date: string) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("default", { month: "long", day: "numeric", year: "numeric" });
}

export default function PageListingPage() {
  const data = useLoaderData<typeof loader>();
  return (
    <div className="font-sans p-4 max-w-2xl mx-auto">
      <div className="w-full flex align-middle mb-4">
        <h1 className="text-3xl">Page list</h1>
        <Link to="/admin/create-page" className="ml-auto align-middle h-full align-center text-black dark:text-white hover:text-gray-600 hover:dark:text-gray-300">
          Create new page
        </Link>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Title</th>
            <th className="text-left">Slug</th>
            <th className="text-left">Created</th>
            <th className="text-left">Updated</th>
          </tr>
        </thead>
        <tbody>
          {data.pages.map((page) => (
            <tr key={page.identifier}>
              <td>
                <Link to={`/pages/${page.identifier}/edit`} className="text-black dark:text-white hover:text-gray-500 hover:dark:text-gray-300">
                  {page.title}
                </Link>
              </td>
              <td>
                <Link to={`/pages/${page.identifier}/edit`} className="text-black dark:text-white hover:text-gray-500 hover:dark:text-gray-300">
                  {page.identifier}
                </Link>
              </td>
              <td>
                <Link to={`/pages/${page.identifier}`} className="text-black dark:text-white hover:text-gray-500 hover:dark:text-gray-300">
                  {getDateString(page.created)}
                </Link>
              </td>
              <td>
                <Link to={`/pages/${page.identifier}`} className="text-black dark:text-white hover:text-gray-500 hover:dark:text-gray-300">
                  {getDateString(page.updated)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
