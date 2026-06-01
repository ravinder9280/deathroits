import Image from "next/image";
import React from "react";

const Choose = () => {
  return (
    <section className="py-20 bg-custom-dark px-2 ">
      <div className="grid md:grid-cols-2 gap-10 container mx-auto">
        <div className="text-center flex flex-col items-center justify-center max-w-[500px]">
        <h2 className=' text-[40px] md:text-[64px] font-extrabold    mb-4 uppercase tracking-[-0.08em] leading-[0.95]'>

            Build your
            {" "}
            <span className="text-primary">

              Dream team
            </span>
          </h2>
          <p className='text-muted-foreground text-[16px] md:text-[18px] max-w-[700px] mx-auto leading-[1.6]'>

            Create a team, recruit players, and compete as one unit across all tournaments.
          </p>
        </div>
        <div className="rounded-xl">
          <Image
            alt="new"
            className="object-cover w-full h-full rounded-xl"
            height={200}
            src={"/team.svg"}
            width={400}
          />
        </div>

      </div>
    </section>
  );
};

export default Choose;
