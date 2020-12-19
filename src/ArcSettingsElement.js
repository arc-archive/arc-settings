/* eslint-disable class-methods-use-this */
import { LitElement, html } from 'lit-element';
import { ArcNavigationEvents, ConfigEvents } from '@advanced-rest-client/arc-events';
import '@anypoint-web-components/anypoint-item/anypoint-item.js';
import '@anypoint-web-components/anypoint-item/anypoint-item-body.js';
import '@anypoint-web-components/anypoint-input/anypoint-input.js';
import '@anypoint-web-components/anypoint-switch/anypoint-switch.js';
import '@anypoint-web-components/anypoint-button/anypoint-icon-button.js';
import '@advanced-rest-client/arc-icons/arc-icon.js';
import '@anypoint-web-components/anypoint-dropdown-menu/anypoint-dropdown-menu.js';
import '@anypoint-web-components/anypoint-listbox/anypoint-listbox.js';
import elementStyles from './settings.css.js';
import schema from './schema.js';

/** @typedef {import('@advanced-rest-client/arc-types').Config.ARCConfig} ARCConfig */
/** @typedef {import('@anypoint-web-components/anypoint-switch').AnypointSwitch} AnypointSwitch */
/** @typedef {import('@anypoint-web-components/anypoint-listbox').AnypointListbox} AnypointListbox */
/** @typedef {import('lit-html').TemplateResult} TemplateResult */
/** @typedef {import('./types').ArcConfigItem} ArcConfigItem */
/** @typedef {import('./types').ArcConfigGroup} ArcConfigGroup */
/** @typedef {import('./types').ArcLinkItem} ArcLinkItem */

export const subPageLinkHandler = Symbol('subPageLinkHandler');
export const subPageLinkItem = Symbol('subPageLinkItem');
export const listChangeHandler = Symbol('listChangeHandler');
export const dropdownOptions = Symbol('dropdownOptions');
export const booleanItemTemplate = Symbol('booleanItemTemplate');
export const redirectToggleFocus = Symbol('redirectToggleFocus');
export const toggleItemHandler = Symbol('toggleItemHandler');
export const toggleBooleanValue = Symbol('toggleBooleanValue');
export const linkItemHandler = Symbol('linkItemHandler');
export const configLinkItem = Symbol('configLinkItem');
export const inputItemTemplate = Symbol('inputItemTemplate');
export const settingsItemTemplate = Symbol('settingsItemTemplate');
export const groupTemplate = Symbol('groupTemplate');
export const inputChangeHandler = Symbol('inputChangeHandler');
export const backSubPage = Symbol('backSubPage');
export const subPageTemplate = Symbol('subPageTemplate');
export const schemaTemplate = Symbol('schemaTemplate');

const SupportedConfigItems = ['ARC#LinkItem', 'ARC#ConfigItem'];

export class ArcSettingsElement extends LitElement {
  static get styles() {
    return elementStyles;
  }

  static get properties() {
    return { 
      /** 
       * Set internally when the data has been read from the preferences store.
       */
      settingsReady: { type: Boolean },
      /** 
       * The current application settings
       */
      appSettings: { type: Boolean },
      /** 
       * Enables compatibility layer with the anypoint platform
       */
      compatibility: { type: Boolean },
      /** 
       * Enables Material Design's outlined theme.
       */
      outlined: { type: Boolean },
    };
  }

  constructor() {
    super();
    this.settingsReady = false;
    this.compatibility = false;
    this.outlined = false;
    /**
     * @type {ARCConfig}
     */
    this.appSettings = undefined;
    /**
     * When an item has its own sub-page then this is the item to be rendered.
     * Once set it renders this view.
     * Note, you have to call `requestUpdate()` manually after setting this variable.
     * 
     * @type {ArcConfigItem}
     */
    this.subPageItem = undefined;
  }

  connectedCallback() {
    super.connectedCallback();
    this.loadConfig();
  }

  /**
   * Loads the current config through the ARC events system and sets the `appSettings` property.
   */
  async loadConfig() {
    this.appSettings = await ConfigEvents.readAll(this);
    this.settingsReady = true;
  }

  /**
   * Searches the settings schema for a definition of an item identified by the path.
   * @param {string} path 
   * @returns {ArcConfigItem}
   */
  readConfigItemSchema(path) {
    const [groupName, ...parts] = path.split('.');
    const group = schema.groups.find((item) => item.key === groupName);
    if (!group) {
      return undefined;
    }
    // this is a simplified version of the search since setting items are not nested, yet.
    const [id] = parts;
    return /** @type ArcConfigItem */ (group.items.find((item) => /** @type ArcConfigItem */ (item).key === `${groupName}.${id}`));
  }

  /**
   * Reads current settings value or the default value from the current setting.
   * @param {string} path 
   * @param {any} defaultValue 
   * @returns {any} The read value or the default value.
   */
  readValue(path, defaultValue) {
    const { appSettings } = this;
    if (!appSettings) {
      return defaultValue;
    }
    const reducer = (accumulator, currentValue) => {
      if (typeof accumulator === 'undefined' || accumulator === null) {
        return undefined;
      }
      return accumulator[currentValue];
    };
    const result = path.split('.').reduce(reducer, appSettings);
    return typeof result === 'undefined' ? defaultValue : result;
  }

