import { Link } from "@remix-run/react";
import { MoonIcon, SunIcon } from "lucide-react";
import { setDarkModeState } from "~/util/darkModeState";

export interface HeaderProps {
    darkMode: boolean;
    setDarkMode: (darkMode: boolean) => void;
}

export function Header({ darkMode, setDarkMode }: HeaderProps): JSX.Element {
    return (
        <header className="w-full bg-gray-200 dark:bg-slate-700 flex">
            { /* Light / dark mode toggle in top right */ }
            <div className="items-center space-x-2 p-2">
                <h1 className="text-xl font-bold align-middle"><Link to="/">kitty :3</Link></h1>
            </div>
            <div className="ml-auto items-center space-x-2 p-2">
                <Link to="/admin" className="text-xs text-gray-800 dark:text-gray-200 hover:text-gray-500 hover:dark:text-gray-400">
                admin
                </Link>
            </div>
            <div className="items-center space-x-2 p-2">
                <button onClick={() => { setDarkMode(!darkMode); setDarkModeState(!darkMode) }}>
                    {
                        
                        darkMode
                            ? <MoonIcon className="w-6 h-6 text-yellow-200 align-middle" />
                            : <SunIcon className="w-6 h-6 text-yellow-600 align-middle" />
                    }
                </button>
            </div>
        </header>
    )
}