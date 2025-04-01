// load.js
import {data} from "./data.js";
import {Tests, Question, Test} from "./temp_data.js"
// import { loadLocalStorageData } from "../tests_content.js"

let tests_object = new Tests();

export function loadDemo() {
    const dtest1 = new Test("javascripts");
    const question1 = new Question(0, 'multiple', 'medium', 'Science: Computers', 'What is the correct syntax to print a message in the console in JavaScript?', 'console.log()', ['console.print()', 'print()', 'log()']);
    const question2 = new Question(1, 'multiple', 'medium', 'Science: Computers', 'Which data type is used to create a variable that should store text?', 'String', ['Text', 'MyString', 'str']);
    dtest1.addQuestions(question1, question2);
    tests_object.addTests(dtest1);
    data.tests.forEach(loadSampleData);
    window.tests_object = tests_object;
    localStorage.testData = JSON.stringify(tests_object);
}

function loadSampleData(value) {
    let test = new Test(value.title);
    value.questions.forEach(loadSampleQuestions);

    function loadSampleQuestions(value, index) {
        let question = new Question(index, value.type, value.difficulty, value.category, value.question, value.correct_answer, value.incorrect_answers);
        test.addQuestions(question);
    }

    tests_object.addTests(test);
}
