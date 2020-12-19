const schema = {
  version: "1.0.0",
  kind: "ARC#Config",
  groups: [
    {
      name: "View",
      description: "Settings related to the application look and feel",
      enabled: true,
      key: "view",
      kind: "ARC#ConfigGroup",
      items: [
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "List type",
          description: "The variant of most list items in the UI",
          key: "view.listType",
          default: "default",
          enum: ["default", "comfortable", "compact"],
          type: "string",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Popup menu",
          description: "Enables detachable application menu",
          key: "view.popupMenu",
          default: true,
          type: "boolean",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Drag and drop",
          description: "Enables drag and drop in the application.",
          key: "view.draggableEnabled",
          default: true,
          type: "boolean",
        },
      ],
    },
    {
      name: "Request",
      description: "Settings related to the request processing",
      enabled: true,
      kind: "ARC#ConfigGroup",
      key: "request",
      items: [
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Request timeout",
          description: "The default timeout for a request. In seconds.",
          key: "request.timeout",
          suffix: "sec",
          default: 90,
          type: "number",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Follow redirects",
          description: "Enables request redirection.",
          key: "request.followRedirects",
          default: true,
          type: "boolean",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Enable system variables",
          description: "Allow using system variables.",
          key: "request.useSystemVariables",
          default: true,
          type: "boolean",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Enable application variables",
          description: "Allow using application defined variables.",
          key: "request.useAppVariables",
          default: true,
          type: "boolean",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Ignore content-* headers for GET",
          description:
            "Automatically removes content-* headers from the request for GET operation.",
          key: "request.ignoreContentOnGet",
          default: true,
          type: "boolean",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Default headers",
          description: 'Adds "user-agent" and "accept" headers when missing.',
          key: "request.defaultHeaders",
          default: false,
          type: "boolean",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Disable cookies",
          description: "When set it does not process cookies with the request.",
          key: "request.ignoreSessionCookies",
          default: false,
          type: "boolean",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Validate certificates",
          description: "Validate certificates when making a connection.",
          key: "request.validateCertificates",
          default: false,
          type: "boolean",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Use Node.JS request engine",
          description: "Uses Node.JS HTTP engine instead of ARC's.",
          key: "request.nativeTransport",
          default: false,
          type: "boolean",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "OAuth 2 redirect URI",
          description: "The default OAuth 2 redirect URI.",
          key: "request.oauth2redirectUri",
          type: "string",
          default: "https://auth.advancedrestclient.com/oauth-popup.html",
        },
      ],
    },
    {
      name: "Privacy",
      description: "Settings related to your privacy",
      enabled: true,
      key: "privacy",
      kind: "ARC#ConfigGroup",
      items: [
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Telemetry",
          description: "Enable limited and anonymous usage statistics.",
          key: "privacy.telemetry",
          default: true,
          type: "boolean",
        },
        {
          kind: "ARC#LinkItem",
          enabled: true,
          name: "Privacy statement",
          target: "https://docs.google.com/document/d/1BzrKQ0NxFXuDIe2zMA-0SZBNU0P46MHr4GftZmoLUQU/edit",
        },
      ],
    },
    {
      name: "History",
      description: "Settings related to the history data storage",
      enabled: true,
      key: "history",
      kind: "ARC#ConfigGroup",
      items: [
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Enabled",
          description: "Enable history recording.",
          key: "history.enabled",
          default: true,
          type: "boolean",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Fast search",
          description: "Use faster but less accurate search.",
          key: "history.fastSearch",
          default: true,
          type: "boolean",
        },
      ],
    },
    {
      name: "Request editor",
      description: "Specialized setting for the request editor",
      enabled: true,
      key: "requestEditor",
      kind: "ARC#ConfigGroup",
      items: [
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Auto encode",
          description: "Automatically encodes and decodes values in the www-url-form-encoded body editor.",
          key: "requestEditor.autoEncode",
          default: false,
          type: "boolean",
        },
        {
          kind: "ARC#ConfigItem",
          enabled: true,
          name: "Body editor",
          description: "The editor to use with the body editor.",
          key: "requestEditor.bodyEditor",
          type: "string",
          default: "Monaco",
          enum: ["Monaco", "CodeMirror"],
        },
      ],
    },
  ],
};
Object.freeze(schema);
Object.freeze(schema.groups);
export default schema;