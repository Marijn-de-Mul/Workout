import { json, type ActionFunction } from "@remix-run/node";
import fetch from "node-fetch";
import http from "http";
import https from "https";

const BASE_URL = process.env.NODE_ENV === "production"
  ? "http://workout_backend:8080"
  : process.env.NODE_ENV === "test"
    ? "https://localhost:7087"
    : "https://localhost:7087";

export const action: ActionFunction = async ({ request }) => {
  const { endpoint, method, authorization, body, contentType } = await request.json();

  const url = `${BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    "Authorization": `Bearer ${authorization}`,
  };

  if (contentType) {
    headers["Content-Type"] = contentType;
  } else {
    headers["Content-Type"] = "application/json";
  }

  const agent = url.startsWith("https")
    ? new https.Agent({
        rejectUnauthorized: process.env.NODE_ENV !== "development",
      })
    : new http.Agent();

  const options: RequestInit = {
    method,
    headers,
    ...(method !== "GET" && method !== "HEAD" ? { body: JSON.stringify(body) } : {}),
    agent,
  };

  console.log("Proxy request to:", url);
  console.log("Options:", options);

  try {
    const response = await fetch(url, options as import("node-fetch").RequestInit);

    console.log("Proxy response status:", response.status);

    if (response.status === 204) {
      return new Response(null, { status: 204 });
    }

    const text = await response.text();
    console.log("Proxy response text:", text);

    let data;
    const responseContentType = response.headers.get("content-type");
    if (responseContentType && responseContentType.includes("application/json")) {
      try {
        data = JSON.parse(text);
      } catch (error) {
        data = { message: text };
      }
    } else {
      data = { message: text };
    }

    return json(data, { status: response.status });
  } catch (error) {
    console.error("Proxy error:", error);
    return json({ error: "Internal Server Error" }, { status: 500 });
  }
};