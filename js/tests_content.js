// test_content.js
// Additional functionality for the dynamic content of test can be added here
import { handleFile, handleAddTest, tests_object, updateCreateContent, loadReadContent, updateReadContent, loadSelectTest, loadSelectQuestion, updateUpdateContent, updateTestChanges, cleanChildById, loadDeleteContent, deleteTests } from "./utility/file_handle.js"

window.addEventListener("DOMContentLoaded", async () => {
    try {
        // create section
        document.getElementById('file-input').addEventListener('change', handleFile, false);
        document.getElementById('add-test').addEventListener('click', handleAddTest, false);
        document.getElementById('test-title').addEventListener("click", alertMessage, false);

        // dynamic tests content
        const testsNav = document.getElementById('tests');
        window.addEventListener("resize", () => { testsNav.style.display = window.innerWidth > 900 ? "grid" : false }, false);
        testsNav.addEventListener("click", updateCreateContent, false);

        // tests page nav
        const testsContentToggle = document.getElementById("toggle-menu-wrapper");
        testsContentToggle.addEventListener("click", () => testsNav.style.display = testsNav.style.display != "none" ? "none" : "grid")

        // read test
        document.getElementById("read-test").addEventListener("click", loadReadContent, false);
        const selectTestTitle = document.getElementById("select-test-title");
        selectTestTitle.addEventListener("change", updateReadContent, false);
        selectTestTitle.addEventListener("click", event => event.target.value = "", false);

        // update test
        const updateTest = document.getElementById("update-test");
        updateTest.addEventListener("click", ()=>loadSelectTest('update_tests_list'), false);

        const updateTestTitle = document.getElementById("update-test-title");
        updateTestTitle.addEventListener("change", loadSelectQuestion, false);

        const updateTestQuestions = document.getElementById("update-test-question");

        updateTestTitle.addEventListener("click", (event) => {
            event.target.value = "";
            updateTestQuestions.value = "";
            cleanChildById("questions_list");
        }, false);

        updateTestQuestions.addEventListener("click", event => event.target.value = "", false);

        updateTestQuestions.addEventListener("change", updateUpdateContent, false);
        document.getElementById("save-changes").addEventListener("click", updateTestChanges, false);

        // delete Section
        document.getElementById("delete-test").addEventListener("click", () => {
            document.getElementById("delete-form").innerHTML = "results here";
        }, false);
        document.getElementById("delete-view-tests-button").addEventListener("click", loadDeleteContent, false);
        document.getElementById("delete-tests-button").addEventListener("click", deleteTests, false);

    } catch (error) {
        console.error('Error during test page initialization:', error);
    }
});


function alertMessage() {
    document.getElementById('alert-message').innerHTML = "";
    document.getElementById('test-title').style.backgroundColor = "#ffffff"
}
