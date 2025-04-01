// ./js/ustility/login.js
import { displayData, jsonToHtmlTable } from "./file_handle.js";
import { Profiles } from "./temp_profile.js";
import { loadTestTaker } from "./test_taker.js";
import { basepath, html_assets } from "../env.js";

export let playarea, profiles, loginAlert, signupAlert, userProfile, sessionProfile;


export function checkLoginStatus() {
    playarea = document.getElementById("playarea");
    if (localStorage.profiles) {
        if (sessionStorage.profile) {
            loadLocalStorageProfiles();
            loadUserProfile();
        } else {
            loadLocalStorageProfiles();
            loadLoginPage();
        }
    } else {
        alert("No Local Storage of users profiles.\n\nplz Register First!");
        profiles = new Profiles();
        window.profiles = profiles;
        loadLoginPage();
    }
}

export function loadLocalStorageProfiles() {
    profiles = new Profiles();
    const jsonData = JSON.parse(localStorage.profiles);
    const profileData = Array.isArray(jsonData.profiles) ? jsonData.profiles : Object.values(jsonData);
    // console.log(jsonData);
    profileData.forEach((profile, index) => {
        const message = profiles.register(profile.id, profile.fname, profile.lname, profile.password)
        profiles.profiles[index].status = profile.status;
        profile.resultLog.forEach(result => {
            profiles.logResults(profile.id, result.testId, result.score, result.start, result.end, result.durationTaken)
        });
    });
    window.profiles = profiles;
}

export function loadLoginPage() {
    return fetch(basepath + html_assets + 'register.html')
        .then(response => response.text())
        .then(html => {
            if (playarea) {
                playarea.innerHTML = html;
                initializeRegisterLinks();
                if (!localStorage.profiles) {
                    toggleFormView();
                }
            } else {
                console.error('register container not found!');
            }
        })
        .catch(error => {
            console.error('Error loading register:', error);
            throw error; // Ensure the error is propagated
        });
}

function initializeRegisterLinks() {
    document.querySelectorAll(".toggle-register").forEach(ref => {
        ref.addEventListener("click", toggleFormView, false);
    });
    document.querySelectorAll(".register-button").forEach(button => {
        button.addEventListener("click", registerUser, false);
    });
}

function toggleFormView() {
    document.querySelectorAll(".register").forEach(section => {
        if (section.classList.contains("active")) {
            section.classList.remove("active");
        }else{
            section.classList.add("active");
        }
    });
}

function registerUser(event) {
    event.preventDefault();
    const inputKeyValue = handleAllInputs(event);

    if (event.target.id == "login-i") {
        const message = profiles.login(inputKeyValue.userid, inputKeyValue.password)
        // console.log(message)
        if ( message === true) {
            loadUserProfile();
            loadTestTaker();
        } else {
            loginAlert.innerHTML = message;
            loginAlert.style.color = "red";
        }

    } else {
        // console.log(inputKeyValue);
        const message = profiles.register(inputKeyValue.userid, inputKeyValue.fname, inputKeyValue.lname, inputKeyValue.password);
        // console.log(profiles);
        showSignupMessage(message);
        localStorage.profiles = JSON.stringify(profiles);
    }
}

function handleAllInputs(event) {
    const inputAll = document.querySelectorAll(`.${event.target.id}`);
    loginAlert = document.getElementById("login-alert");
    signupAlert = document.getElementById("signup-alert");
    const keyValue = {};

    // Input
    inputs: inputAll.forEach(input => {
        try {
            if (input.value.length < 1) {throw "empty"}
        } catch(err) {
            input.style.backgroundColor = "#f003"; // Corrected the color name
            const alertMessage = `<b>${input.placeholder}<b> input is <b>${err}!</b>`;

            if (event.target.id === "login-i") {
                loginAlert.innerHTML = alertMessage;
                loginAlert.style.color = "red";
            } else {
                signupAlert.innerHTML = alertMessage;
                signupAlert.style.color = "red";
            }
            return inputs;
        }
        keyValue[input.classList[1]] = input.value;

        // Reset background color when clicked
        input.addEventListener("click", () => {
            input.style.backgroundColor = "white";
            loginAlert.innerHTML = "";
            signupAlert.innerHTML = "";
        });
    });
    return keyValue;
}

