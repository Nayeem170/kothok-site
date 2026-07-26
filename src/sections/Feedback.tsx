import { useEffect, useRef, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Reveal, STAGGER } from "../components/Reveal";
import { PrivacyContent } from "./Privacy";
import { HARD_MAX, isAllowedImage, uploadToCloudinary } from "../lib/photoUpload";

const WEB3FORMS_KEY = "651486d1-94e9-43df-8d78-56b6b47b8e7b";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD =
  "w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-base text-ink transition-colors placeholder:text-eink-500/60 focus:border-kothokgreen";

const LABEL = "mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-eink-500";

const FILE =
  "block w-full cursor-pointer text-sm text-eink-500 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-5 file:py-2.5 file:font-mono file:text-xs file:uppercase file:tracking-[0.14em] file:text-paper transition-opacity hover:file:opacity-85";

export function Feedback() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [photoName, setPhotoName] = useState("");
  const [photoBusy, setPhotoBusy] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const privacyCloseRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!showPrivacy) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    privacyCloseRef.current?.focus();
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowPrivacy(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => {
      window.removeEventListener("keydown", handleEscape);
      previouslyFocused?.focus();
    };
  }, [showPrivacy]);

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
      setErrorMsg(
        "Please choose an image (JPG, PNG, WebP, or GIF). Other file types aren't allowed.",
      );
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
        setErrorMsg(
          typeof json.message === "string" ? json.message : "Submission failed. Try again.",
        );
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
                Found a bug, have an idea, or want to share how you use KoThok? We read every
                message.
              </p>
            </Reveal>
            <Reveal delay={STAGGER.trail}>
              <form onSubmit={handleSubmit} className="mt-10 space-y-5">
                <input
                  type="checkbox"
                  name="botcheck"
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
                    Snap the screen if there's a bug to show. Images only (JPG, PNG, WebP, GIF) -
                    auto-resized.
                  </p>
                  <input
                    id="fb-photo"
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    className={FILE}
                  />
                  {photoBusy && <p className="mt-1.5 text-sm text-eink-500">Uploading photo...</p>}
                  {photoUrl && !photoBusy && (
                    <p className="mt-1.5 break-all text-sm text-kothokgreen">
                      {photoName} - attached
                    </p>
                  )}
                </div>
                {status === "error" && (
                  <p
                    role="alert"
                    className="rounded-lg bg-kothokred/10 px-4 py-3 text-sm text-kothokred"
                  >
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
                  <button
                    type="button"
                    onClick={() => setShowPrivacy(true)}
                    className="link-underline text-kothokgreen"
                  >
                    privacy policy
                  </button>
                  .
                </p>
              </form>
            </Reveal>
          </>
        )}
      </div>

      {showPrivacy && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 backdrop-blur-sm"
          onClick={() => setShowPrivacy(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Privacy Policy"
            className="relative my-8 w-full max-w-2xl rounded-2xl bg-paper p-8 shadow-xl md:p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={privacyCloseRef}
              type="button"
              onClick={() => setShowPrivacy(false)}
              className="absolute right-5 top-5 font-mono text-sm uppercase tracking-[0.14em] text-eink-500 hover:text-ink"
            >
              Close
            </button>
            <p className="eyebrow mb-3">Legal</p>
            <h2 className="font-display text-2xl font-bold text-ink md:text-3xl">Privacy Policy</h2>
            <p className="mt-2 text-sm text-eink-500">Last updated: July 2026</p>
            <div className="mt-8">
              <PrivacyContent />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
