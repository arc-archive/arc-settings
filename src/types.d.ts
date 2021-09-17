export declare interface ArcConfigSchema {
  version: string;
  kind: string;
  groups: ArcConfigGroup[];
}

export declare interface ArcConfigGroup {
  name: string;
  description?: string;
  enabled: boolean;
  key: string;
  kind: string;
  items: (ArcConfigItem|ArcLinkItem|ArcConfigGroup)[];
  layout?: 'list' | 'input-group';
}

export declare interface ArcConfigItem { 
  kind: string;
  enabled: boolean,
  name: string;
  description?: string;
  key: string;
  default?: any;
  enum: string[];
  type: string;
  suffix?: string;
  /**
   * When set the item is not rendered as a list item but has it's own section with the input.
   */
  topLevel?: boolean;
}

export declare interface ArcLinkItem { 
  kind: string;
  enabled: boolean,
  name: string;
  target: string;
  description?: string;
}

export declare interface SettingsPage {
  /**
   * The sub-page to render.
   */
  page: ArcConfigGroup | ArcConfigItem;
  /**
   * The scroll position to restore after the user click on the back button.
   */
  scrollPosition?: number;
}