function showSignupMessage(message) {
    const signup =  document.querySelector(".register.signup");
    signup.getElementsByTagName("form")[0].remove()
    signup.getElementsByTagName("h2")[0].innerHTML = message;
    signup.getElementsByTagName("div")[0].textContent = "visit login page ";
    const span  = document.createElement("span");
    span.setAttribute("class", "toggle-register");
    span.textContent = "Log in";
    span.addEventListener("click", toggleFormView);
    signup.getElementsByTagName("div")[0].appendChild(span);
}

async function loadUserProfile() {
    userProfile = document.getElementById("profile");
    userProfile.style.display = "grid";
    sessionProfile = JSON.parse(sessionStorage.profile);
    document.getElementById("welcome-greet").innerHTML = sessionProfile.name;
    document.getElementById("welcome-message").style.display = "none";
    // fetch profile container
    try {
        await fetchProfile();
    } catch (err) {
        console.error("Error loading profile conatiner:",  err);
    }
    document.getElementById("p-score").innerHTML = "Score: " + sessionProfile.score;
    document.getElementById("p-userid").innerHTML = sessionProfile.id;
    document.getElementById("p-username").innerHTML = sessionProfile.name;
    document.getElementById("change-pass").addEventListener("click", changePass, false);
    intializeProfilrLinks();
    toggleLoginLogout();
}

async function fetchProfile() {
    try {
        const response = await fetch(basepath + html_assets + "profile.html");
        const html = await response.text()
        userProfile.innerHTML = html;
    } catch (err) {
        console.error("Error fetching Profile: ", err);
        throw err;
    }
}

function intializeProfilrLinks() {
    document.querySelectorAll(".tt-index").forEach(
        button=>{
            button.addEventListener("click", (event)=>{
                if (event.target.id == "view-tests") {
                    document.getElementById("result-log").classList.remove("active");
                    event.target.classList.add("active");
                    loadTestTaker();
                } else {
                    document.getElementById("view-tests").classList.remove("active");
                    event.target.classList.add("active");
                    loadUserResultsLog();
                }
            }, false)
        }
    );
}

export function toggleLoginLogout() {
    document.querySelectorAll(".login-logout-toggle").forEach(button=>{
        if (button.classList.contains("active")) {
            button.classList.remove("active");
        }else{
            button.classList.add("active");
        }
    });
}

export function loadUserResultsLog() {
    const resultsDisplay = document.createElement("div")
    resultsDisplay.setAttribute("id", "results-log-display-containier");
    const jsonData = JSON.parse(sessionStorage.profile)
    const tableData = jsonToHtmlTable(jsonData.resultLog);
    resultsDisplay.appendChild(tableData);
    // console.log(tableData);
    displayData(resultsDisplay, playarea);
    // playarea.innerHTML = JSON.stringify();
}

export function logoutUser() {
    const message = profiles.logout(sessionProfile.id);
    playarea.innerHTML = message;
    userProfile.style.display = "none";
    toggleLoginLogout();
}

async function changePass() {
    try{
        await fetchChangePass();
    } catch (err) {
        console.error("Error loading password change Container: ", err);
        throw err;
    }
    const passAlert = document.getElementById("pass-change-alert");
    const passObject = {};
    document.getElementById("pass-change").addEventListener("click", (event)=>{
        event.preventDefault();
        document.querySelectorAll(".pass-change").forEach(input=>{
            passObject[input.classList[1]] = input.value;
        });
        const message = profiles.changePass(passObject.userid, passObject.oldPass, passObject.newPass);
        // console.log(message)
        if ( message == true ) {
            // console.log(JSON.stringify(profiles))
            localStorage.profiles = JSON.stringify(profiles);
            playarea.innerHTML = "";
            playarea.innerHTML = "<h3 style='color:green;'>Password changed successfully</h3>";
        } else {
            passAlert.innerHTML = message;
            passAlert.style.color = "red";
            // console.log(localStorage.profiles);
        }
    });
}

async function fetchChangePass() {
    try {
        const response = await fetch(basepath + html_assets + "pass_change.html");
        const html = await response.text()
        playarea.innerHTML = html;
    } catch (err) {
        console.error("Error fetching Profile: ", err);
        throw err;
    }
}
