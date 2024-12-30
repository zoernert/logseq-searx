import '@logseq/libs';
export const DEFAULT_SETTINGS = {
    baseUrl: "https://search.corrently.cloud",
    language: "en-US",
    timeRange: "",
    safeSearch: "0"
};
export const settingsSchema = [
    {
        key: "baseUrl",
        type: "string",
        default: DEFAULT_SETTINGS.baseUrl,
        title: "SearX Instance URL",
        description: "Base URL of your SearX instance"
    },
    {
        key: "language",
        type: "string",
        default: DEFAULT_SETTINGS.language,
        title: "Language",
        description: "Language for search results (e.g., en-US, de-DE)"
    },
    {
        key: "timeRange",
        type: "enum",
        default: DEFAULT_SETTINGS.timeRange,
        title: "Time Range",
        enumChoices: ["", "day", "week", "month", "year"],
        enumPicker: "select",
        description: "Default time range for searches"
    },
    {
        key: "safeSearch",
        type: "enum",
        default: DEFAULT_SETTINGS.safeSearch,
        title: "SafeSearch",
        enumChoices: ["0", "1", "2"],
        enumPicker: "select",
        description: "0: Off, 1: Moderate, 2: Strict"
    }
];
export const SEARCH_CATEGORIES = {
    general: {
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
};
export async function getSettings() {
    const settings = await logseq.settings;
    return {
        baseUrl: settings?.baseUrl || DEFAULT_SETTINGS.baseUrl,
        language: settings?.language || DEFAULT_SETTINGS.language,
        timeRange: settings?.timeRange || DEFAULT_SETTINGS.timeRange,
        safeSearch: settings?.safeSearch || DEFAULT_SETTINGS.safeSearch
    };
}
