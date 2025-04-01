// file_handle.js
import { Tests, Question, Test } from "./temp_data.js"

const createResults = document.getElementById('create-results');
const readResults = document.getElementById('read-section');
const alertMessage = document.getElementById('alert-message')

export let tests_object, newTest, deleteForm, testQuestions, updateTestData, results;

export function handleFile(event) {
  const file = event.target.files[0];
  alertMessage.innerHTML = `<div style="color:green;font-weight:bolder;margin:2px;">Choosen file${file.name}<div>`
  const reader = new FileReader();

  reader.onload = function(e) {
    const data = e.target.result;
    const extension = file.name.split('.').pop().toLowerCase();
    let jsonData, htmlTableData;

    if (extension === 'csv') {
      jsonData = window.parseCSV(data);
    } else if (extension === 'xlsx' || extension === 'xls') {
      jsonData = window.parseExcel(data);
    } else {
      alert('Unsupported file type');
    }
    newTest = jsonData;
    htmlTableData = jsonToHtmlTable(jsonData);
    displayData(htmlTableData, createResults);
  };

  if (file) {
    reader.readAsBinaryString(file);
  }
}

window.parseCSV = function parseCSV(data) {
  let jsonData;
  Papa.parse(data, {
    header: true,
    complete: function(results) {
      jsonData = results.data;
    }
  });
  return jsonData;
}

window.parseExcel = function parseExcel(data) {
  const workbook = XLSX.read(data, { type: 'binary' });
  const firstSheet = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheet];
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 0 });
  return jsonData;
}

