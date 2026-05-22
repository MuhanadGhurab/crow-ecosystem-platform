import type { EntityId } from "@/lib/entity-theme";

import { ENTITY_THEME } from "@/lib/entity-theme";



interface PageHeaderProps {

  title: string;

  description?: string;

  badge?: string;

  entity?: EntityId;

  actions?: React.ReactNode;

}



const ENTITY_SHELL: Record<EntityId, string> = {

  cem: "cc-entity-cem border-cyan-500/10",

  cybercrow: "cc-entity-cybercrow border-violet-500/10",

  sarea: "cc-entity-sarea border-rose-500/10",

};



export function PageHeader({

  title,

  description,

  badge,

  entity,

  actions,

}: PageHeaderProps) {

  const theme = entity ? ENTITY_THEME[entity] : null;

  const borderClass = entity ? ENTITY_SHELL[entity] : "border-cyan-500/10";



  return (

    <div

      className={`flex flex-col gap-4 border-b pb-6 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between ${borderClass}`}

    >

      <div className="min-w-0 flex-1">

        {badge && (

          <span className={`${theme?.badgeClass ?? "cc-star-badge"} mb-3 max-w-full truncate`}>

            {badge}

          </span>

        )}

        <h1 className="cc-page-title break-words">{title}</h1>

        {description && <p className="cc-page-lead">{description}</p>}

      </div>

      {actions && (

        <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">

          {actions}

        </div>

      )}

    </div>

  );

}

