import * as React from "react"
import { Button, ButtonProps } from "@/components/ui/button"

interface LoadingButtonProps extends ButtonProps {
  loading?: boolean
}

export function LoadingButton({ loading, children, className, disabled, ...props }: LoadingButtonProps) {
  return (
    <Button 
      className={cn("relative overflow-hidden", className)}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center bg-inherit">
           <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </span>
      )}
      <span className={loading ? "opacity-0" : "opacity-100"}>
        {children}
      </span>
    </Button>
  )
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(" ")
}
