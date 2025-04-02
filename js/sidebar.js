// sidebar.js

import { loadDemo } from "./utility/load.js";
import { writeTestsObject } from "./utility/file_handle.js";
import { checkLoginStatus, logoutUser } from "./utility/login.js";
import { html_assets_path } from "./env.js";

let html_assets_dir = html_assets_path.endsWith("/") ? html_assets_path : html_assets_path + "/";

//sidebar
let sidebarContainer;
export function loadSidebar() {
    return fetch(`${html_assets_dir}sidebar.html`) // Updated to use template literal
        .then(response => response.text())
        .then(html => {
            sidebarContainer = document.getElementById('sidebar');
            if (sidebarContainer) {
                sidebarContainer.innerHTML = html;
                updateLinkStatus();
            } else {
                console.error('Sidebar container not found!');
            }
        })
        .catch(error => {
            console.error('Error loading sidebar:', error);
            throw error; // Ensure the error is propagated
        });
}

// topnav
export function loadTopNav() {
    return fetch(`${html_assets_dir}topnav.html`) // Updated to use template literal
        .then(response => response.text())
        .then(html => {
            const topNavContainer = document.getElementById('top-nav');
            if (topNavContainer) {
                topNavContainer.innerHTML = html;
                document.getElementById("login-tb").addEventListener("click", checkLoginStatus, false);
                document.getElementById("logout-tb").addEventListener("click", logoutUser, false);
            } else {
                console.error('topNav container not found!');
            }
        })
        .catch(error => {
            console.error('Error loading topNav:', error);
            throw error; // Ensure the error is propagated
        });
}

export function updateLinkStatus() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const activePage = window.location.pathname.toString().replace('/', '').replace('.html', '');
    sidebarLinks.forEach(link => {
        const page = link.getAttribute('data-page');

        if (page == activePage) {

            // Add 'active' class to the clicked link
            if (page !== "home") {
                link.classList.add('active');
            }
        }
    });
}

export function initializeSidebarToggle() {
    const toggleSidebarBtns = document.querySelectorAll(".toggle-sidebar-btn");
    if (toggleSidebarBtns.length === 0) {
        console.warn("No .toggle-sidebar-btn elements found.");
        return;
    }

    toggleSidebarBtns.forEach(btn => {
        btn.addEventListener("click", () => {
            // console.log(sidebarContainer.style.left) // error log
            sidebarContainer.style.left = sidebarContainer.style.left == "0px" ? "-14em" : "0";
        });
    });
}


let demoDataBtn;
// Load demo data and set up event listeners
export function initializeDemoData() {
    demoDataBtn = document.querySelector("#demo-data-btn");
    if (!demoDataBtn) {
        console.error("Error: #demo-data-btn not found.");
        return;
    }

    demoDataBtn.addEventListener("click", () => {
        loadDemo();
        writeTestsObject();
        demoDataButtonHide();
        alert("Demo data loaded! plz Refresh page");
    }, false);
}

// Show the demo data button
export function demoDataButtonView() {
    demoDataBtn.style.display = "block";
}

// Hide the demo data button
export function demoDataButtonHide() {
    demoDataBtn.style.display = "none";
}


let clearSesssionBtn;
// Load demo data and set up event listeners
export function initializeSessionClearBtn() {
    clearSesssionBtn = document.querySelector("#clear-session-btn");
    if (!clearSesssionBtn) {
        console.error("Error: #clear-session-btn not found.");
        return;
    }

    clearSesssionBtn.addEventListener("click", () => {
        sessionStorage.clear()
        alert("Session Data cleared!")
    }, false);
}
let clearLocalStorageBtn;
// Load demo data and set up event listeners
export function initializeLocalStorageClearBtn() {
    clearLocalStorageBtn = document.querySelector("#clear-local-storage-btn");
    if (!clearLocalStorageBtn) {
        console.error("Error: #clear-local-storage-btn not found.");
        return;
    }
    
    clearLocalStorageBtn.addEventListener("click", () => {
        localStorage.clear()
        alert("Local Storage cleared!")
    }, false);
}
