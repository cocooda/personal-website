import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-shell py-24">
      <div className="surface max-w-2xl rounded-lg p-8">
        <p className="font-mono text-xs font-bold uppercase text-steel">404</p>
        <h1 className="mt-4 text-4xl font-bold text-primary">This route is not part of the portfolio.</h1>
        <p className="mt-4 text-base leading-8 text-secondary">
          The public routes are the homepage, selected work case studies, and the stable resume path.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex min-h-11 items-center rounded-md border border-fog bg-fog px-4 py-2 text-sm font-semibold cta-ink"
        >
          Return home
        </Link>
      </div>
    </div>
  );
}
