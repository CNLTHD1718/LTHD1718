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
             RLat REAL,
             RLng REAL,
             Status INTERGER,
             DateCreateU TEXT,
             DateCreate TEXT
         ) `;
        return DbFunction.run(sql);
    }

    createTableDetail() {
        const sql = `CREATE TABLE IF NOT EXISTS RequestDetail (
             Id INTEGER PRIMARY KEY AUTOINCREMENT,
             RequestID INTEGER,
             DriverID INTEGER,
             DLat REAL,
             DLng REAL,
             RLat REAL,
             RLng REAL,
             DateAccept TEXT,
             DateDone TEXT
         ) `;
        return DbFunction.run(sql);
    }

    insert(obj) {
        var time = moment().format("DD/MM/YYYY hh:mm:ss a")
        var utime = moment().unix();
        return DbFunction.run(`INSERT INTO Request  (Name, Address,Phone,Note,Status,DateCreate,DateCreateU) 
                               VALUES (?,?,?,?,?,?,?)`,
            [obj.Name, obj.Address, obj.Phone, obj.Note, 0, time, utime]);
    }
    update(obj) {
        return DbFunction.run(`UPDATE Request SET Status = ? WHERE Id = ?`,
            [obj.Status, obj.Id]);
    }
    updateLocate(obj) {
        return DbFunction.run(`UPDATE Request SET Status = ?, Lat = ?, Lng = ?, RLat = ?,RLng = ? 
        WHERE Id = ?`,
            [1, obj.Lat, obj.Lng, obj.RLat, obj.RLng, obj.Id]);
    }
    delete(id) {
        return DbFunction.run(`UPDATE Request SET Status = ? WHERE id = ?`, [-1, id]);
    }
    load(id) {
        return DbFunction.getOne(`SELECT * FROM Request WHERE id = ?`, [id])
    }
    loadAll() {
        return DbFunction.getAll(`SELECT * FROM  Request ORDER BY DateCreateU DESC`);//state != (-1)
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
        RD.DriverID as Driver,D.Name as DriverName,D.Username as DriverUser,RD.DateAccept as TimeAccept,RD.DateDone as TimeDone,
        RD.RLat, RD.RLng,RD.DLat,RD.DLng
        FROM  Request R
        LEFT JOIN RequestDetail RD On R.Id = RD.RequestID 
        LEFT JOIN User D ON RD.DriverID = D.Id
        WHERE R.Id = ?
        `, [id]);
    }
    insertDetail(obj) {
        var time = moment().format("DD/MM/YYYY hh:mm:ss a")
        return DbFunction.run(`INSERT INTO RequestDetail  (RequestID, DriverID,DateAccept,RLat,RLng,DLat,DLng) 
                               VALUES (?,?,?,?,?,?,?)`,
            [obj.ReqID, obj.DriID, time, obj.RLat, obj.RLng, obj.DLat, obj.DLng]);
    }
    updateDetail(obj) {
        var time = moment().format("DD/MM/YYYY hh:mm:ss a")
        return DbFunction.run(`UPDATE RequestDetail 
        SET DateDone = ? WHERE RequestID = ? AND DriverID = ?`, [time, obj.ReqID, obj.DriID]);
    }
    loadHistory(phone){        
        return DbFunction.getAll(`SELECT * FROM Request WHERE Phone = ?`, [phone])
    }
}

module.exports = RequestRepo;