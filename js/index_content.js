// ./js/index-content.js
import { checkLoginStatus, loadLoginPage, logoutUser } from "./utility/login.js";
import { loadTestTaker } from "./utility/test_taker.js";

export async function indexContentInitialize() {
    const activePage = window.location.pathname.split('/').pop().replace('.html', '');
    const loginLogout = document.getElementById("login-logout-toggle");
    // console.log(activePage);

    if (activePage !== "index") {
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

