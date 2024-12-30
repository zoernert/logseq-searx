import '@logseq/libs';
import { settingsSchema, SEARCH_CATEGORIES } from './settings';
import { performSearch } from './searxService';
const main = () => {
    console.log('Plugin loading...');
    try {
        // Register plugin settings
        logseq.useSettingsSchema(settingsSchema);
        // Register slash commands for each category
        for (const [key, value] of Object.entries(SEARCH_CATEGORIES)) {
            console.log(`Registering slash command for ${value.name}...`);
            logseq.Editor.registerSlashCommand(`Search ${value.name}`, () => {
                console.log(`Slash command executed for ${value.name}`);
                logseq.UI.showMsg(`Searching in ${value.name}...`, 'info');
                return performSearch(key);
            });
        }
        // Register toolbar button for default web search
        console.log('Registering toolbar button...');
        logseq.App.registerUIItem('toolbar', {
            key: 'searx-search',
            template: `
        <a class="button" data-on-click="searchGeneral" title="SearX Web Search">
          <i class="ti ti-search"></i>
        </a>
      `
        });
        // Register toolbar button function
        logseq.provideStyle(`
      .button-searx {
        display: flex;
        align-items: center;
        padding: 4px 8px;
        border-radius: 4px;
      }
    `);
        logseq.provideModel({
            searchGeneral: () => performSearch('general')
        });
        // Test UI Message
        logseq.UI.showMsg('SearX Plugin successfully initialized!', 'success');
        console.log('Plugin initialization completed');
    }
    catch (error) {
        console.error('Error during plugin initialization:', error);
        logseq.UI.showMsg('Error during plugin initialization!', 'error');
    }
};
// Bootstrap the plugin
logseq.ready(main).catch((error) => {
    console.error('Error starting plugin:', error);
    logseq.UI.showMsg('Error starting plugin!', 'error');
});
