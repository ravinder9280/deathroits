
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/v1";

export const getApiOrigin = (): string => {
  const explicit = process.env.NEXT_PUBLIC_API_ORIGIN;
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }
  return baseURL.replace(/\/v1\/?$/, "");
};
export function imageUrlToAbsolute(url: string): string {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }
  return `${getApiOrigin()}${url.startsWith("/") ? "" : "/"}${url}`;
}