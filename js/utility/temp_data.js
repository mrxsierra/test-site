// ./js/utility/temp_data.js
// test data class object
export class Question {
    // static lastId = 0;
    constructor(index, type, difficulty, category, question, correct_answer, incorrect_answers) {
        this.id =  index;// ++Question.lastId;
        this.type = type;
        this.difficulty = difficulty;
        this.category = category;
        this.question = question;
        this.correct_answer = correct_answer;
        this.incorrect_answers = incorrect_answers;
    }

    get options() {
        const options = [this.correct_answer, ...this.incorrect_answers];
        return options.sort(function() { return 0.5 - Math.random() });
    }

    toString() {
        return `Question ID: ${this.id}\n${this.type}, ${this.difficulty}, ${this.category}\nQuestion: ${this.question} \nCorrect Answer: ${this.correct_answer}\nIncorrect Answer: ${this.incorrect_answers.join(', ')}`;
    }
}

export class Test {
    static lastId = 0;
    constructor(title) {
        this.id = ++Test.lastId;
        this.title = title;
        this.questions = [];
    }

    static resetLastId() {
        Test.lastId = 0;
    }

    addQuestions(...questions) {
        questions.forEach(question => {
            if (question instanceof Question) {
                this.questions.push(question);
            } else {
                throw new Error('Invalid Question object');
            }
        });
    }

    getQuestions() {
        return this.questions.sort(function() { return 0.5 - Math.random() });
    }

    removeQuestionByIds(...questionIds) {
        for (let questionId of questionIds) {
            this.questions = this.questions.filter(q => q.id !== questionId);
        }
    }

    getQuestionByIds(...questionIds) {
        for (let questionId of questionIds) {
            return this.questions.find(q => q.id === questionId);
        }
    }

    getQuestionByTitles(...questionTitles) {
        for (let questionTitle of questionTitles) {
            return this.questions.find(q => q.question === questionTitle);
        }
    }

    toString() {
        return `Test ID: ${this.id}\nTitle: ${this.title}\nQuestions:\n${this.questions.map(q => q.toString()).join('\n\n')}`;
    }
}

export class Tests {
    constructor() {
        this.tests = [];
    }

    addTests(...tests) {
        for (let test of tests) {
            if (test instanceof Test) {
                this.tests.push(test);
            } else {
                throw new Error('Invalid Test object');
            }
        }
    }

    // removeTestByIds(...testIds) {
    //     for (let testId of testIds) {
    //         const filteredTests = this.tests.find(t => t.id !== testId);
    //         this.tests = filteredTests == undefined ? [] : filteredTests;
    //     }
    // }

    removeTestByIds(...testIds) {
        if (testIds.length === 0) {
            console.warn('No test IDs provided for removal.');
            return;
        }

        this.tests = this.tests.filter(test => !testIds.includes(test.id));
    }


    getTests() {
        return this.tests.sort(function() { return 0.5 - Math.random() });
    }

    getTestByIds(...testIds) {
        for (let testId of testIds) {
            return this.tests.find(t => t.id === testId);
        }
    }

    getTestByTitles(...testTitles) {
        for (let testTitle of testTitles) {
            return this.tests.find(t => t.title === testTitle);
        }
    }

    toString() {
        return `Tests: ${this.tests.map(t => t.toString()).join('\n\n')}\n\n`;
    }
}



