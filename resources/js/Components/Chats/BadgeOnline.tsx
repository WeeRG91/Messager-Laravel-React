import clsx from "clsx";

export default function BadgeOnline({ className }: { className?: string }) {
  return (
    <div
      className={clsx(
        "absolute bottom-1 right-0 h-2 w-2 rounded-full bg-success-default ring-white dark:bg-success-dark dark:ring-gray-200",
        className,
      )}
    ></div>
  );
}
