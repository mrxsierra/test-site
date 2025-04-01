import { profiles, loadLocalStorageProfiles } from "./utility/login.js";

window.addEventListener("DOMContentLoaded", async () => {
    await loadResults();
}, false)

function loadResults() {
    if (localStorage.profiles) {
        loadLocalStorageProfiles();
    } else {
        alert("No Local Staorage of Profiles.\n\nlogin with different accounts and take tests to see results")
    }
    const resultsElement = document.getElementById("results-content-container");
    const results = {};
    profiles.profiles.forEach(profile => {
        results[profile.name] = profile.score;
    });

    const table = document.createElement('table');
    table.setAttribute("class", "table caption-top table-dark table-hover table-borderless table-striped-columns");
    const thead = document.createElement('thead');
    const caption = document.createElement('caption');
    const tbody = document.createElement('tbody');
    const headerRow = document.createElement('tr');
    caption.innerHTML = "List of users";
    tbody.setAttribute("class", "table-group-divider");
    thead.setAttribute("class", "table-light");

    // Create table headers
    const rowIdCol = document.createElement('th');
    const nameCol = document.createElement('th');
    const scoreCol = document.createElement('th');
    rowIdCol.setAttribute("scope", "col");
    nameCol.setAttribute("scope", "col");
    scoreCol.setAttribute("scope", "col");
    rowIdCol.textContent = "#";
    nameCol.textContent = "name";
    scoreCol.textContent = "score";
    headerRow.appendChild(rowIdCol);
    headerRow.appendChild(nameCol);
    headerRow.appendChild(scoreCol);
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Create table rows
    Object.keys(results).forEach((key, index) => {
        const tr = document.createElement('tr');
        const rowId = document.createElement('th')
        rowId.setAttribute("scope", "row");
        const name = document.createElement('td');
        const score = document.createElement('td');
        rowId.textContent = index+1;
        name.textContent = key;
        score.textContent = results[key];
        tr.appendChild(rowId);
        tr.appendChild(name);
        tr.appendChild(score);
        tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    resultsElement.appendChild(table);
}
