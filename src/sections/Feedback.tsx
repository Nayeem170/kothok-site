import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Reveal, STAGGER } from "../components/Reveal";

const WEB3FORMS_KEY = "651486d1-94e9-43df-8d78-56b6b47b8e7b";
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ykdvs21g/image/upload";
const UPLOAD_PRESET = "uaezvf1b";

const MAX_DIM = 2000;
const QUALITY = 0.82;
const QUALITY_FALLBACK = 0.66;
const SOFT_MAX = 1.5 * 1024 * 1024;
const HARD_MAX = 25 * 1024 * 1024;

type Status = "idle" | "submitting" | "success" | "error";

const FIELD =
  "w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-base text-ink transition-colors placeholder:text-eink-500/60 focus:border-kothokgreen";

const LABEL = "mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-eink-500";

const FILE =
  "block w-full cursor-pointer text-sm text-eink-500 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-5 file:py-2.5 file:font-mono file:text-xs file:uppercase file:tracking-[0.14em] file:text-paper transition-opacity hover:file:opacity-85";

// Only raster images. SVG is rejected on purpose - it can carry scripts and is
// not a photo. Anything without an image/* MIME type is rejected outright.
function isAllowedImage(file: File): boolean {
  const type = (file.type || "").toLowerCase();
  if (type === "image/svg+xml") return false;
  return type.startsWith("image/");
}

// Decodes the file as a raster image (throws if it is not really an image, so a
// renamed script/HTML can never get through) and re-encodes it as a compact
// JPEG. The long edge is capped so a screenshot stays legible while the upload
// stays small; EXIF rotation is applied so phone photos aren't sideways.
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
  let blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
  if (blob && blob.size > SOFT_MAX) {
    blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY_FALLBACK));
  }
  if (!blob) throw new Error("Encoding failed");
  return blob;
}

async function uploadToCloudinary(file: File): Promise<string> {
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

export function Feedback() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);

  function resetPhoto() {
    setPhotoUrl(null);
    setPhotoName("");
  }

  async function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) {
      resetPhoto();
      return;
    }
    if (!isAllowedImage(file)) {
      resetPhoto();
      setErrorMsg("Please choose an image (JPG, PNG, WebP, or GIF). Other file types aren't allowed.");
      setStatus("error");
      return;
    }
    if (file.size > HARD_MAX) {
      resetPhoto();
      setErrorMsg("That image is over 25 MB. Please choose a smaller one.");
      setStatus("error");
      return;
    }
    setPhotoBusy(true);
    setErrorMsg("");
    setStatus("idle");
    try {
      const url = await uploadToCloudinary(file);
      setPhotoUrl(url);
      setPhotoName(file.name);
    } catch {
      resetPhoto();
      setErrorMsg("That file couldn't be read as an image. Please choose a valid photo.");
      setStatus("error");
    } finally {
      setPhotoBusy(false);
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_KEY,
          subject: "KoThok site feedback",
          from_name: "KoThok site",
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          botcheck: data.get("botcheck") ?? "",
          ...(photoUrl ? { photo: photoUrl } : {}),
        }),
      });
      const json = (await res.json()) as { success: boolean; message?: string };
      if (json.success) {
        setStatus("success");
        form.reset();
        resetPhoto();
      } else {
        setStatus("error");
        setErrorMsg(typeof json.message === "string" ? json.message : "Submission failed. Try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Check your connection and try again.");
    }
  }

  return (
    <section id="feedback" className="relative py-28">
      <div className="mx-auto w-full max-w-2xl px-6 md:px-12">
        {status === "success" ? (
          <Reveal>
            <div className="rounded-2xl bg-ink/[0.02] p-8 text-center ring-1 ring-black/5">
              <h2 className="font-display text-h2 font-semibold text-ink">Thanks for the note.</h2>
              <p className="mt-3 text-eink-700">Your feedback landed. We read every message.</p>
              <button
                type="button"
                onClick={() => setStatus("idle")}
                className="mt-6 font-mono text-sm uppercase tracking-[0.14em] text-kothokgreen hover:underline"
              >
                Send another
              </button>
            </div>
          </Reveal>
        ) : (
          <>
            <Reveal>
              <p className="eyebrow mb-5">Feedback</p>
            </Reveal>
            <Reveal delay={STAGGER.lead}>
              <h2 className="font-display text-h2 font-semibold leading-tight text-ink">
                Tell us what you think.
              </h2>
            </Reveal>
            <Reveal delay={STAGGER.follow}>
              <p className="mt-6 text-lg leading-relaxed text-eink-700">
                Found a bug, have an idea, or want to share how you use KoThok? We read every message.
              </p>
            </Reveal>
            <Reveal delay={STAGGER.trail}>
              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <input type="checkbox" name="botcheck" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden />
                <div>
                  <label htmlFor="fb-name" className={LABEL}>
                    Name
                  </label>
                  <input
                    id="fb-name"
                    name="name"
                    type="text"
                    required
                    autoComplete="name"
                    placeholder="Your name"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="fb-email" className={LABEL}>
                    Email
                  </label>
                  <input
                    id="fb-email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className={FIELD}
                  />
                </div>
                <div>
                  <label htmlFor="fb-message" className={LABEL}>
                    Message
                  </label>
                  <textarea
                    id="fb-message"
                    name="message"
                    required
                    rows={5}
                    placeholder="What's on your mind?"
                    className={`${FIELD} resize-y`}
                  />
                </div>
                <div>
                  <label htmlFor="fb-photo" className={LABEL}>
                    Photo (optional)
                  </label>
                  <p className="mb-1.5 text-sm text-eink-500">
                    Snap the screen if there's a bug to show. Images only (JPG, PNG, WebP, GIF) - auto-resized.
                  </p>
                  <input id="fb-photo" type="file" accept="image/*" onChange={handlePhoto} className={FILE} />
                  {photoBusy && <p className="mt-1.5 text-sm text-eink-500">Uploading photo...</p>}
                  {photoUrl && !photoBusy && (
                    <p className="mt-1.5 break-all text-sm text-kothokgreen">{photoName} - attached</p>
                  )}
                </div>
                {status === "error" && (
                  <p role="alert" className="rounded-lg bg-kothokred/10 px-4 py-3 text-sm text-kothokred">
                    {errorMsg}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "submitting" || photoBusy}
                  className="inline-flex items-center gap-2.5 rounded-full bg-ink px-7 py-3.5 font-mono text-sm uppercase tracking-[0.14em] text-paper transition-opacity hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {status === "submitting" ? "Sending..." : "Send feedback"}
                </button>
                <p className="text-sm text-eink-500">
                  By submitting, you agree to our{" "}
                  <a href="#privacy" className="link-underline text-kothokgreen">
                    privacy policy
                  </a>
                  .
                </p>
              </form>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
