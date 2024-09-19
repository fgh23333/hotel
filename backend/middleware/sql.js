const mysql = require("mysql")

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'delivery'
})

function search(sql, params = []) {
    return new Promise((resolve, reject) => {
        db.getConnection((err, connection) => {
            if (err) {
                return reject(err); // 返回连接错误
            }
            connection.query(sql, params, (err, rows) => {
                connection.release(); // 释放连接
                if (err) {
                    return reject(err); // 返回查询错误
                }
                resolve(rows); // 成功返回结果
            });
        });
    });
}

exports.search = search