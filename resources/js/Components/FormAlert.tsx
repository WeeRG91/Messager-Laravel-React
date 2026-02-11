import clsx from "clsx";

type FormAlertProps = {
  message: string;
  className?: string;
};

export default function FormAlert({ message, className }: FormAlertProps) {
  return (
    <div
      className={clsx(
        "rounded-lg bg-success-default/25 px-4 py-3 font-medium text-sm text-success-dark dark:bg-success-default/10",
        className,
      )}
    >
      {message}
    </div>
  );
}
