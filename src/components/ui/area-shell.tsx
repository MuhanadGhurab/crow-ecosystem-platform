import Link from "next/link";

import { CrowMark } from "@/components/public/brand/crow-mark";

import { AreaShellMobileNav } from "@/components/ui/area-shell-mobile-nav";

import { EntityHub, type EntityHubLink } from "@/components/ui/entity-hub";

import { ShellNavLink } from "@/components/ui/shell-nav-link";

import { ScrollChipNav } from "@/components/ui/scroll-chip-nav";

import type { EntityId } from "@/lib/entity-theme";

import { ENTITY_THEME } from "@/lib/entity-theme";



export interface NavItem {

  href: string;

  label: string;

}

export interface NavGroup {

  heading: string;

  items: NavItem[];

}



interface AreaShellProps {

  title: string;

  subtitle?: string;

  badge?: string;

  experienceBadge?: string;

  entity?: EntityId;

  hubLinks?: EntityHubLink[];

  nav?: NavItem[];

  /** When set, renders grouped sidebar headings (flat `nav` used for mobile chips if omitted). */

  navGroups?: NavGroup[];

  headerActions?: React.ReactNode;

  children: React.ReactNode;

  mainClassName?: string;

}



export function AreaShell({

  title,

  subtitle,

  badge,

  experienceBadge,

  entity = "cem",

  hubLinks,

  nav,

  navGroups,

  headerActions,

  children,

  mainClassName,

}: AreaShellProps) {

  const theme = ENTITY_THEME[entity];

  const shellClass = `cc-app-shell cc-starfield cc-noise ${theme.shellClass}`;

  const flatNav =

    nav ??

    navGroups?.flatMap((g) => g.items) ??

    [];



  return (

    <div className={shellClass}>

      {flatNav.length > 0 && (

        <aside className="cc-sidebar">

          <div

            className="border-b p-4 sm:p-5"

            style={{ borderColor: "var(--entity-border)" }}

          >

            <CrowMark href="/" size="sm" showTagline={false} />

          </div>

          <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-3">

            {navGroups && navGroups.length > 0

              ? navGroups.map((group) => (

                  <div key={group.heading} className="mb-2">

                    <p className="px-2 pb-1 pt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">

                      {group.heading}

                    </p>

                    <div className="flex flex-col gap-0.5">

                      {group.items.map((item) => (

                        <ShellNavLink

                          key={item.href}

                          href={item.href}

                          label={item.label}

                          entity={entity}

                        />

                      ))}

                    </div>

                  </div>

                ))

              : flatNav.map((item) => (

                  <ShellNavLink key={item.href} href={item.href} label={item.label} entity={entity} />

                ))}

          </nav>

          <div

            className="border-t p-4 text-xs text-slate-500"

            style={{ borderColor: "var(--entity-border)" }}

          >

            <Link

              href="/"

              className="transition hover:opacity-90"

              style={{ color: "var(--entity-accent)" }}

            >

              ← Public site

            </Link>

          </div>

        </aside>

      )}



      <div className="flex min-w-0 flex-1 flex-col">

        <header className="cc-entity-shell-header sticky top-0 z-40 border-b bg-cc-elevated/90 backdrop-blur-xl supports-[backdrop-filter]:bg-cc-elevated/80">

          <div className="cc-safe-x flex flex-wrap items-center justify-between gap-3 py-3 sm:gap-4 sm:py-4">

            <div className="flex min-w-0 flex-1 items-start gap-3">

              {flatNav.length > 0 && (

                <AreaShellMobileNav nav={flatNav} title={title} entity={entity} />

              )}

              <div className="min-w-0 flex-1">

                <div className="mb-2 lg:hidden">

                  <CrowMark href="/" size="sm" showTagline={false} />

                </div>

                <div className="flex flex-wrap items-center gap-2">

                  {badge && (

                    <span className={`${theme.badgeClass} max-w-full truncate !py-1 !text-[10px]`}>

                      {badge}

                    </span>

                  )}

                  {experienceBadge && entity === "cem" && (

                    <span className="cc-entity-badge cc-entity-badge--sarea max-w-full truncate !py-1 !text-[10px]">

                      SAREA · {experienceBadge}

                    </span>

                  )}

                </div>

                <h1 className="font-display text-base font-bold leading-snug text-white sm:text-lg md:text-xl">

                  {title}

                </h1>

                {subtitle && (

                  <p className="mt-0.5 line-clamp-2 text-xs text-slate-400 sm:text-sm">{subtitle}</p>

                )}

              </div>

            </div>

            <div className="flex w-full shrink-0 flex-wrap items-center justify-end gap-2 sm:w-auto sm:gap-3">

              {hubLinks && hubLinks.length > 0 && <EntityHub links={hubLinks} />}

              {headerActions}

            </div>

          </div>



          {flatNav.length > 0 && (

            <ScrollChipNav

              className="border-t lg:hidden"

              style={{ borderColor: "var(--entity-border)" }}

              aria-label="Section navigation"

            >

              {flatNav.map((item) => (

                <ShellNavLink key={item.href} href={item.href} label={item.label} entity={entity} />

              ))}

            </ScrollChipNav>

          )}

        </header>



        <main

          className={`cc-safe-x relative z-10 flex-1 py-5 sm:py-8 ${mainClassName ?? ""}`}

        >

          <div className="mx-auto w-full max-w-7xl">{children}</div>

        </main>

      </div>

    </div>

  );

}

