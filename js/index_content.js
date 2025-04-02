// ./js/index-content.js
import { checkLoginStatus, loadLoginPage, logoutUser } from "./utility/login.js";
import { loadTestTaker } from "./utility/test_taker.js";
import { basepath } from "./env.js";

let homepaths = ["index.html", "/", basepath + "index.html", basepath]

export async function indexContentInitialize() {
    const activePage = window.location.pathname.split('/').pop().replace('.html', '');
    const loginLogout = document.getElementById("login-logout-toggle");
    // debug
    console.log(activePage);
    console.log(loginLogout);
    console.log("index content initialized")
    // debug
    if (!homepaths.includes(window.location.pathname)) {
        loginLogout.style.display = "none";
        return;
    } else {
        loginLogout.style.display = "block";
        try {
            if (sessionStorage.profile) {
                checkLoginStatus();
                loadTestTaker();
            } else {
                checkLoginStatus();
            }
        } catch (error) {
            console.error('Error during Index page initialization:', error);
        }
    }
}

