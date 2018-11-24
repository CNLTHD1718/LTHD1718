var DbFunction = require('../fn/sqlite3-db');
const tableName = 'User';

class TestRepo {
    constructor(){
        this.createTable();
    }

    createTable() {
         const sql = `CREATE TABLE IF NOT EXISTS User (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             username TEXT,
             password TEXT,
             email TEXT,
             address TEXT,
             state INTERGER
         ) `;
       return DbFunction.run(sql);
    }

    add(obj) {
        return DbFunction.run(`INSERT INTO User  (username, password) VALUES (?,?)`,
        [obj.username, obj.password]);
    }
    update(obj) {
        return DbFunction.run(`UPDATE User SET username = ? WHERE id = ?`,
        [obj.username, obj.id]);
    }
    remove(id) {
        return DbFunction.run(`UPDATE User SET state = ? WHERE id = ?`, [-1 ,id]);
    }
    
    getById(id) {
        return DbFunction.getOne(`SELECT * FROM User WHERE id = ?`, [id])
    }
    getAll() {
        return DbFunction.getAll(`SELECT * FROM  User where state != (-1) or state isnull`);
    }
}

module.exports = TestRepo;