  /**
   * @param {string} path The path to the data
   * @param {any} value The value to set.
   */
  updateValue(path, value) {
    const parts = path.split('.');
    const last = parts.pop();
    if (!this.appSettings) {
      this.appSettings = {};
    }
    let current = this.appSettings;
    parts.forEach((part) => {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    });
    current[last] = value;
    ConfigEvents.update(this, path, value);
  }

  /**
   * Handler for the taggable (switch) item.
   * @param {PointerEvent} e 
   */
  [toggleItemHandler](e) {
    const node = /** @type HTMLElement */ (e.currentTarget);
    const button = /** @type AnypointSwitch */ (node.querySelector('anypoint-switch'));
    if (e.target === button) {
      return;
    }
    button.checked = !button.checked;
    button.dispatchEvent(new Event('change'));
  }

  /**
   * Toggles a boolean value when the switch event id dispatched
   * @param {Event} e
   */
  [toggleBooleanValue](e) {
    const button = /** @type AnypointSwitch */ (e.target);
    const { checked, dataset } = button;
    const { path } = dataset;
    this.updateValue(path, checked);
  }

  /**
   * Redirects focus to the toggle element
   * @param {Event} e
   */
  [redirectToggleFocus](e) {
    const node = /** @type HTMLElement */ (e.currentTarget);
    const button = /** @type AnypointSwitch */ (node.querySelector('anypoint-switch'));
    if (e.target === button) {
      return;
    }
    button.focus();
  }

  /**
   * @param {Event} e 
   */
  [listChangeHandler](e) {
    const node = /** @type AnypointListbox */ (e.target);
    const { selected, dataset } = node;
    const { path } = dataset;
    this.updateValue(path, selected);
  }

  /**
   * @param {Event} e 
   */
  [subPageLinkHandler](e) {
    const node = /** @type HTMLElement */ (e.currentTarget);
    const { dataset } = node;
    const { path } = dataset;
    const item = this.readConfigItemSchema(path);
    this.subPageItem = item;
    this.requestUpdate();
  }

  /**
   * @param {Event} e 
   */
  [inputChangeHandler](e) {
    const node = /** @type HTMLInputElement */ (e.currentTarget);
    const { dataset, value } = node;
    const { path } = dataset;
    this.updateValue(path, value);
  }

  /**
   * Clears the current sub page and returns to the default view.
   */
  [backSubPage]() {
    this.subPageItem = undefined;
    this.requestUpdate();
  }

  /**
   * @param {Event} e 
   */
  [linkItemHandler](e) {
    const node = /** @type HTMLElement */ (e.currentTarget);
    const { dataset } = node;
    const { href } = dataset;
    ArcNavigationEvents.navigateExternal(this, href);
  }

  render() {
    const { settingsReady, subPageItem } = this;
    if (!settingsReady) {
      return html`<p>Initializing...</p>`;
    }
    return html`
    <div class="content">
      ${subPageItem ? this[subPageTemplate]() : this[schemaTemplate]()}
    </div>`;
  }

  /**
   * @returns {TemplateResult} The template for settings sections as defined in the schema.
   */
  [schemaTemplate]() {
    return html`
    <div class="settings-sections">
      ${schema.groups.map((group) => this[groupTemplate](group))}
    </div>
    `;
  }

  /**
   * @returns {TemplateResult} The template for the selected sub page.
   */
  [subPageTemplate]() {
    const { subPageItem, compatibility, outlined } = this;
    const { name, description, type, enabled, key, default: defaultValue, suffix } = subPageItem;
    const inputType = type === 'number' ? type : 'text';
    const value = this.readValue(key, defaultValue);
    return html`
    <div class="settings-page">
      <div class="title-line">
        <anypoint-icon-button title="Go back to the previous page" @click="${this[backSubPage]}">
          <arc-icon icon="arrowBack"></arc-icon>
        </anypoint-icon-button>
        <h3 class="settings-title">${name}</h3>
      </div>
      <p class="settings-description">${description}</p>

      <div class="user-input">
        <anypoint-input type="${inputType}" .disabled="${!enabled}" .value="${value}" data-path="${key}" @change="${this[inputChangeHandler]}" ?compatibility="${compatibility}" ?outlined="${outlined}">
          <label slot="label">Setting value</label>
          ${suffix ? html`<span slot="suffix">${suffix}</span>` : ''}
        </anypoint-input>
      </div>
    </div>
    `;
  }

  /**
   * @param {ArcConfigGroup} group 
   * @returns {TemplateResult|string} The template for the settings group.
   */
  [groupTemplate](group) {
    const { name, description, enabled, kind, items } = group;
    if (kind !== 'ARC#ConfigGroup' || !enabled) {
      return '';
    }
    return html`
    <section class="settings-group">
    <h3 class="settings-title">${name}</h3>
      <p class="settings-description">${description}</p>
      <div class="settings-list" role="listbox" aria-label="Configuration options for ${name}">
        ${items.map((item) => this[settingsItemTemplate](item))}
      </div>
    </section>
    `;
  }

