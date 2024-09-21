const router = require("koa-router")
const order = new router
const db = require("../middleware/sql")
const jwtAuth = require('../middleware/jwtAuth')

order.prefix('/api/order')

order.get('/', jwtAuth(), async (ctx) => {
    try {
        let rows = await db.search('SELECT * FROM orders');
        for (let i = 0; i < rows.length; i++) {
            rows[i].date = rows[i].date.toISOString().slice(0, 19).replace('T', ' ');
        }
        
        ctx.body = {
            msg: 'success',
            data: rows
        };
    } catch (error) {
        console.error('获取订单失败:', error);
        ctx.status = 500;
        ctx.body = {
            msg: '获取订单失败'
        };
    }
})

order.post('/', jwtAuth(), async (ctx) => {
    const { customer, date, status } = ctx.request.body;

    if (!customer || !date || !status) {
        ctx.status = 400;
        ctx.body = {
            msg: '客户、日期和状态为必填项'
        };
        return;
    }

    try {
        const formattedDate = new Date(date).toISOString().slice(0, 19).replace('T', ' ');
        // 插入订单数据到数据库
        const result = await db.search(
            'INSERT INTO orders (customer, date, status) VALUES (?, ?, ?)',
            [customer, formattedDate, status]
        );

        if (result.affectedRows > 0) {
            ctx.body = {
                msg: 'success'
            };
        } else {
            ctx.status = 500;
            ctx.body = {
                msg: '添加订单失败'
            };
        }
    } catch (error) {
        console.error('添加订单失败:', error);
        ctx.status = 500;
        ctx.body = {
            msg: '添加订单失败'
        };
    }
});

order.post('/cancel', jwtAuth(), async (ctx) => {
    const { id } = ctx.request.body;

    if (!id) {
        ctx.status = 400;
        ctx.body = {
            msg: '订单 ID 为必填项'
        };
        return;
    }

    try {
        // 查询订单
        const [order] = await db.search('SELECT * FROM orders WHERE id = ?', [id]);

        if (order.length === 0) {
            ctx.status = 404;
            ctx.body = {
                msg: '订单未找到'
            };
            return;
        }

        // 取消订单
        const result = await db.search('UPDATE orders SET status = ? WHERE id = ?', ['cancelled', id]);

        if (result.affectedRows > 0) {
            ctx.body = {
                msg: '订单取消成功'
            };
        } else {
            ctx.status = 500;
            ctx.body = {
                msg: '订单取消失败'
            };
        }
    } catch (error) {
        console.error('取消订单失败:', error);
        ctx.status = 500;
        ctx.body = {
            msg: '取消订单失败'
        };
    }
});

module.exports = order