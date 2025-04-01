export class Result {
    constructor(testId, score, start, end, durationTaken) {
        this.testId = testId;
        this.score = score;
        this.start = start;
        this.end = end;
        this.durationTaken = durationTaken
    }
}

export class User {
    constructor(id, fname, lname, password) {
        this.id = id;
        this.fname = fname;
        this.lname = lname;
        this.password = password;
        this.status = false;
        this.resultLog = [];
    }

    get name() {
        return this.fname + " " + this.lname;
    }

    get score() {
        return this.resultLog.reduce((sum, result) => sum + result.score, 0);
    }
}

export class Profiles {
    constructor() {
        this.profiles = [];
    }

    getUserById(id) {
        return this.profiles.find(user => user.id === id);
    }

    register(id, fname, lname, password) {
        if (this.getUserById(id)) {
            return "User-Id already exists. Try another one.";
        } else {
            const user = new User(id, fname, lname, password);
            this.profiles.push(user);
            return "Registered successfully.";
        }
    }

    login(id, password) {
        const user = this.getUserById(id);
        if (user) {
            if (user.password === password) {
                user.status = true;
                sessionStorage.setItem("profile", JSON.stringify({ id: user.id, name: user.name, score: user.score, resultLog: user.resultLog }));
                return true;
            } else {
                return "Incorrect password.";
            }
        } else {
            return "User doesn't exist! Recheck your ID or register first!";
        }
    }

    logout(id) {
        const user = this.getUserById(id);
        if (user) {
            user.status = false;
            sessionStorage.removeItem("profile");
            return "Logout successfully.";
        } else {
            return "User doesn't exist!";
        }
    }

    logResults(id, testId, score, start, end, durationTaken) {
        const user = this.getUserById(id);
        if (user) {
            const result = new Result(testId, score, start, end, durationTaken);
            user.resultLog.push(result);
            sessionStorage.setItem("profile", JSON.stringify({ id: user.id, name: user.name, score: user.score, resultLog: user.resultLog }));
            return "Results logged successfully.";
        } else {
            return "User doesn't exist!";
        }
    }

    changePass(id, password, newPass) {
        const user = this.getUserById(id);
        if (user) {
            if (user.password === password) {
                user.password = newPass;
                sessionStorage.setItem("profile", JSON.stringify({ id: user.id, name: user.name, score: user.score, resultLog: user.resultLog }));
                return true;
            } else {
                return "Incorrect password.";
            }
        } else {
            return "User doesn't exist! Confirm your ID.";
        }
    }
}
