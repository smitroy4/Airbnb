export function Footer() {
  return (
    <footer className="border-t bg-muted/30 py-8 mt-16">
      <div className="mx-auto max-w-7xl px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div>© {new Date().getFullYear()} StayGrid. All rights reserved.</div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-foreground">About</a>
          <a href="#" className="hover:text-foreground">Support</a>
          <a href="#" className="hover:text-foreground">Terms</a>
          <a href="#" className="hover:text-foreground">Privacy</a>
        </div>
      </div>
    </footer>
  );
}
