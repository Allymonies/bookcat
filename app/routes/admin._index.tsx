import { json, redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { authenticateUser, getAuthResponseHeaders } from "~/.server/auth";
import { getUserModel } from "~/.server/controller/user";
import { Link } from "@remix-run/react";
import { ChevronRight } from "lucide-react";

export const meta: MetaFunction = () => {
  return [
    { title: "admin portal" },
    { name: "description", content: "kitty portal" },
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

export default function AdminPage() {
  return (
    <div className="font-sans p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl">Admin</h1>
      <div className="my-4 h-6">
        <div className="my-2">
            <Link to="/admin/page-list" className="h-full align-center text-black dark:text-white hover:text-gray-600 hover:dark:text-gray-300">
              Pages<ChevronRight className="inline align-middle"/>
            </Link>
        </div>
        <div className="my-2">
            <Link to="/admin/create-page" className="h-full align-center text-black dark:text-white hover:text-gray-600 hover:dark:text-gray-300">
              Create new page<ChevronRight className="inline align-middle"/>
            </Link>
        </div>
        <div className="my-2">
            <Link to="/admin/featured-tags" className="h-full align-center text-black dark:text-white hover:text-gray-600 hover:dark:text-gray-300">
              Featured tags<ChevronRight className="inline align-middle"/>
            </Link>
        </div>
      </div> 
    </div>
  );
}
