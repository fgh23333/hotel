const Router = require('koa-router');
const employee = new Router();
const db = require('../middleware/sql');
const jwtAuth = require('../middleware/jwtAuth');

employee.prefix('/api/employee');

employee.get('/', jwtAuth(), async (ctx) => {
    try {
        const employee = await db.search('SELECT * FROM employee WHERE status = ?', [1]);

        ctx.body = {
            msg: 'success',
            data: employee
        };
    } catch (error) {
        ctx.status = 500;
        ctx.body = {
            msg: '获取信息失败'
        };
    }
});

employee.post('/', jwtAuth(), async (ctx) => {
    const { EmployeeName, Gender, BirthDate, Position, PhoneNumber, Address } = ctx.request.body;
    try {
        const formattedDate = new Date(BirthDate).toISOString().slice(0, 10);
        const result = await db.search(
            'INSERT INTO employee (EmployeeName, Gender, BirthDate, Position, PhoneNumber, Address) VALUES (?, ?, ?, ?, ?, ?)',
            [EmployeeName, Gender, formattedDate, Position, PhoneNumber, Address]
        );
        ctx.body = { message: '员工信息添加成功', EmployeeID: result.insertId };
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: '服务器错误', error: error.message };
    }
});

employee.put('/:id', jwtAuth(), async (ctx) => {
    const { id } = ctx.params;
    const { EmployeeName, Gender, BirthDate, Position, PhoneNumber, Address } = ctx.request.body;
    try {
        const formattedDate = new Date(BirthDate).toISOString().slice(0, 10);
        const result = await db.search(
            'UPDATE employee SET EmployeeName = ?, Gender = ?, BirthDate = ?, Position = ?, PhoneNumber = ?, Address = ? WHERE EmployeeID = ?',
            [EmployeeName, Gender, formattedDate, Position, PhoneNumber, Address, id]
        );
        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { message: '员工未找到' };
        } else {
            ctx.body = { message: '员工信息更新成功' };
        }
    } catch (error) {
        ctx.status = 500;
        ctx.body = { message: '服务器错误', error: error.message };
    }
})

employee.delete('/:id', jwtAuth(), async (ctx) => {
    const { id } = ctx.params;

    try {
        const result = await db.search('UPDATE employee SET status = ? WHERE id = ?', [0, id]);

        if (result.affectedRows > 0) {
            ctx.body = {
                msg: 'success'
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                msg: '员工不存在'
            };
        }
    } catch (error) {
        console.error('删除员工失败:', error);
        ctx.status = 500;
        ctx.body = {
            msg: '删除员工失败'
        };
    }
})

module.exports = employee;