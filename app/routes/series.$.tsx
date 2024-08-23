import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { listPagesByTag } from "~/.server/controller/page";
import PageNotFound from "./$";

export const meta: MetaFunction<typeof loader> = ({ data }) => {
  return [
    { title: `tag ${data?.tag}` },
    { name: "description", content: `kitty's pages tagged ${data?.tag}` },
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
}: LoaderFunctionArgs) {
  const tag = params["*"];
  if (!tag) {
    throw new Response('Not Found', { status: 404 });
  }
  // TODO: Pagination using actions
  const pages = await listPagesByTag(tag, 100, 0, true);

  return json({ pages, tag: tag });
}

function getDateString(date: string) {
  const dateObj = new Date(date);
  return dateObj.toLocaleDateString("default", { month: "long", day: "numeric", year: "numeric" });
}

export default function SeriesListingPage() {
  const data = useLoaderData<typeof loader>();
  const offset = 0;
  return (
    <div className="font-sans p-4 max-w-2xl mx-auto">
      <div className="w-full flex align-middle mb-4">
        <h1 className="text-3xl">series: {data.tag}</h1>
      </div>
      <table className="w-full">
        <thead>
          <tr>
            <th className="text-left">Title</th>
            <th className="text-left">Chapter</th>
            <th className="text-left">Created</th>
          </tr>
        </thead>
        <tbody>
          {data.pages.map((page, i) => (
            <tr key={page.identifier}>
              <td>
                <Link to={`/pages/${page.identifier}`} className="text-blue-600 hover:text-blue-500 visited:text-purple-600 hover:visited:text-purple-500 dark:text-blue-600 dark:hover:text-blue-700 dark:visited:text-purple-500 dark:hover:visited:text-purple-600">
                  {page.title}
                </Link>
              </td>
              <td>
                <Link to={`/pages/${page.identifier}`} className="text-blue-600 hover:text-blue-500 visited:text-purple-600 hover:visited:text-purple-500 dark:text-blue-600 dark:hover:text-blue-700 dark:visited:text-purple-500 dark:hover:visited:text-purple-600">
                  {i + offset + 1}
                </Link>
              </td>
              <td>
                <Link to={`/pages/${page.identifier}`} className="text-black dark:text-white hover:text-gray-500 hover:dark:text-gray-300">
                  {getDateString(page.created)}
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ErrorBoundary() {
    return (
        <PageNotFound/>
    );
}