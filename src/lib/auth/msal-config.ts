import { type Configuration, LogLevel } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
    clientId: process.env.NEXT_PUBLIC_AZURE_CLIENT_ID || "",
    authority: `https://login.microsoftonline.com/${process.env.NEXT_PUBLIC_AZURE_TENANT_ID || "common"}`,
    redirectUri: process.env.NEXT_PUBLIC_AZURE_REDIRECT_URI || "http://localhost:3000/login",
    postLogoutRedirectUri: "/",
  },
  cache: {
    cacheLocation: "sessionStorage",
  },
  system: {
    loggerOptions: {
      logLevel: LogLevel.Warning,
      loggerCallback: () => {
        // MSAL requires a callback — intentionally empty
      },
    },
  },
};

export const loginRequest = {
  scopes: ["openid", "profile", "email"],
};
