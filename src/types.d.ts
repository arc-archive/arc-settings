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
  items: (ArcConfigItem|ArcLinkItem)[];
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
}

export declare interface ArcLinkItem { 
  kind: string;
  enabled: boolean,
  name: string;
  target: string;
  description?: string;
}
