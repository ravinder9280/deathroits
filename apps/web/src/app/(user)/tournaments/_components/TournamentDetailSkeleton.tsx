
import { Skeleton } from "@monorepo/ui/components/skeleton";

export default function TournamentDetailSkeleton() {
  return (
    <main className="max-h-[100dvh] overflow-hidden relative">
      <div className="container  mx-auto max-w-xl">
        <div className="py-[56px]">
          
          <div className="relative">
            <Skeleton className="w-full aspect-[16/9] rounded-none" />

          </div>

          <div className="container mx-auto px-4 py-4 space-y-6">
            
            <div className="space-y-3">
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-[90%]" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="bg-muted rounded-md p-3 flex flex-col items-center gap-2"
                >
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="h-5 w-14" />
                  <Skeleton className="h-3 w-16" />
                </div>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-5 w-32" />
              </div>


            </div>

            <div>
              <Skeleton className="h-5 w-40 mb-4" />

              <div className="space-y-2">
                {[1, 2].map((item) => (
                  <Skeleton
                    key={item}
                    className="h-12 w-full rounded-lg"
                  />
                ))}
              </div>
            </div>

            <div>
              <Skeleton className="h-5 w-20 mb-3" />

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-[95%]" />
                <Skeleton className="h-4 w-[85%]" />
                <Skeleton className="h-4 w-[70%]" />
              </div>
            </div>
          </div>
        </div>

      
      </div>
    </main>
  );
}