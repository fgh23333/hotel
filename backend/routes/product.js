const router = require("koa-router")
const product = new router
const db = require("../middleware/sql")
const jwtAuth = require('../middleware/jwtAuth')

product.prefix('/api/product')

product.get('/', jwtAuth(), async (ctx) => {
    try {
        const [rows] = await db.search('SELECT * FROM delivery_progress');
        ctx.body = {
            msg: 'success',
            data: rows
        };
    } catch (error) {
        console.error('获取配送进度失败:', error);
        ctx.status = 500;
        ctx.body = {
            msg: '获取配送进度失败'
        };
    }
})

product.post('/', jwtAuth(), async (ctx) => {
    const { driver, status } = ctx.request.body;

    if (!driver || !status) {
        ctx.status = 400;
        ctx.body = {
            msg: '司机和状态为必填项'
        };
        return;
    }

    try {
        // 插入配送进度数据到数据库
        const result = await db.search(
            'INSERT INTO delivery_progress (driver, status) VALUES (?, ?)',
            [driver, status]
        );

        if (result.affectedRows > 0) {
            ctx.body = {
                msg: 'success'
            };
        } else {
            ctx.status = 500;
            ctx.body = {
                msg: '添加配送进度失败'
            };
        }
    } catch (error) {
        console.error('添加配送进度失败:', error);
        ctx.status = 500;
        ctx.body = {
            msg: '添加配送进度失败'
        };
    }
})

product.delete('/:id', jwtAuth(), async (ctx) => {
    const { id } = ctx.params;

    try {
        const result = await db.search('DELETE FROM delivery_progress WHERE id = ?', [id]);

        if (result.affectedRows > 0) {
            ctx.body = {
                msg: 'success'
            };
        } else {
            ctx.status = 404;
            ctx.body = {
                msg: '配送进度记录未找到'
            };
        }
    } catch (error) {
        console.error('删除配送进度失败:', error);
        ctx.status = 500;
        ctx.body = {
            msg: '删除配送进度失败'
        };
    }
})

module.exports = product