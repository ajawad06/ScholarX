const API_URL = "/api";

export async function api(path, options = {}) {
  const token = sessionStorage.getItem("scholarx-token");
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed." }));
    throw new Error(error.message || "Request failed.");
  }

  if (response.status === 204) return null;
  return response.json();
}

export async function fetchProtectedBlob(path) {
  const token = sessionStorage.getItem("scholarx-token");
  const response = await fetch(`${API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Request failed." }));
    throw new Error(error.message || "Request failed.");
  }

  return response.blob();
}

export async function openApplicationDocument(type, id, field) {
  const blob = await fetchProtectedBlob(
    `/instructors/applications/${type}/${id}/documents/${field}`,
  );
  const url = URL.createObjectURL(blob);
  window.open(url, "_blank", "noopener,noreferrer");
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
}
