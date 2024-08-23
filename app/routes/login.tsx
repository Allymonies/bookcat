import cookie from "cookie";
import { ActionFunctionArgs, json, redirect, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { authenticateUser } from "~/.server/auth";
import { login, SESSION_DURATION } from "~/.server/controller/session";

export const meta: MetaFunction = () => {
  return [
    { title: "login" },
    { name: "description", content: "log in to cat" },
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
    if (sessionResult) {
        return redirect("/admin");
    }
    return json({});
}

export async function action({
    request,
  }: ActionFunctionArgs) {
    const body = await request.formData();
    const username = body.get("username");
    const password = body.get("password");
    if (!username || !password) {
        return json({ error: "missing username or password" }, { status: 400 });
    }
    const session = await login(username.toString(), password.toString());
    if (!session) {
        return json({ error: "invalid username or password" }, { status: 401 });
    }
    return redirect(`/admin`, {
        headers: {
            "Set-Cookie": cookie.serialize("token", session.sessionToken, {
                httpOnly: true,
                maxAge: SESSION_DURATION / 1000,
                sameSite: "strict",
            }),
        },
    });
  }

export default function LoginPage() {
  const actionData = useActionData<typeof action>();

  const inputClassName = "w-full rounded-md border-4 py-1 px-2 focus:outline-none focus:ring-0 "
    + "border-gray-400 dark:border-slate-900 bg-gray-200 dark:bg-slate-800 "
    + "focus:border-gray-600 focus:dark:border-slate-700";
  return (
    <div className="font-sans p-4 max-w-xl mx-auto text-center">
      <div className="w-9/12 ml-auto mr-auto mt-4 border rounded-lg border-gray-300 bg-gray-200 dark:border-slate-700 dark:bg-slate-800">
        <Form method="post">
            <div className="my-4 w-1/2 ml-auto mr-auto">
                <div className="text-left mb-2">
                    <label htmlFor="username" className="" >username</label>
                </div>
                <div className="w-full">
                    <input type="text" name="username" className={inputClassName} />
                </div>
            </div>
            <div className="my-4 w-1/2 ml-auto mr-auto">
                <div className="text-left mb-2">
                    <label htmlFor="password" className="" >password</label>
                </div>
                <div className="w-full">
                    <input type="password" name="password" className={inputClassName} />
                </div>
            </div>
            <div className="my-4">
                <button type="submit" className="p-2 px-8 rounded bg-white hover:bg-gray-100 dark:bg-slate-900 hover:dark:bg-slate-950">Login</button>
            </div>
        </Form>
        { actionData && actionData.error
          ? (<div className="text-red-600 dark:text-red-400 mb-4">
              {actionData.error}
          </div>)
          : undefined
        }
      </div>
    </div>
  );
}
