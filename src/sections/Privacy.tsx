export function Privacy() {
  return (
    <main className="mx-auto w-full max-w-2xl px-6 pb-24 pt-32 md:px-12">
      <p className="eyebrow mb-5">Legal</p>
      <h1 className="font-display text-h1 font-semibold leading-tight text-ink">
        Privacy Policy
      </h1>
      <p className="mt-4 text-eink-500">Last updated: July 2026</p>

      <div className="mt-10 space-y-8 text-eink-700">
        <section>
          <h2 className="font-display text-lg font-semibold text-ink">What we collect</h2>
          <p className="mt-3 leading-relaxed">
            If you submit the feedback form on this site, we collect the name, email
            address, and message you provide. If you attach a photo, it is uploaded to
            a third-party image host and the link is included in the feedback email.
            No other data is collected. We do not use cookies, web analytics, or
            tracking pixels.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">How we use it</h2>
          <p className="mt-3 leading-relaxed">
            Feedback submissions are read and responded to individually. We do not
            send marketing email, sell your data, or share it with advertisers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Third parties</h2>
          <p className="mt-3 leading-relaxed">
            Your feedback passes through these services to reach us:
          </p>
          <ul className="mt-3 space-y-1.5 pl-5 [&>li]:list-disc">
            <li>
              <strong>Web3Forms</strong> - delivers the form submission as an email to
              our inbox.
            </li>
            <li>
              <strong>Cloudinary</strong> - hosts attached photos if you include one.
            </li>
            <li>
              <strong>Cloudflare</strong> - routes inbound email to our inbox (Email
              Routing) and manages DNS.
            </li>
            <li>
              <strong>Brevo</strong> - relays and signs outbound email when we reply
              (SMTP, DKIM).
            </li>
            <li>
              <strong>Google (Gmail)</strong> - stores feedback emails in our inbox.
            </li>
          </ul>
          <p className="mt-3 leading-relaxed">
            Each provider processes data under their own terms and GDPR data
            processing agreements.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">How long we keep it</h2>
          <p className="mt-3 leading-relaxed">
            Feedback emails and attachments are deleted after 12 months. DMARC
            aggregate reports are deleted after 3 months. If you request earlier
            deletion (see below), we remove your data within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Your rights</h2>
          <p className="mt-3 leading-relaxed">
            If you live in the EU, UK, or another jurisdiction with data protection
            laws, you have the right to:
          </p>
          <ul className="mt-3 space-y-1.5 pl-5 [&>li]:list-disc">
            <li>Access the personal data we hold about you.</li>
            <li>Request correction or deletion of your data.</li>
            <li>Withdraw consent or object to processing.</li>
            <li>Lodge a complaint with your local data protection authority.</li>
          </ul>
          <p className="mt-3 leading-relaxed">
            To exercise any of these rights, email{" "}
            <a
              href="mailto:kothok@bitops.bd"
              className="link-underline text-kothokgreen"
            >
              kothok@bitops.bd
            </a>{" "}
            from the address you used in the form. We respond within 30 days.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold text-ink">Contact</h2>
          <p className="mt-3 leading-relaxed">
            Questions about this policy or your data:{" "}
            <a
              href="mailto:kothok@bitops.bd"
              className="link-underline text-kothokgreen"
            >
              kothok@bitops.bd
            </a>
          </p>
        </section>
      </div>

      <a
        href="#top"
        className="mt-12 inline-flex items-center gap-2 font-mono text-sm uppercase tracking-[0.14em] text-kothokgreen hover:underline"
      >
        Back to KoThok
      </a>
    </main>
  );
}
