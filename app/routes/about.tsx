import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => {
  return [
    { title: "about ally" },
    { name: "description", content: "tl;dr she's a cat" },
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

export default function AboutPage() {
  return (
    <div className="font-sans p-4 max-w-2xl mx-auto">
      <h1 className="text-3xl">about ally</h1>
      <div className="my-4">
        <p>hi</p>
      </div> 
    </div>
  );
}
