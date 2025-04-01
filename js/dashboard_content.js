import { tests_object, writeTestsObject } from "./utility/file_handle.js";
import { durationTaken } from "./utility/test_taker.js";
// import { profiles } from "./utility/login";

window.addEventListener("DOMContentLoaded", async () => {
    await writeTestsObject();
    await loadTotalTestCount();
    await loadTotalUsersCount();
    await loadTotalTestsTaken();
    await loadUserAnamolies();
    await loadAnamoliesCount();
    await loadPlots();
}, false)

function loadTotalTestCount() {
    const total = document.getElementById("total-tests-count");
    total.textContent = tests_object.tests.length;
}

function loadTotalUsersCount() {
    const total = document.getElementById("total-users-count");
    total.textContent = JSON.parse(localStorage.profiles).profiles.length;
}

function loadTotalTestsTaken() {
    const total = document.getElementById("total-tests-taken");
    total.textContent = localStorage.testTakenByUsers;
}

function loadAnamoliesCount() {
    const total = document.getElementById("total-anamolies-count");
    const jsonData = JSON.parse(localStorage.userAnamolies);
    let count = 0
    jsonData.users.forEach(user=>count+=user.anamolies.length);
    total.textContent = count;
}

function loadUserAnamolies() {
    const anamolies = document.getElementById("user-anamolies");
    if (!localStorage.userAnamolies) {
        console.warn('No user anomalies found in localStorage.');
        return;
    }

    // Parse the userAnamolies data from localStorage
    const userAnamolies = JSON.parse(localStorage.userAnamolies);

    // Create table HTML
    let tableHTML = `
        <table class="table caption-top table-primary table-hover table-borderless table-striped-columns">
        <caption>List of Anamolies</caption>
            <thead class="table-danger">
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">User ID</th>
                    <th scope="col">Anomaly Start</th>
                    <th scope="col">Anomaly Duration</th>
                </tr>
            </thead>
            <tbody class="table-group-divider">
    `;
    let count = 0
    // Loop through the userAnamolies data and create rows for each anomaly
    userAnamolies.users.forEach(user => {
        user.anamolies.forEach(anomaly => {
            count++;
            tableHTML += `
                <tr>
                    <td scope="row">${count}</td>
                    <td>${user.id}</td>
                    <td>${new Date(anomaly.start).toLocaleString()}</td>
                    <td>${anomaly.duration}</td>
                </tr>
            `;
        });
    });

    // Close the table HTML
    tableHTML += `
            </tbody>
        </table>
    `;

    // Insert the table HTML into the container
    anamolies.innerHTML = tableHTML;
}

function loadPlots() {
    const jsonData = JSON.parse(localStorage.getItem('profiles'));
    const xArray = [];
    const yArray = [];
    const durationMap = {};

    jsonData.profiles.forEach(profile => {
        profile.resultLog.forEach(result => {
            if (!durationMap[result.testId]) {
                durationMap[result.testId] = { total: 0, count: 0 };
            }
            const time  = parseFloat(result.durationTaken.split("M")[0]) + (parseFloat(result.durationTaken.replace("S", "").split(":")[1])/60)
            durationMap[result.testId].total += time;
            durationMap[result.testId].count += 1;
            // console.log(result.testId, time);
        });
    });

    Object.keys(durationMap).forEach(testId => {
        xArray.push(testId);
        yArray.push(durationMap[testId].total / durationMap[testId].count);
    });

    // console.log(xArray, yArray);

    const data = [{
        x: xArray,
        y: yArray,
        type: "bar",
        orientation: "v",
        marker: { color: "rgba(0,0,255,0.6)" }
    }];

    const layout = { title: "Average Duration of Tests" };

    Plotly.newPlot("myPlot", data, layout);
}

// Call the function to load the plot
loadPlots();


