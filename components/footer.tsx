export default function Footer() {
  return (
    <footer className="py-4 px-6 border-t mt-8">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} My Blog. All rights reserved.</p>
      </div>
    </footer>
  );
}
