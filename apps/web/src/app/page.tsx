import Choose from "@/components/Home/Choose";
import Hero from "@/components/Home/Hero";

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
      <Choose />
    </main>
  );
}
