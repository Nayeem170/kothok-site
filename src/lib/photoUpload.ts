const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ykdvs21g/image/upload";
const UPLOAD_PRESET = "uaezvf1b";

const MAX_DIM = 2000;
const QUALITY = 0.82;
const QUALITY_FALLBACK = 0.66;
const SOFT_MAX = 1.5 * 1024 * 1024;

export const HARD_MAX = 25 * 1024 * 1024;

// SVG rejected: can carry scripts, is not a photo.
export function isAllowedImage(file: File): boolean {
  const type = (file.type || "").toLowerCase();
  if (type === "image/svg+xml") return false;
  return type.startsWith("image/");
}

// Re-encodes as compact JPEG with EXIF rotation; rejects renamed non-images.
async function shrinkImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  let { width, height } = bitmap;
  if (width > MAX_DIM || height > MAX_DIM) {
    const scale = MAX_DIM / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();
  let blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY),
  );
  if (blob && blob.size > SOFT_MAX) {
    blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", QUALITY_FALLBACK),
    );
  }
  if (!blob) throw new Error("Encoding failed");
  return blob;
}

export async function uploadToCloudinary(file: File): Promise<string> {
  let body: Blob;
  try {
    body = await shrinkImage(file);
  } catch {
    // Browser couldn't decode (rare, e.g. some HEIC in Chrome). Fall back to the
    // original - Cloudinary re-validates and rejects anything that isn't a real
    // image, so a disguised non-image still can't be stored.
    body = file;
  }
  const form = new FormData();
  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  form.append("file", body, `${baseName}.jpg`);
  form.append("upload_preset", UPLOAD_PRESET);
  const res = await fetch(CLOUDINARY_URL, { method: "POST", body: form });
  const json = (await res.json()) as { secure_url?: string; error?: { message?: string } };
  if (!res.ok || !json.secure_url) {
    throw new Error(json.error?.message || "Upload failed");
  }
  return json.secure_url;
}
