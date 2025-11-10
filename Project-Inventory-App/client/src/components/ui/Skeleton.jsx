import {cn} from "@sglara/cn"

function Skeleton({ className, ...props }) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-el-bg animate-pulse rounded-md", className)}
      {...props}
    />
  );
}

export { Skeleton };
