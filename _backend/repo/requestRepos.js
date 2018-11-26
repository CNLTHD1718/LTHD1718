var DbFunction = require('../fn/sqlite3-db');

class TestRepo {
    constructor() {
        this.createTable();
    }

    createTable() {
        const sql = `CREATE TABLE IF NOT EXISTS Request (
             Id INTEGER PRIMARY KEY AUTOINCREMENT,
             Name TEXT,
             Address TEXT,
             Phone TEXT,
             Note TEXT,
             Lat REAL,
             Lng REAL,
             Status INTERGER
         ) `;
        return DbFunction.run(sql);
    }

    insert(obj) {
        return DbFunction.run(`INSERT INTO Request  (Name, Address,Phone,Note,Status) 
                               VALUES (?,?,?,?,?)`,
            [obj.Name, obj.Address, obj.Phone, obj.Note, 0]);
    }
    update(obj) {
        return DbFunction.run(`UPDATE Request SET Status = ? WHERE Id = ?`,
            [obj.Status, obj.Id]);
    }
    updateLocate(obj) {
        return DbFunction.run(`UPDATE Request SET Status = ?, Lat = ?, Lng = ? WHERE Id = ?`,
            [1,obj.Lat,obj.Lng, obj.Id]);
    }
    delete(id) {
        return DbFunction.run(`UPDATE Request SET Status = ? WHERE id = ?`, [-1, id]);
    }
    load(id) {
        return DbFunction.getOne(`SELECT * FROM Request WHERE id = ?`, [id])
    }
    loadAll() {
        return DbFunction.getAll(`SELECT * FROM  Request `);//state != (-1)
    }
    
    loadAll_Request_Waiting(){
        return DbFunction.getAll(`SELECT * FROM  Request WHERE Status = 0`);
    }
    loadAll_Request_Ready(){
        return DbFunction.getAll(`SELECT * FROM  Request WHERE Status = 1`);
    }
}

module.exports = TestRepo;