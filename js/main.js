// main.js

// Import the loadSidebar function from sidebar.js
import { indexContentInitialize } from './index_content.js';
import {
    loadSidebar,
    loadTopNav,
    demoDataButtonHide,
    demoDataButtonView,
    initializeDemoData,
    initializeLocalStorageClearBtn,
    initializeSessionClearBtn,
    initializeSidebarToggle
} from './sidebar.js';

// Import the initializeThemeToggle function from toggle_theme.js
import { initializeThemeToggle } from './toggle_theme.js';

// import writeTestsObject to update window.testObject to load Local storage data
import { tests_object, writeTestsObject } from './utility/file_handle.js';

// Initialize the sidebar and theme toggle on DOMContentLoaded
window.addEventListener('DOMContentLoaded', async () => {
    try {
        await loadSidebar();
        await loadTopNav();
        await initializeSidebarToggle();
        await initializeDemoData();
        await initializeThemeToggle();
        await initializeSessionClearBtn();
        await initializeLocalStorageClearBtn();
        if (localStorage.testData) {
            await writeTestsObject();
            await demoDataButtonHide();
            if (tests_object.tests.length < 1) {
                alert("No tests Exist, add tests First");
                await demoDataButtonView();
            }
        }
        else {
            alert("No local Storage Exists.\n\n>>Add test data from sidebar using `demo data button` for quick demo..\n\n>>OR upload using `csv or excel` using `test section` from sidebar.");
            await demoDataButtonView();
        }
        await indexContentInitialize();
    } catch (error) {
        console.error('Error during initialization:', error);
    }
});
