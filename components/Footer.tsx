import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#040810] border-t border-cyan-900/20 text-slate-400">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <p className="text-cyan-400 font-bold text-lg mb-2">
            FS<span className="text-white">Labs</span>
          </p>
          <p className="text-sm leading-relaxed">
            FolubandSamuel Labs — delivering cutting-edge tech solutions, consulting, and cybersecurity services for forward-thinking businesses.
          </p>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Quick Links</p>
          <ul className="space-y-2 text-sm">
            {["/", "/about", "/services", "/contact"].map((href, i) => (
              <li key={href}>
                <Link href={href} className="hover:text-cyan-400 transition-colors">
                  {["Home", "About", "Services", "Contact"][i]}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-white font-semibold mb-3">Contact</p>
          <ul className="space-y-2 text-sm">
            <li>sekosamuel@gmail.com</li>
            <li>folubandsamuellabs.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cyan-900/20 py-4 text-center text-xs text-slate-600">
        © {new Date().getFullYear()} FolubandSamuel Labs. All rights reserved.
      </div>
    </footer>
  );
}
