import Image from "next/image";
import React from "react";

const Choose = () => {
  return (
    <section className="py-20 bg-custom-dark px-2 ">
      <div className="grid md:grid-cols-2 gap-10 container mx-auto">
        <div className="rounded-xl">
          <Image
            alt="new"
            className="object-cover w-full h-full rounded-xl"
            height={200}
            src={"/team.svg"}
            width={400}
          />
        </div>
        <div className="flex items-center justify-center">
          <h4 className="text-2xl font-bold text-center">
            Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ea
            eligendi, libero quos, voluptatem, omnis fugiat inventore minima
            voluptatum aliquam commodi sint laudantium assumenda odio
            consequuntur repudiandae praesentium quisquam? Et, blanditiis!
          </h4>
        </div>
      </div>
    </section>
  );
};

export default Choose;
