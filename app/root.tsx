import {
  isRouteErrorResponse,
  json,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import "./tailwind.css";
import { Header } from "./components/Header";
import { getDarkModeState } from "./util/darkModeState";
import { useState } from "react";
import { DarkModeContext } from "./darkModeContext";
import { LoaderFunctionArgs } from "@remix-run/node";
import cookie from "cookie";
import ErrorPage from "./routes/error";

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const cookieHeader = request.headers.get("Cookie");
  const cookies = cookie.parse(cookieHeader || "");
  return json({ darkMode: cookies.darkMode ? cookies.darkMode === "true" : true });
}

export function Layout({ children }: { children: React.ReactNode }) {
  const layoutInfo = useLoaderData<typeof loader>();
  const [darkMode, setDarkMode] = useState<boolean>(getDarkModeState(layoutInfo?.darkMode));
  return (
    <html lang="en" className={darkMode ? "dark" : ""}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className="bg-white dark:bg-slate-900 text-black dark:text-white">
        <DarkModeContext.Provider value={darkMode}>
          <Header darkMode={darkMode} setDarkMode={setDarkMode}/>
          {children}
          <ScrollRestoration />
          <Scripts />
        </DarkModeContext.Provider>
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
        <ErrorPage />
    );
  }

  return (
      <ErrorPage/>
  );
}