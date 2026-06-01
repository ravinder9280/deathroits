import Choose from "@/components/Home/Choose";
import Contact from "@/components/Home/Contact";
import FAQ from "@/components/Home/FAQ";
import Footer from "@/components/Home/Footer";
import Games from "@/components/Home/Games";
import Hero from "@/components/Home/Hero";
import Trust from "@/components/Home/Trust";
import Whatsapp from "@/components/Home/Whatsapp";
import Work from "@/components/Home/Work";

export default function Page() {
  return (
    <main className="min-h-screen relative overflow-x-hidden">
      <div>
        <div
          className="
      absolute inset-0
      bg-[url('/bg.svg')]
      bg-cover
      bg-no-repeat
      max-h-[95vh]
      max-w-screen
    bg-[position:10%_center]
    md:bg-center
      opacity-40
      
      scale-110
      pointer-events-none
      "
        ></div>
        <div className="relative z-10">
          <Hero />
        </div>
      </div>
      <Trust />
      <Games />
      <Choose />
      <Work />
      <FAQ />
      <Whatsapp />
      <Contact/>
      <Footer/>
    </main>
  );
}
