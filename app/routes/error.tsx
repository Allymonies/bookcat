import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "error" },
    { name: "description", content: "error :(" },
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

export default function ErrorPage() {
  return (
    <div className="font-sans p-4 max-w-2xl mx-auto">
      <h1>oops! something went wrong, sorry :(</h1>
    </div>
  );
}
