export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-black/[.08]">
      <div className="mx-auto max-w-6xl px-6 py-8 text-sm text-zinc-500">
        © {year} Optimum Peptides. All rights reserved.
      </div>
    </footer>
  );
}
