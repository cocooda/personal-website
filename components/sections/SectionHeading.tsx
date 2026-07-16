type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  body?: string;
};

export function SectionHeading({ eyebrow, title, body }: SectionHeadingProps) {
  return (
    <div className="max-w-3xl">
      <p className="mb-3 font-mono text-xs font-bold uppercase text-steel">{eyebrow}</p>
      <h2 className="text-balance text-3xl font-bold text-primary md:text-5xl">{title}</h2>
      {body ? <p className="mt-5 text-base leading-8 text-secondary md:text-lg">{body}</p> : null}
    </div>
  );
}
