import { useEffect, useState } from "react";
import { fetchProtectedBlob } from "../api.js";

export function AuthMedia({ path, alt, style, className }) {
  const [src, setSrc] = useState(null);

  useEffect(() => {
    if (!path || !path.startsWith("profiles/")) {
      setSrc(null);
      return undefined;
    }

    let active = true;
    let objectUrl = null;

    fetchProtectedBlob(`/media/profile?path=${encodeURIComponent(path)}`)
      .then((blob) => {
        if (!active) return;
        objectUrl = URL.createObjectURL(blob);
        setSrc(objectUrl);
      })
      .catch(() => {
        if (active) setSrc(null);
      });

    return () => {
      active = false;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [path]);

  if (!src) return null;

  return <img src={src} alt={alt} style={style} className={className} />;
}
