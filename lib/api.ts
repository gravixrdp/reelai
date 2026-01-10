const API_BASE = "";

export async function fetcher(url: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "An error occurred" }));
    throw new Error(error.detail || "API Request Failed");
  }

  return res.json();
}

export const api = {
  get: (url: string) => fetcher(url),
  post: (url: string, body: any) => fetcher(url, { method: "POST", body: JSON.stringify(body) }),
  delete: (url: string) => fetcher(url, { method: "DELETE" }),
  // Add other methods as needed
};
