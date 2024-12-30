import { getSettings, SEARCH_CATEGORIES } from './settings';
export async function performSearch(category) {
    console.log('Starting search for category:', category);
    // Get current block
    const currentBlock = await logseq.Editor.getCurrentBlock();
    console.log('Current block:', currentBlock);
    if (!currentBlock) {
        logseq.UI.showMsg('No block selected!', 'warning');
        return;
    }
    try {
        // Get settings
        const settings = await getSettings();
        console.log('Current settings:', settings);
        // Test log
        logseq.UI.showMsg('Sending request...', 'info');
        // Build complete URL
        const queryText = encodeURIComponent(currentBlock.content);
        const fullUrl = `${settings.baseUrl}/search?q=${queryText}&language=${settings.language}&time_range=${settings.timeRange}&safesearch=${settings.safeSearch}&categories=${SEARCH_CATEGORIES[category].category}&format=json`;
        console.log('Using URL:', fullUrl);
        // Send request
        const response = await fetch(fullUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        console.log('Response Status:', response.status);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // Parse response
        const data = await response.json();
        console.log('Received data:', data);
        // Insert response as new blocks
        if (Array.isArray(data.results) && data.results.length > 0) {
            // Insert header
            const headerBlock = `- SearX Search Results (${SEARCH_CATEGORIES[category].name})`;
            await logseq.Editor.insertBlock(currentBlock.uuid, headerBlock, { sibling: false });
            for (const result of data.results) {
                // Format search result as string
                const blockContent = `  - [${result.title}](${result.url})\n    ${result.content || ''}`;
                console.log('Adding block:', blockContent);
                try {
                    await logseq.Editor.insertBlock(currentBlock.uuid, blockContent, { sibling: false });
                }
                catch (insertError) {
                    console.error('Error inserting block:', insertError);
                }
            }
        }
        else {
            // If no results found
            const blockContent = `- No search results found for "${currentBlock.content}" in ${SEARCH_CATEGORIES[category].name}`;
            await logseq.Editor.insertBlock(currentBlock.uuid, blockContent, { sibling: false });
        }
        logseq.UI.showMsg('Successfully processed!', 'success');
    }
    catch (error) {
        console.error('Error:', error);
        logseq.UI.showMsg('Error processing request!', 'error');
    }
}
