import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";

export default function Header() {
  return (
    <header className="py-4 px-6 border-b">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold">
          My Blog
        </Link>
        <div className="flex items-center">
          <nav className="mr-4">
            <Link href="/">
              Home
            </Link>
          </nav>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
