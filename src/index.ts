import '@logseq/libs'
import { SettingSchemaDesc } from '@logseq/libs/dist/LSPlugin.user'

const SETTINGS: SettingSchemaDesc[] = [
  {
    key: "baseUrl",
    type: "string",
    default: "https://search.corrently.cloud",
    title: "SearX Instance URL",
    description: "Base URL of your SearX instance"
  },
  {
    key: "language",
    type: "string",
    default: "en-US",
    title: "Language",
    description: "Language for search results (e.g., en-US, de-DE)"
  },
  {
    key: "timeRange",
    type: "enum",
    default: "",
    title: "Time Range",
    enumChoices: ["", "day", "week", "month", "year"],
    enumPicker: "select",
    description: "Default time range for searches"
  },
  {
    key: "safeSearch",
    type: "enum",
    default: "0",
    title: "SafeSearch",
    enumChoices: ["0", "1", "2"],
    enumPicker: "select",
    description: "0: Off, 1: Moderate, 2: Strict"
  }
];

const SEARCH_CATEGORIES = {
  websites: {
    name: "Websites",
    category: "general"
  },
  news: {
    name: "News",
    category: "news"
  },
  it: {
    name: "IT",
    category: "it"
  },
  science: {
    name: "Science",
    category: "science"
  },
  files: {
    name: "Files",
    category: "files"
  },
  social: {
    name: "Social Media",
    category: "social+media"
  }
} as const;

interface SearxSettings {
  baseUrl: string;
  language: string;
  timeRange: string;
  safeSearch: string;
}

function getDefaultSettings(): SearxSettings {
  return {
    baseUrl: SETTINGS[0].default as string,
    language: SETTINGS[1].default as string,
    timeRange: SETTINGS[2].default as string,
    safeSearch: SETTINGS[3].default as string
  };
}

function createModel() {
  return {
    async search(category: keyof typeof SEARCH_CATEGORIES) {
      const block = await logseq.Editor.getCurrentBlock()
      if (!block) return

      try {
        // Get current settings
        const settings = await logseq.settings
        const defaults = getDefaultSettings()

        const baseUrl = settings?.baseUrl || defaults.baseUrl
        const language = settings?.language || defaults.language
        const timeRange = settings?.timeRange || defaults.timeRange
        const safeSearch = settings?.safeSearch || defaults.safeSearch

        // Build search URL with settings
        const url = `${baseUrl}/search?q=${encodeURIComponent(block.content)}&categories=${SEARCH_CATEGORIES[category].category}&format=json&language=${language}&time_range=${timeRange}&safesearch=${safeSearch}`
        console.log('Searching:', url)
        
        const response = await fetch(url)
        const data = await response.json()
        
        // Add header with category name
        await logseq.Editor.insertBlock(
          block.uuid,
          `- SearX Results (${SEARCH_CATEGORIES[category].name})`,
          { sibling: false }
        )
        
        if (Array.isArray(data.results) && data.results.length > 0) {
          for (const result of data.results) {
            await logseq.Editor.insertBlock(
              block.uuid,
              `  - [${result.title}](${result.url})\n    ${result.content || ''}`,
              { sibling: false }
            )
          }
        } else {
          await logseq.Editor.insertBlock(
            block.uuid,
            `  - No results found`,
            { sibling: false }
          )
        }
      } catch (error) {
        console.error(error)
        logseq.UI.showMsg('Error during search', 'error')
      }
    }
  }
}

function main() {
  // Register settings
  logseq.useSettingsSchema(SETTINGS)

  const model = createModel()
  logseq.provideModel(model)
  
  // Register slash commands for all categories
  Object.entries(SEARCH_CATEGORIES).forEach(([key, value]) => {
    logseq.Editor.registerSlashCommand(
      `SearX ${value.name}`,
      () => model.search(key as keyof typeof SEARCH_CATEGORIES)
    )
  })

  console.log('SearX Plugin initialized with settings support')
}

// bootstrap
logseq.ready(main).catch(console.error)