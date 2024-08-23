import { json, type MetaFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { listPagesByTag } from "~/.server/controller/page";
import { listFeaturedTags } from "~/.server/controller/tags";

export const meta: MetaFunction = () => {
  return [
    { title: "creative ally cat :3" },
    { name: "description", content: "writing site for ally :)" },
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
  const oneshotPages = await listPagesByTag("one-shot", 100, 0);
  const featuredTags = await listFeaturedTags(50, 0);

  return json({ oneshotPages, featuredTags });
}

export default function Index() {
  const data = useLoaderData<typeof loader>();
  const oneshotPages = data.oneshotPages;
  const featuredTags = data.featuredTags;
  return (
    <div className="font-sans p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl">ally&apos;s writing</h1>
      <hr className="my-4 text-white"/>
      <div className="my-4">
        <h2 className="text-2xl">links</h2>
        <ul className="list-disc mt-4 pl-6 space-y-2">
          <li>
            <Link
              className="text-blue-600 hover:text-blue-500 visited:text-purple-600 hover:visited:text-purple-500 dark:text-blue-600 dark:hover:text-blue-700 dark:visited:text-purple-500 dark:hover:visited:text-purple-600"
              to="/about"
            >
              about me :3
            </Link>
          </li>
        </ul>
      </div>
      <div className="my-4">
        <h2 className="text-2xl">one shots</h2>
        <ul className="list-disc mt-4 pl-6 space-y-2">
          {oneshotPages.map((page) => (
            <li key={page.identifier}>
              <Link
                className="text-blue-600 hover:text-blue-500 visited:text-purple-600 hover:visited:text-purple-500 dark:text-blue-600 dark:hover:text-blue-700 dark:visited:text-purple-500 dark:hover:visited:text-purple-600"
                to={`/pages/${page.identifier}`}
              >
                {page.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="my-4">
        <h2 className="text-2xl">chapter fics</h2>
        <ul className="list-disc mt-4 pl-6 space-y-2">
          {featuredTags.map((tag) => (
            <li key={tag.tag}>
              <Link
                className="text-blue-600 hover:text-blue-500 visited:text-purple-600 hover:visited:text-purple-500 dark:text-blue-600 dark:hover:text-blue-700 dark:visited:text-purple-500 dark:hover:visited:text-purple-600"
                to={`/series/${tag.tag}`}
              >
                {tag.tag.replaceAll("-", " ")}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
