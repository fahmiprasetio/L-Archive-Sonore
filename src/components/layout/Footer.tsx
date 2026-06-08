export default function Footer() {
  return (
    <footer className="w-full bg-black text-sage-secondary pt-16 pb-8 mt-16 select-none font-sans">
      {/* Top Section: Info Grid */}
      <div className="mx-auto max-w-[96%] px-4 grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
        {/* Left Big Text */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-lg sm:text-xl md:text-2xl font-medium tracking-tight text-sage-primary leading-snug uppercase">
            An e-commerce platform dedicated to premium musical gear, refined aesthetics, and classic sound archiving.
          </h3>
        </div>

        {/* Right Columns */}
        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-sage-primary uppercase tracking-wider">Address</h4>
          <p className="text-sage-secondary/80 leading-relaxed font-light uppercase">
            Sound Avenue 42,<br />
            Jakarta, Indonesia
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-sage-primary uppercase tracking-wider">New Projects</h4>
          <p className="text-sage-secondary/80 leading-relaxed font-light uppercase">
            hello@larchivesonore.com
          </p>
        </div>

        <div className="space-y-2 text-xs">
          <h4 className="font-bold text-sage-primary uppercase tracking-wider">Call Us</h4>
          <p className="text-sage-secondary/80 leading-relaxed font-light uppercase">
            +62 812 3456 789
          </p>
        </div>
      </div>

      {/* Dotted Divider */}
      <div className="mx-auto max-w-[96%] px-4 border-t border-dotted border-sage-primary/30 my-6"></div>

      {/* Metadata links row */}
      <div className="mx-auto max-w-[96%] px-4 flex flex-wrap justify-between items-center text-[10px] tracking-widest text-sage-primary/80 uppercase mb-8 gap-4 font-light">
        <span>L&apos;Archive Sonore</span>
        <span>&copy; 2026</span>
        <div className="flex gap-8">
          <span className="hover:text-white cursor-pointer transition">Return Policy</span>
          <span className="hover:text-white cursor-pointer transition">Terms of Use</span>
        </div>
      </div>

      {/* Bottom Image Banner */}
      <div className="mx-auto max-w-[96%]">
        <div className="relative w-full overflow-hidden bg-transparent">
          {/* Background Image */}
          <img
            src="/gambar%20footer%203.png"
            alt="L'Archive Sonore Footer Background"
            className="w-full h-auto block opacity-90 brightness-[0.85] contrast-[1.05]"
          />
          {/* Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/10">
            <h2 className="text-white text-[9.5vw] font-medium tracking-wide text-center uppercase font-clash leading-none whitespace-nowrap scale-y-105 origin-center mt-35 drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
              L&apos;Archive Sonore
            </h2>
          </div>
        </div>
      </div>
    </footer>
  );
}