  /**
   * @param {ArcConfigItem|ArcLinkItem} item
   * @returns {TemplateResult|string} The template for a single configuration item.
   */
  [settingsItemTemplate](item) {
    const typed = /** @type ArcConfigItem */ (item);
    const { kind, type } = typed;
    if (!SupportedConfigItems.includes(kind)) {
      return '';
    }
    if (kind === 'ARC#LinkItem') {
      return this[configLinkItem](/** @type ArcLinkItem */ (item));
    }
    switch (type) {
      case 'boolean': return this[booleanItemTemplate](typed);
      case 'string': 
      case 'number': 
        return this[inputItemTemplate](typed);
      default: return `implement me ${type}`;
    }
  }

  /**
   * @param {ArcLinkItem} item 
   * @returns {TemplateResult} The template for a link list item
   */
  [configLinkItem](item) {
    const { enabled, name, target, description } = item;
    const twoLine = !!description;
    const { compatibility } = this;
    return html`
    <anypoint-item ?disabled="${!enabled}" data-href="${target}" @click="${this[linkItemHandler]}">
      <anypoint-item-body ?twoline="${twoLine}" ?compatibility="${compatibility}">
        ${name}
        ${twoLine? html`<div secondary>${description}</div>` : ''}
      </anypoint-item-body>
      <arc-icon class="sub-page-arrow" icon="openInNew" title="Opens in a new window"></arc-icon>  
    </anypoint-item>
    `;
  }

  /**
   * @param {ArcConfigItem} item
   * @returns {TemplateResult} The template for a boolean configuration item
   */
  [booleanItemTemplate](item) {
    const { name, description, enabled, key, default: defaultValue } = item;
    const { compatibility } = this;
    const value = this.readValue(key, defaultValue);
    const twoLine = !!description;
    return html`
    <anypoint-item @click="${this[toggleItemHandler]}" ?disabled="${!enabled}" @focus="${this[redirectToggleFocus]}" data-path="${key}">
      <anypoint-item-body ?twoline="${twoLine}" ?compatibility="${compatibility}">
        <div>${name}</div>
        ${twoLine? html`<div secondary>${description}</div>` : ''}
      </anypoint-item-body>
      <anypoint-switch
        tabindex="-1"
        .checked="${value}"
        name="${name}"
        @change="${this[toggleBooleanValue]}"
        ?compatibility="${compatibility}"
        ?disabled="${!enabled}"
        data-path="${key}"
        aria-label="Activate to toggle ${name} option"
      ></anypoint-switch>
    </anypoint-item>
    `;
  }

  /**
   * @param {ArcConfigItem} item
   * @returns {TemplateResult} The template for a configuration item with a text input
   */
  [inputItemTemplate](item) {
    const { name, description, enabled, key, default: defaultValue, enum: enumValue } = item;
    const { compatibility } = this;
    const value = this.readValue(key, defaultValue);
    const twoLine = !!description;
    return html`
    <anypoint-item ?disabled="${!enabled}" data-path="${key}">
      <anypoint-item-body ?twoline="${twoLine}" ?compatibility="${compatibility}">
        <div>${name}</div>
        ${twoLine? html`<div secondary>${description}</div>` : ''}
      </anypoint-item-body>
      ${enumValue ? this[dropdownOptions](value, enumValue, key) : this[subPageLinkItem](key)}
    </anypoint-item>
    `;
  }

  /**
   * @param {any} selected 
   * @param {any[]} values  
   * @param {string} path The settings path
   * @returns {TemplateResult} The template for the dropdown with enum values
   */
  [dropdownOptions](selected, values, path) {
    const { compatibility, outlined } = this;
    return html`
    <anypoint-dropdown-menu
      ?compatibility="${compatibility}"
      ?outlined="${outlined}"
      name="${path}"
      noLabelFloat
    >
      <label slot="label">Select option</label>
      <anypoint-listbox
        slot="dropdown-content"
        attrforselected="data-value"
        .selected="${selected}"
        ?compatibility="${compatibility}"
        data-path="${path}"
        @selected="${this[listChangeHandler]}"
      >
        ${values.map((item) => html`<anypoint-item data-value="${item}">${item}</anypoint-item>`)}
      </anypoint-listbox>
    </anypoint-dropdown-menu>
    `;
  }

  /**
   * @param {string} path The path to the setting definition
   * @returns {TemplateResult} The template for the "open sub-page" button
   */
  [subPageLinkItem](path) {
    return html`
    <anypoint-icon-button title="Open settings detail" data-path="${path}" @click="${this[subPageLinkHandler]}">
      <arc-icon class="sub-page-arrow" icon="arrowDropDown"></arc-icon>  
    </anypoint-icon-button>
    `;
  }
}