export function jsonToHtmlTable(data) {
  const table = document.createElement('table');
  const headerRow = document.createElement('tr');

  // Create table headers
  Object.keys(data[0]).forEach(key => {
    const th = document.createElement('th');
    th.textContent = key;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Create table rows
  data.forEach(row => {
    const tr = document.createElement('tr');
    Object.values(row).forEach(value => {
      const td = document.createElement('td');
      td.textContent = value;
      tr.appendChild(td);
    });
    table.appendChild(tr);
  });
  return table;
}

export function displayData(data, element) {
  element.innerHTML = '';

  if (data.length === 0) {
    element.innerHTML = '<p>No data to display</p>';
    return;
  }

  element.appendChild(data);
}


export function handleAddTest() {
  alertMessage.innerHTML = "";
  const title = document.getElementById('test-title');
  if (!title.value) {
    title.style.backgroundColor = "#fad5d5";
    alertMessage.innerHTML = "title must be filled out!";
    title.focus();
    return false;
  }
  const test = new Test(title.value);
  if (!newTest) {
    alertMessage.innerHTML = "Upload test file first"
    throw "Test file Not uploaded or added"
  }
  newTest.forEach((value, index) => {
    // console.log(value, index)
    const columnsMatch = ['type', 'difficulty', 'category', 'question', 'correct_answer', 'incorrect_answers']

    if (Object.keys(value).length != 6 && Object.keys(value) != columnsMatch) {
      console.log(`"Unsupported: file has columns that Don't Match, Expected:"6" Given:"${Object.keys(value).length}"`);
      createResults.innerHTML = `
      <h3 style="color:red;">Error Alert: Unsupported file!</h3><br>
      <p>Required Exact "Six" columns Which should Match this below:<br><br>
      <div style="font-weight:bolder;color:green;">"${columnsMatch}"</div><br>
      and if "Multiple Incorrect Answers" than split them By "|" like:<br>
      eg. "a|b|c"</p>
      `;
    }

    if (toString(value.incorrect_answers).includes(",")) {
      console.log(`Error: "Multiple incorrect Answers Should be splited by "|" in CSV/Excel."`);
      alert("Multiple incorrect Answers Should be splited by " | " in CSV/Excel.");
    }
    let incorrectAnswers;
    try {
      incorrectAnswers = value.incorrect_answers.trim().split("|")
      // console.log(`incorect answer ${typeof incorrectAnswers}`) //error check log
    } catch (err) {
      alert(`"incorrect_answers" column don't Match`);
      throw (`"incorrect_answers" column don't Match`);
    }

    let question = new Question(
      index,
      value.type,
      value.difficulty,
      value.category,
      value.question,
      value.correct_answer,
      incorrectAnswers)
    test.addQuestions(question);
  });

  handleTestsStorage(test);

  createResults.innerHTML = `<h3><b>${title.value}</b> test added Successfully.</h3>`;
  title.value = "";
}

export function handleTestsStorage(test) {
  if (!localStorage.testData) {
    tests_object = new Tests();
    window.tests_object = tests_object;
    tests_object.addTests(test);
  } else {
    writeTestsObject();
    tests_object.addTests(test);
  }
  localStorage.testData = JSON.stringify(tests_object);
}

export function writeTestsObject() {
  try {
      tests_object = new Tests();
      window.tests_object = tests_object;
      Test.resetLastId();
      // console.log(tests_object);
      const jsonData = JSON.parse(localStorage.testData);
      const testsData = Array.isArray(jsonData.tests) ? jsonData.tests : Object.values(jsonData);
      testsData.forEach(loadLocalStorageData);
  } catch (error) {
      console.error('Error while setting up tests:', error.message);
  }
}


function loadLocalStorageData(value) {
  // console.log(value) //error check log
  let test = new Test(value.title);

  value.questions.forEach(loadSampleQuestions);

  function loadSampleQuestions(value, index) {
    // console.log(value, index) //error check log
    let question = new Question(index, value.type, value.difficulty, value.category, value.question, value.correct_answer, value.incorrect_answers);
    test.addQuestions(question);
  }

  tests_object.addTests(test);
}

export function updateCreateContent(event) {
  document.querySelectorAll(".tests-nav").forEach(nav => {
    nav.classList.remove("active");
  });
  document.querySelectorAll(".display").forEach(section => {
    if (section.classList.contains(event.target.classList[0])) {
      section.classList.add("active")
      section.style.display = "grid";
    }
    else {
      section.classList.remove("active");
      section.style.display = "none";
    }
  });
  document.getElementById("tests-content-toggle").innerHTML = event.target.innerHTML;
  event.target.classList.add("active");
}

export function loadReadContent() {
  const totalTests = document.getElementById('total-counts');
  const datalist = document.getElementById('tests_list');
  totalTests.innerHTML = tests_object.tests.length;

  if (datalist.firstChild) { cleanChildById(datalist.id) }

  if (tests_object.tests.length != 0) {
    tests_object.tests.forEach(test => {
      const option = document.createElement("option");
      const value = document.createAttribute("value");
      option.value = test.title
      datalist.appendChild(option);
    })
  }
}

export function updateReadContent(event) {
  const results = document.getElementById("selected-results");
  const targetTestData = tests_object.getTestByTitles(event.target.value);
  const tableData = jsonToHtmlTable(targetTestData.questions);
  // console.log(tableData);
  displayData(tableData, results);
}

export function loadSelectTest(element_id) {
  const datalist = document.getElementById(element_id);
  if (datalist.firstChild) { cleanChildById(datalist.id) }

  // console.log(tests_object.tests);
  if (tests_object.tests.length > 0) {
    tests_object.tests.forEach(test => {
      const option = document.createElement("option");
      const value = document.createAttribute("value");
      option.value = test.title
      datalist.appendChild(option);
      // console.log(`datalist ${datalist.children.length}`)
    })
  } else {
    console.error("Tests object have no tests");
  }
}

export function loadSelectQuestion(event) {
  updateTestData = tests_object.getTestByTitles(event.target.value);
  const datalist = document.getElementById('questions_list');

  if (updateTestData.questions.length != 0) {
    updateTestData.questions.forEach(q => {
      const option = document.createElement("option");
      const value = document.createAttribute("value");
      option.value = q.question
      datalist.appendChild(option);
    })
  }
}

export function updateUpdateContent(event) {
  results = document.getElementById("update-results");
  if (results.firstChild) { cleanChildById(results.id) }
  testQuestions = updateTestData.getQuestionByTitles(event.target.value);

  const form = document.createElement("form");
  Object.keys(testQuestions).forEach(key => {
    if (key != "id") {
      const label = document.createElement("label");
      const input = document.createElement("input");
      const div = document.createElement("div");
      label.setAttribute("for", key);
      input.setAttribute("type", "text");
      input.setAttribute("id", key);
      input.setAttribute("name", key);
      input.setAttribute("class", "q-form");
      div.setAttribute("class", "q-form-div");
      label.innerHTML = key;
      if (key == "incorrect_answers") {
        input.value = testQuestions[key].join('|');
      } else {
        input.value = testQuestions[key];
      }
      div.appendChild(label);
      div.appendChild(input);
      form.appendChild(div);
    }
  })
  results.appendChild(form);
}


export function updateTestChanges() {
  const testTitle = document.getElementById("update-test-title");
  if (testTitle.value == "") { alert("Select Test First") }
  const testQuestion = document.getElementById("update-test-question");
  const inputs = document.getElementsByClassName("q-form");
  for (let i = 0; i < inputs.length; i++) {
    const key = inputs[i].id;
    if (key == "incorrect_answers") {
      testQuestions[key] = inputs[i].value.trim().split("|");
    } else {
      testQuestions[key] = inputs[i].value.trim();
    }
  }
  localStorage.testData = JSON.stringify(tests_object);
  testQuestion.value = "";
  testTitle.value = "";
  // cleanChildById("update_tests_list");
  cleanChildById("questions_list");
  cleanChildById(results.id);
  const message = document.createElement("div")
  message.style.color = "green"
  message.innerHTML = "Test Updated Sucessfully...<br><br>"
  results.appendChild(message);
}

export function cleanChildById(id = event.target.id) {
  const element = document.getElementById(id);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
}

// delete Section
export function loadDeleteContent() {
  deleteForm = document.getElementById("delete-form");
  deleteForm.innerHTML = "";

  if (deleteForm.firstChild) { cleanChildById(deleteForm.id) }

  const table = document.createElement('table');
  const headerRow = document.createElement('tr');
  const testCol = document.createElement('th');
  const checkBoxCol = document.createElement('th');
  testCol.textContent = "Tests";
  checkBoxCol.textContent = "Selected";
  headerRow.appendChild(testCol);
  headerRow.appendChild(checkBoxCol);
  table.appendChild(headerRow);

  tests_object.tests.forEach(test => {
    const baseRow = document.createElement('tr');
    const tdLabel = document.createElement("td");
    const tdInput = document.createElement("td");
    const label = document.createElement("label");
    const input = document.createElement("input");
    label.setAttribute("for", test.title);
    baseRow.setAttribute("id", test.title + "-row");
    baseRow.setAttribute("class", "test-row");
    input.setAttribute("type", "checkbox");
    input.setAttribute("id", test.title);
    input.setAttribute("name", "test");
    input.setAttribute("value", test.id);
    input.setAttribute("class", "checkbox-delete");
    label.innerHTML = test.title;
    tdLabel.appendChild(label);
    tdInput.appendChild(input);
    baseRow.appendChild(tdLabel);
    baseRow.appendChild(tdInput);
    table.appendChild(baseRow);
  });
  deleteForm.appendChild(table);

  updateCheckboxContent('.test-row');
}

export function updateCheckboxContent(selector) {
  const testRows = document.querySelectorAll(selector);

  testRows.forEach(row => {
      const input = row.querySelector('input');
      input.addEventListener('change', () => {
          updateCheckbox(input, row);
      });

      // Optional: Also handle row clicks to toggle checkbox state
      row.addEventListener('click', (event) => {
          // Avoid toggling when clicking directly on the checkbox
          if (event.target.tagName !== 'INPUT') {
              input.checked = !input.checked;
              updateCheckbox(input, row);
          }
      });
  });
}


function updateCheckbox(input, row) {
  if (input.checked) {
      row.classList.add('checked');
      input.classList.add('checked');
  } else {
      row.classList.remove('checked');
      input.classList.remove('checked');
  }
}


export function deleteTests() {
  const rows = document.querySelectorAll(".test-row.checked")
  const testTitles = []
  rows.forEach(row => {
    const input = row.querySelector("input");
    testTitles.push(input.id);
    tests_object.removeTestByIds(Number(input.value));
    console.log(`${input.value} test deleted`)
  });
  if (testTitles.length == 0) {
    deleteForm.innerHTML = `<h3 style="color:red;">No test selected, select test First!</h3>`;
    console.error("Delete error: No test Selected");
    return false;
  }
  localStorage.testData = JSON.stringify(tests_object);
  deleteForm.innerHTML = `<h3 style="color:green;">${testTitles} test deleted Sucessfully</h3>`
}
