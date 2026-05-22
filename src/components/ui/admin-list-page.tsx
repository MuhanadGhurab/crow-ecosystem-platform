import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";

interface AdminListPageProps {
  badge?: string;
  title: string;
  description: string;
  isEmpty: boolean;
  emptyTitle: string;
  emptyDescription?: string;
  emptyAction?: React.ReactNode;
  children: React.ReactNode;
}

export function AdminListPage({
  badge = "Platform Admin",
  title,
  description,
  isEmpty,
  emptyTitle,
  emptyDescription,
  emptyAction,
  children,
}: AdminListPageProps) {
  return (
    <div className="space-y-8">
      <PageHeader badge={badge} title={title} description={description} />
      {isEmpty ? (
        <EmptyState title={emptyTitle} description={emptyDescription} action={emptyAction} />
      ) : (
        <ul className="space-y-3">{children}</ul>
      )}
    </div>
  );
}
