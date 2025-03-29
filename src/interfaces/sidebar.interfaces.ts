export interface ISidebarItem {
  name: string;
  path?: string;
  key: string;
  icon: JSX.Element;
  children?: ISidebarItem[];
}
