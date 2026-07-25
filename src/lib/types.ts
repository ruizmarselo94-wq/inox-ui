export type Theme = 'dark' | 'light' | 'carbon' | 'stainless' | 'titanium';
export type AccentColor = 'rust' | 'steel';
export type LayoutMode = 'sidebar' | 'topbar';
export type BadgeVariant = 'ok' | 'warn' | 'err' | 'info' | 'neutral';
export type BtnVariant = 'primary' | 'outline' | 'secondary' | 'ghost' | 'danger';
export type BtnSize = 'sm' | 'md' | 'lg';
export type AvatarSize = 'sm' | 'md' | 'lg';
export type ToastKind = 'ok' | 'err' | 'warn' | 'info';

export interface NavItem {
  key: string;
  label: string;
  icon: string;
  href: string;
}

export interface NavSection {
  label: string;
  items: NavItem[];
}

export interface UserProfile {
  name:          string;
  role:          string;
  avatarSrc?:    string;
  companyName?:  string | null;
  branchName?:   string | null;
  registerName?: string | null;
}

export interface DataColumn<T> {
  header: string;
  key: keyof T & string;
  class?: string;
  render?: (row: T) => string;
}

export type AlertVariant = 'warn' | 'err' | 'info';

export interface AlertItem {
  id:      string;
  label:   string;
  count:   number;
  href:    string;
  variant: AlertVariant;
}
