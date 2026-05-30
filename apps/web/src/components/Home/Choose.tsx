import Image from "next/image";
import React from "react";

const Choose = () => {
  return (
    <section className="py-20 bg-custom-dark px-2 ">
      <div className="grid md:grid-cols-2 gap-10 container mx-auto">
      <div className="text-center">
          <h4 className="text-2xl font-bold text-center">
          Build your
          {" "}
          <span className="text-primary">

          Dream team
          </span>
          </h4>
          <p className="text-sm text-muted-foreground">
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
