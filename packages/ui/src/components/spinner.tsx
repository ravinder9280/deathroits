import { Loader2Icon, type LucideProps } from "lucide-react"
import { cn } from "@monorepo/utils/styles";

function Spinner({ className, ...props }: Omit<LucideProps, "ref">) {
  return (
    <Loader2Icon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  )
}

export { Spinner }
