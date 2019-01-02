var DbFunction = require('../fn/sqlite3-db');
var moment = require('moment');

class RequestRepo {
    constructor() {
        this.createTable();
        this.createTableDetail();
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
             Status INTERGER,
             DateCreate TEXT
         ) `;
        return DbFunction.run(sql);
    }

    createTableDetail() {
        const sql = `CREATE TABLE IF NOT EXISTS RequestDetail (
             Id INTEGER PRIMARY KEY AUTOINCREMENT,
             RequestID INTEGER,
             DriverID INTEGER,
             DateAccept TEXT,
             DateDone TEXT
         ) `;
        return DbFunction.run(sql);
    }

    insert(obj) {
        var time = moment().format("DD/MM/YYYY hh:mm:ss a")
        return DbFunction.run(`INSERT INTO Request  (Name, Address,Phone,Note,Status,DateCreate) 
                               VALUES (?,?,?,?,?,?)`,
            [obj.Name, obj.Address, obj.Phone, obj.Note, 0, time]);
    }
    update(obj) {
        return DbFunction.run(`UPDATE Request SET Status = ? WHERE Id = ?`,
            [obj.Status, obj.Id]);
    }
    updateLocate(obj) {
        return DbFunction.run(`UPDATE Request SET Status = ?, Lat = ?, Lng = ? WHERE Id = ?`,
            [1, obj.Lat, obj.Lng, obj.Id]);
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
    loadUnidentified() {
        return DbFunction.getAll(`SELECT * FROM  Request WHERE Status = 0`);
    }
    loadAll_Request_Waiting() {
        return DbFunction.getAll(`SELECT * FROM  Request WHERE Status = 0`);
    }
    loadAll_Request_Ready() {
        return DbFunction.getAll(`SELECT * FROM  Request WHERE Status = 1`);
    }
    loadDetail(id) {
        return DbFunction.getAll(`
        SELECT R.Id as RequestID,R.Name,R.Address,R.Phone,R.Note,
        RD.DriverID as Driver,D.Name as DriverName,D.Username as DriverUser,RD.DateAccept as TimeAccept,RD.DateDone as TimeDone
        FROM  Request R
        LEFT JOIN RequestDetail RD On R.Id = RD.RequestID 
        LEFT JOIN User D ON RD.DriverID = D.Id
        WHERE R.Id = ?
        `, [id]);
    }
    insertDetail(obj) {
        var time = moment().format("DD/MM/YYYY hh:mm:ss a")
        return DbFunction.run(`INSERT INTO RequestDetail  (RequestID, DriverID,DateAccept) 
                               VALUES (?,?,?)`,
            [obj.ReqID, obj.DriID, time]);
    }
    updateDetail(obj) {
        var time = moment().format("DD/MM/YYYY hh:mm:ss a")
        return DbFunction.run(`UPDATE RequestDetail 
        SET DateDone = ? WHERE RequestID = ? AND DriverID = ?`, [time, obj.ReqID, obj.DriID]);
    }
}

module.exports = RequestRepo;