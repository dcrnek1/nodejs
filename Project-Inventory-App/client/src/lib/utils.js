import { clsx } from "clsx"
import { useEffect, useState } from "react"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function useDelayedLoading(isLoading, delay = 100) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer;

    if (isLoading) {
      timer = setTimeout(() => {
        setVisible(true)
      }, delay)
    } else {
      setVisible(false);
    }
    return () => clearTimeout(timer);
  }, [isLoading, delay])
  return visible;
}