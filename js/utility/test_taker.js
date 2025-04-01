import { profiles, sessionProfile } from "./login.js";
import { loadSelectTest, writeTestsObject, tests_object } from "./file_handle.js";
import { html_assets_path } from "../env.js";

let html_assets_dir = html_assets_path.endsWith("/") ? html_assets_path : html_assets_path + "/";

export let startAnomaly, userAnamolies, playarea, ttQuestions, testId, startTime, endTime, durationTaken, remainingTimeString, start, end, remain, timerId;

export async function loadTestTaker() {
    try {
        await fetchTestSelectorData();
        document.getElementById("tt-test-title").addEventListener("click", (event)=>event.target.value="", false);
        await writeTestsObject();
        await loadSelectTest('tt-tests-list');
        document.getElementById("launch-test").addEventListener("click", launchTest, false);
    }
    catch (err) {
        console.error("Error loading Test Taker: ", err);
    }
}

async function fetchTestSelectorData() {
    return fetch(html_assets_dir + "select_tt.html")
        .then(response => response.text())
        .then(html => {
            playarea = document.getElementById("playarea");
            if (playarea) {
                playarea.innerHTML = html;
            } else {
                console.error('Select test container not found!');
            }
        })
        .catch(err => {
            console.error("Error fetching test-selector container: ", err)
            throw err;
        });
}


function launchTest() {
    if (!localStorage.testTakenByUsers) {
        localStorage.testTakenByUsers = 1;
    } else {
        localStorage.testTakenByUsers++;
    }
    const ttDuration = document.getElementById("tt-duration").value;
    const test = document.getElementById("tt-test-title").value;
    testId = tests_object.getTestByTitles(test).id
    ttQuestions = tests_object.getTestByTitles(test).getQuestions();

    //header
    const testHeader = document.createElement("header");
    const topDiv = document.createElement("div");
    const titleDiv = document.createElement("div");
    const title = document.createElement("h2");
    const totalQ = document.createElement("div");
    const submitButton = document.createElement("button");
    start = document.createElement("h6");
    end = document.createElement("h6");
    remain = document.createElement("h6");
    title.innerHTML = test;
    totalQ.innerHTML = `Total: ${ttQuestions.length}`
    submitButton.innerHTML = "submit"
    submitButton.setAttribute("id", "tt-submit-test");
    submitButton.addEventListener("click", calculateTestScore, false)
    testHeader.setAttribute("id", "tt-header")
    topDiv.setAttribute("id", "tt-duration-alert")
    titleDiv.appendChild(title);
    titleDiv.appendChild(totalQ);
    topDiv.appendChild(start);
    topDiv.appendChild(remain);
    topDiv.appendChild(end);
    testHeader.appendChild(topDiv);
    testHeader.appendChild(titleDiv);
    testHeader.appendChild(submitButton);

    // body
    const launchContainer = document.createElement("div");
    launchContainer.setAttribute("id", "launch-container");
    ttQuestions.forEach((q, index) => {
        const queDiv = document.createElement("div");
        const queHeading = document.createElement("h3");
        queDiv.setAttribute("class", `${test} tt-test-question ${q.id}`);
        queDiv.setAttribute("id", index);
        queHeading.textContent = (index+1) +": "+ q.question;
        queDiv.appendChild(queHeading);
        const options = q.options;
        options.forEach((option, i) => {
            const opDiv = document.createElement("div");
            const queOption = document.createElement("input");
            const queLabel = document.createElement("label");
            queLabel.setAttribute("for", option);
            queLabel.innerHTML = option;
            queOption.setAttribute("type", "radio");
            queOption.setAttribute("id", option);
            queOption.setAttribute("value", q.id);
            queOption.setAttribute("name", q.question);
            queOption.setAttribute("class", "tt-option");
            opDiv.setAttribute("class", `${test} tt-test-option ${q.id}`);
            opDiv.appendChild(queOption);
            opDiv.appendChild(queLabel);
            queDiv.appendChild(opDiv);
        })
        if (!launchContainer.firstChild) {queDiv.classList.add("active")}
        launchContainer.appendChild(queDiv);
    });

    // footer
    const toggleQueButton = document.createElement("footer");
    const nextBtn = document.createElement("button");
    const previousBtn = document.createElement("button");
    nextBtn.setAttribute("id", "next-question");
    nextBtn.innerHTML = "Next";
    nextBtn.addEventListener("click", toggleQuestion, false);
    previousBtn.setAttribute("id", "previous-question");
    previousBtn.innerHTML = "Previous";
    previousBtn.addEventListener("click", toggleQuestion, false);
    toggleQueButton.setAttribute("id", "toggle-question-btn-container");
    toggleQueButton.appendChild(previousBtn);
    toggleQueButton.appendChild(nextBtn);

    playarea.innerHTML = "";
    playarea.appendChild(testHeader);
    playarea.appendChild(launchContainer);
    playarea.appendChild(toggleQueButton);
    scheduleTest(ttDuration); // Schedule a 15-minute test
    toggleHideIndexContainer();
    document.addEventListener('visibilitychange', restrictVisibility, false);
}

