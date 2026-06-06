export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-ink/65 dark:text-paper/65">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      <span>{label}</span>
    </div>
  );
}
