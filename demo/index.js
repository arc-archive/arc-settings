
import { html } from 'lit-html';
import { DemoPage } from '@advanced-rest-client/arc-demo-helper';
import '@advanced-rest-client/arc-models/project-model.js';
import '@advanced-rest-client/arc-models/request-model.js';
import '@advanced-rest-client/arc-models/url-history-model.js';
import '@advanced-rest-client/arc-models/websocket-url-history-model.js';
import '@advanced-rest-client/arc-models/auth-data-model.js';
import '@advanced-rest-client/arc-models/host-rules-model.js';
import '@advanced-rest-client/arc-models/rest-api-model.js';
import '@advanced-rest-client/arc-models/variables-model.js';
import '@advanced-rest-client/arc-ie/arc-data-export.js';
import listenEncoding from '@advanced-rest-client/arc-demo-helper/src/EncodingHelpers.js';
import { ExportHandlerMixin } from '@advanced-rest-client/arc-demo-helper/src/ExportHandlerMixin.js';
import { ArcNavigationEventTypes, ConfigEvents, ConfigEventTypes } from '@advanced-rest-client/arc-events';
import '../arc-settings.js';

/** @typedef {import('@advanced-rest-client/arc-events').ConfigReadEvent} ConfigReadEvent */
/** @typedef {import('@advanced-rest-client/arc-events').ConfigUpdateEvent} ConfigUpdateEvent */
/** @typedef {import('@advanced-rest-client/arc-events').ARCExternalNavigationEvent} ARCExternalNavigationEvent */

const STORE_CONFIG_KEY = 'arc.demo.settings';

class ComponentDemo extends ExportHandlerMixin(DemoPage) {
  constructor() {
    super();
    this.initObservableProperties([
      'compatibility',
      'outlined',
      'systemVariablesDisabled',
    ]);
    this.componentName = 'arc-settings';
    this.compatibility = false;
    this.outlined = false;
    this.restApis = true;
    this.renderViewControls = true;
    
    listenEncoding();

    window.addEventListener(ConfigEventTypes.readAll, this.readConfigHandler.bind(this));
    window.addEventListener(ConfigEventTypes.update, this.updateConfigHandler.bind(this));
    window.addEventListener(ArcNavigationEventTypes.navigateExternal, this.navigateExternalHandler.bind(this));
  }

  async readConfig() {
    const raw = localStorage.getItem(STORE_CONFIG_KEY);
    let data = {};
    try {
      if (raw) {
        data = JSON.parse(raw);
      }
    } catch (ex) {
      // ....
    }
    return data;
  }

  async setConfig(path, value) {
    let config = await this.readConfig();
    const parts = path.split('.');
    const last = parts.pop();
    if (!config) {
      config = {};
    }
    let current = config;
    parts.forEach((part) => {
      if (!current[part]) {
        current[part] = {};
      }
      current = current[part];
    });
    current[last] = value;
    localStorage.setItem(STORE_CONFIG_KEY, JSON.stringify(config));
    ConfigEvents.State.update(document.body, path, value);
  }

  /**
   * @param {ConfigReadEvent} e 
   */
  readConfigHandler(e) {
    e.detail.result = this.readConfig();
  }
  

  /**
   * @param {ConfigUpdateEvent} e 
   */
  async updateConfigHandler(e) {
    const { key, value } = e.detail;
    e.detail.result = this.setConfig(key, value);
  }

  /**
   * @param {ARCExternalNavigationEvent} e
   */
  navigateExternalHandler(e) {
    window.open(e.url);
  }

  _demoTemplate() {
    const {
      compatibility,
      outlined,
    } = this;
    return html`
      <section class="documentation-section">
        <arc-settings
          ?compatibility="${compatibility}"
          ?outlined="${outlined}"
        ></arc-settings>
      </section>
    `;
  }

  contentTemplate() {
    return html`
      <arc-data-export></arc-data-export>
      <project-model></project-model>
      <request-model></request-model>
      <auth-data-model></auth-data-model>
      <url-history-model></url-history-model>
      <websocket-url-history-model></websocket-url-history-model>
      <rest-api-model></rest-api-model>
      <variables-model></variables-model>
      <host-rules-model></host-rules-model>

      ${this._demoTemplate()}
      ${this.exportTemplate()}
    `;
  }
}

const instance = new ComponentDemo();
instance.render();
