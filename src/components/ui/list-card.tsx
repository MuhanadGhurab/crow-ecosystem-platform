interface ListCardProps {
  children: React.ReactNode;
  className?: string;
}

export function ListCard({ children, className = "" }: ListCardProps) {
  return <li className={`cc-list-card ${className}`.trim()}>{children}</li>;
}
