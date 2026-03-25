const API_BASE_URL =
  import.meta.env.VITE_LANIEATS_API_BASE_URL || "http://localhost:8000/api/v1";

const ACCESS_TOKEN_KEY = "lani_access_token";
const REFRESH_TOKEN_KEY = "lani_refresh_token";

const isBrowser = typeof window !== "undefined";

export const getApiBaseUrl = () => API_BASE_URL;

export const getAccessToken = () => {
  if (!isBrowser) return "";
  return window.localStorage.getItem(ACCESS_TOKEN_KEY) || "";
};

export const getRefreshToken = () => {
  if (!isBrowser) return "";
  return window.localStorage.getItem(REFRESH_TOKEN_KEY) || "";
};

export const setTokens = (token: string, refreshToken?: string) => {
  if (!isBrowser) return;

  if (token) {
    window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
  }

  if (refreshToken) {
    window.localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearTokens = () => {
  if (!isBrowser) return;
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  window.localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const withBaseUrl = (path: string) => {
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
};

const refreshAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    throw new Error("Session expired. Please login again.");
  }

  const response = await fetch(withBaseUrl("/auth/refresh"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    data?: {
      token?: string;
      refreshToken?: string;
    };
  };

  if (!response.ok || payload.success === false || !payload.data?.token) {
    clearTokens();
    throw new Error(payload.message || "Session expired. Please login again.");
  }

  setTokens(payload.data.token, payload.data.refreshToken);
  return payload.data.token;
};

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  auth?: boolean;
  retryOnUnauthorized?: boolean;
};

export const apiRequest = async <T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> => {
  const {
    method = "GET",
    body,
    headers = {},
    auth = true,
    retryOnUnauthorized = true,
  } = options;

  const requestHeaders = new Headers(headers);

  if (body !== undefined && !(body instanceof FormData)) {
    requestHeaders.set("Content-Type", "application/json");
  }

  if (auth && !requestHeaders.has("Authorization")) {
    const token = getAccessToken();
    if (!token) {
      throw new Error("Please login to continue");
    }
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(withBaseUrl(path), {
    method,
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : body instanceof FormData
        ? body
        : JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    message?: string;
    data?: T;
    errors?: { field?: string; message?: string }[];
  };

  if (response.status === 401 && auth && retryOnUnauthorized) {
    const token = await refreshAccessToken();

    return apiRequest<T>(path, {
      ...options,
      headers: {
        ...headers,
        Authorization: `Bearer ${token}`,
      },
      retryOnUnauthorized: false,
    });
  }

  if (!response.ok || payload.success === false) {
    const firstError = payload.errors?.[0]?.message;
    throw new Error(firstError || payload.message || "Request failed");
  }

  return (payload.data || ({} as T)) as T;
};
