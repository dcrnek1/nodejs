import { clsx } from "clsx"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function useDelayedLoading(isFetching, isPending, delay = 50) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;
    if (isFetching && isPending) {
      timer = setTimeout(() => {
        setVisible(true)
      }, delay)
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [isFetching, isPending, delay])
  return visible;
}