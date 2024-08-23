import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";

export const meta: MetaFunction = () => {
  return [
    { title: "page not found" },
    { name: "description", content: "page not found" },
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

export async function loader() {
    throw new Response('Not Found', { status: 404 })
}

export default function PageNotFound() {
    return (
        <div className="font-sans p-4 max-w-2xl mx-auto">
            <h1 className="font-bold text-2xl pb-2">page not found</h1>
            <p>sorry, that page doesn&apos;t exist :(</p>
            <div className="my-4">
                <Link to="/" className="text-blue-600 hover:text-blue-500 dark:text-blue-600 dark:hover:text-blue-700">
                    go back home?
                </Link>
            </div>
        </div>
    );
}

export function ErrorBoundary() {
    return (
        <PageNotFound/>
    );
}
