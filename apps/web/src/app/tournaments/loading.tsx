import { Skeleton } from "@monorepo/ui/components/skeleton";
export default function Loading() {
  return (
    <main className="max-h-[100vh] overflow-hidden py-27 px-4">
      <div className="container mx-auto ">
      

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8">
          {Array.from({ length: 8 }).map((_, index) => (
            <div className="p-4 border space-y-4 rounded-xl">

            <Skeleton
              key={index}
              className="h-[200px] rounded-xl"
              />
              <Skeleton className="h-6"/>
              <Skeleton className="h-6"/>

          </div>
          ))}
        </div>
      </div>
    </main>
  );
}