var sqlite3 = require('sqlite3')
var dbFilePath = './dbTest.sqlite3';

class DbTestFunction {
    constructor() {
        this.db = new sqlite3.Database(dbFilePath, err => {
            if (err) {
                console.log('Can not connect to sqliteDB' + err);
            }
            else {
                console.log('SqliteDB connected');
            }
        });
    }
    run(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.run(query, params, err => {
                if (err) {
                    console.log('running error ' + query);
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }

    getAll(query, params = []) {
        return new Promise((resolve, reject) => {
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    console.log('running error ' + query);
                    console.log(err);
                    reject(err);
                }
                else {
                    resolve(rows);
                }
            });
        });
    }

}

module.exports = new DbTestFunction();
