import Cookie from "js-cookie";

export function getDarkModeState(loaderDefault: boolean) {
    const darkModeCookie = Cookie.get("darkMode");
    return darkModeCookie ? darkModeCookie === "true" : loaderDefault;
}

export function setDarkModeState(darkMode: boolean) {
    Cookie.set("darkMode", darkMode.toString(), { sameSite: "strict" });
}