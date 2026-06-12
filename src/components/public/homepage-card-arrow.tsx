/** Circular arrow affordance — No Hesi news-card pattern */
export function HomepageCardArrow() {
  return (
    <span className="cc-home-card-arrow" aria-hidden>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 17L17 7M17 7H9M17 7v8"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}
