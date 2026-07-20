import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { Reveal, STAGGER } from "../components/Reveal";

const ENDPOINT = "https://formsubmit.co/ajax/kothok@bitops.bd";

type Status = "idle" | "submitting" | "success" | "error";

const FIELD =
  "w-full rounded-xl border border-ink/15 bg-paper px-4 py-3 text-base text-ink transition-colors placeholder:text-eink-500/60 focus:border-kothokgreen";

const LABEL = "mb-1.5 block font-mono text-xs uppercase tracking-[0.14em] text-eink-500";

const FILE =
  "block w-full cursor-pointer text-sm text-eink-500 file:mr-4 file:cursor-pointer file:rounded-full file:border-0 file:bg-ink file:px-5 file:py-2.5 file:font-mono file:text-xs file:uppercase file:tracking-[0.14em] file:text-paper transition-opacity hover:file:opacity-85";

export function Feedback() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [photoName, setPhotoName] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
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
        setPhotoName("");
      } else {
        setStatus("error");
        setErrorMsg(typeof json.message === "string" ? json.message : "Submission failed. Try again.");
      }
    } catch {
      setStatus("error");
      setErrorMsg("Network error. Check your connection and try again.");
    }
  }

  function handlePhoto(e: ChangeEvent<HTMLInputElement>) {
    setPhotoName(e.currentTarget.files?.[0]?.name ?? "");
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
                  <p className="mb-1.5 text-sm text-eink-500">Snap the screen if there's a bug to show.</p>
                  <input
                    id="fb-photo"
                    name="attachment"
                    type="file"
                    accept="image/*"
                    onChange={handlePhoto}
                    className={FILE}
                  />
                  {photoName && <p className="mt-1.5 text-sm text-kothokgreen">{photoName}</p>}
                </div>
                {status === "error" && (
                  <p role="alert" className="rounded-lg bg-kothokred/10 px-4 py-3 text-sm text-kothokred">
                    {errorMsg}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "submitting"}
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
