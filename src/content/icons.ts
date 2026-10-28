import {
  BarChart3,
  BellRing,
  Code2,
  Database,
  Layers3,
  LayoutDashboard,
  Mail,
  PackageCheck,
  Palette,
  PanelsTopLeft,
  Phone,
  RefreshCw,
  Target,
  Users,
  Workflow,
  type LucideIcon,
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  BarChart3,
  BellRing,
  Code2,
  Database,
  Layers3,
  LayoutDashboard,
  Mail,
  PackageCheck,
  Palette,
  PanelsTopLeft,
  Phone,
  RefreshCw,
  Target,
  Users,
  Workflow,
};

/** Resolve icon identifiers stored in SITE_CONTENT.md to Lucide components. */
export function getIcon(name: string): LucideIcon {
  const Icon = iconMap[name];

  if (!Icon) {
    throw new Error(
      `Unknown Lucide icon "${name}" in SITE_CONTENT.md. Add it to src/content/icons.ts.`,
    );
  }

  return Icon;
}
