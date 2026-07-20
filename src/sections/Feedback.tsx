import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Reveal, STAGGER } from "../components/Reveal";

const ENDPOINT = "https://formsubmit.co/ajax/kothok@bitops.bd";
const MAX_BYTES = 2 * 1024 * 1024;
const MAX_DIM = 1920;

type Status = "idle" | "submitting" | "success" | "error";
type Photo = { blob: Blob; name: string; resized: boolean };

const FIELD =
  "w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-base text-ink transition-colors placeholder:text-eink-500/60 focus:border-kothokgreen";

const LABEL = "mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-eink-500";

const FILE =
  "block w-full cursor-pointer text-sm text-eink-500 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-5 file:py-2.5 file:font-mono file:text-xs file:uppercase file:tracking-[0.14em] file:text-paper transition-opacity hover:file:opacity-85";

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// Downscale large phone photos so the attachment stays well under email limits.
// createImageBitmap with imageOrientation applies the phone's EXIF rotation so
// the snapshot isn't sideways. Falls back to the original on any failure.
async function shrinkImage(file: File): Promise<Blob> {
  try {
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
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.8));
    return blob ?? file;
  } catch {
    return file;
  }
}

export function Feedback() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);

  async function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (!file) {
      setPhoto(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setPhoto(null);
      setErrorMsg("Please choose an image file.");
      setStatus("error");
      return;
    }
    setPhotoBusy(true);
    const resized = file.size > MAX_BYTES;
    const blob = resized ? await shrinkImage(file) : file;
    setPhotoBusy(false);
    setPhoto({ blob, name: file.name, resized });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (photo) data.set("attachment", photo.blob, photo.name);
    setStatus("submitting");
    setErrorMsg("");
    try {
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
      const json = (await res.json()) as { success?: string | boolean; message?: string };
      const ok = json.success === true || json.success === "true";
      if (ok) {
        setStatus("success");
        form.reset();
        setPhoto(null);
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
                <input type="hidden" name="_subject" value="KoThok site feedback" />
                <input type="hidden" name="_template" value="table" />
                <input type="hidden" name="_captcha" value="false" />
                <input
                  type="text"
                  name="_honey"
                  className="hidden"
                  tabIndex={-1}
                  autoComplete="off"
                  aria-hidden
                />
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
                    Snap the screen if there's a bug to show. Photos over {formatSize(MAX_BYTES)} are auto-resized.
                  </p>
                  <input
                    id="fb-photo"
                    name="attachment"
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    className={FILE}
                  />
                  {photoBusy && <p className="mt-1.5 text-sm text-eink-500">Processing photo...</p>}
                  {photo && !photoBusy && (
                    <p className="mt-1.5 text-sm text-kothokgreen">
                      {photo.name} ({formatSize(photo.blob.size)}){photo.resized ? " - resized" : ""}
                    </p>
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
              </form>
            </Reveal>
          </>
        )}
      </div>
    </section>
  );
}