// Function to load anomalies from localStorage
function loadLocalStorageUserAnamolies() {
    if (localStorage.userAnamolies) {
        userAnamolies = JSON.parse(localStorage.userAnamolies);
    } else {
        userAnamolies = { users: [] };
    }
}

// Initialize the session anomalies object properly
const userSessionAnamolies = { "id": "", "anamolies": [] };

// Initialize the anomalies object properly
const anomalies = { start: "", duration: "" };


// Function to restrict visibility
function restrictVisibility() {
    if (document.hidden) {
        userSessionAnamolies.id = sessionProfile.id;
        startAnomaly = new Date();
        anomalies.start = startAnomaly.toISOString();
        console.log('User switched to a different tab or minimized the browser.');
        alert('Please stay on the exam page!');
    } else {
        const end = new Date();
        const duration = convertDurationToString(end - startAnomaly);
        anomalies.duration = duration;

        loadLocalStorageUserAnamolies();

        userSessionAnamolies.anamolies.push({ ...anomalies }); // Push a copy of the anomalies
        // Avoid duplicating userSessionAnamolies in userAnamolies.users
        const existingUser = userAnamolies.users.find(user => user.id === userSessionAnamolies.id);
        if (existingUser) {
            existingUser.anamolies.push(...userSessionAnamolies.anamolies);
        } else {
            userAnamolies.users.push(userSessionAnamolies);
        }

        localStorage.userAnamolies = JSON.stringify(userAnamolies);
        sessionStorage.userSessionAnamolies = JSON.stringify(userSessionAnamolies);
        console.log('User returned to the tab.');
    }
}

function toggleHideIndexContainer() {
    const hideContainer = document.getElementById("index-page-container");
    const playground = document.getElementById("playground");
    // console.log(hideContainer.style.display.value);
    if (hideContainer.style.display == "none") {
        hideContainer.style.display = "block";
        playground.style.height = "";
    } else {
        hideContainer.style.display = "none";
        playground.style.height = "100vh";
    }
}

function toggleQuestion (event) {
    const questions = document.querySelectorAll(".tt-test-question");
    let active = 0;
    questions.forEach((q, index)=> {
        if (q.classList.contains("active")) {
            active = index;
        }
    });
    if (event.target.id == "next-question") {
        if (active !== questions.length - 1) {
            questions[active].classList.remove("active");
            questions[active + 1].classList.add("active");
        }
    } else {
        if (active !== 0) {
            questions[active].classList.remove("active");
            questions[active - 1].classList.add("active");
        }
    }
}

async function calculateTestScore() {
    document.removeEventListener("visibilitychange", restrictVisibility);
    toggleHideIndexContainer();
    const queOptionsDivs = document.querySelectorAll(".tt-test-option");

    const userSubmission = {};
    queOptionsDivs.forEach(option=>{
        const input = option.querySelector("input");
        if (input.checked) {
            userSubmission[input.value] = input.id;
        }
    })
    let correctAnswer = 0;
    Object.keys(userSubmission).forEach(key=>{
        ttQuestions.forEach(q=>{
            if (q.id == key) {
                if(q.correct_answer == userSubmission[key]) {
                    correctAnswer++;
                }
            }
        });
    })
    durationTaken = convertDurationToString(new Date() - startTime);
    profiles.logResults(sessionProfile.id, testId, correctAnswer, startTime, endTime, durationTaken);
    localStorage.profiles = JSON.stringify(profiles);
    const testCompletion = document.createElement("div");
    const greet = document.createElement("h1");
    const score = document.createElement("div");
    greet.innerHTML = "Congratulations &#127881"
    score.innerHTML = `Your score: ${correctAnswer}/${ttQuestions.length}`
    testCompletion.appendChild(greet);
    testCompletion.appendChild(score);
    playarea.innerHTML = "";
    playarea.appendChild(testCompletion);
    clearInterval(timerId);
}

function scheduleTest(duration=15) {
    startTime = new Date();
    endTime = new Date(startTime.getTime() + duration * 60 * 1000);
    start.innerHTML = `Start: <div style="color:green">${startTime.toLocaleTimeString()}</div>`;
    end.innerHTML = `End: <div style="color:red;">${endTime.toLocaleTimeString()}</div>`;

    timerId = setInterval(() => {
      const now = new Date();
      const remainingTime = endTime - now;

      remainingTimeString = convertDurationToString(remainingTime);
      remain.innerHTML = "Remain: <div style='color:orange'>" + remainingTimeString +"</div>";
    //   console.log(`Time remaining: ${remainingTimeString}`);

      if (remainingTime <= 0) {
        calculateTestScore();
        alert("Test Time is over!\n\nYou will be redirected to Final Score Page!");
      }
    }, 1000);
  }

function convertDurationToString(duration) {
    // Convert remaining time to minutes and seconds
    const minutes = Math.floor(duration / (1000 * 60)) % 60;
    const seconds = Math.floor(duration / 1000) % 60;

    return `${minutes}M:${seconds}S`;
}
