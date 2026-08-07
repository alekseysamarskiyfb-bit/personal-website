export function ArrowUpRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M3.5 10.5 10.5 3.5M4.7 3.5h5.8v5.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="28"
      viewBox="0 0 16 28"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M8 0v26M1 19l7 7 7-7"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function Telegram({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M21.6 4.3 18.4 19.5c-.24 1.07-.88 1.33-1.78.83l-4.92-3.63-2.37 2.28c-.26.26-.48.48-1 .48l.35-5.02 9.13-8.25c.4-.35-.09-.55-.62-.2L6.02 13.1 1.17 11.6c-1.06-.33-1.08-1.06.22-1.57l18.95-7.3c.88-.32 1.65.2 1.26 1.57Z" />
    </svg>
  );
}
