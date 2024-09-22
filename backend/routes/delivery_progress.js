const router = require("koa-router");
const delivery_progress = new router();
const db = require("../middleware/sql");
const jwtAuth = require('../middleware/jwtAuth');

delivery_progress.prefix('/api/delivery_progress');

// 获取配送进度
delivery_progress.get('/', jwtAuth(), async (ctx) => {
    try {
        const rows = await db.search('SELECT * FROM delivery_progress WHERE is_deleted = 0');
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
});

// 添加配送进度
delivery_progress.post('/', jwtAuth(), async (ctx) => {
    const { driver, status, orderId, vehicle } = ctx.request.body;

    if (!driver || !status) {
        ctx.status = 400;
        ctx.body = {
            msg: '司机和状态为必填项'
        };
        return;
    }

    try {
        const result = await db.search(
            'INSERT INTO delivery_progress (driver, status, order_id, vehicle) VALUES (?, ?, ?, ?)',
            [driver, status, orderId, vehicle]
        );

        ctx.body = result.affectedRows > 0
            ? { msg: 'success' }
            : { status: 500, msg: '添加配送进度失败' };
    } catch (error) {
        console.error('添加配送进度失败:', error);
        ctx.status = 500;
        ctx.body = { msg: '添加配送进度失败' };
    }
});

// 确认配送进度
delivery_progress.post('/confirm', jwtAuth(), async (ctx) => {
    const { id } = ctx.request.body;

    try {
        const result = await db.search('UPDATE delivery_progress SET status = "completed" WHERE id = ?', [id]);
        ctx.body = result.affectedRows > 0
            ? { msg: 'success' }
            : { status: 404, msg: '记录未找到' };
    } catch (error) {
        console.error('确认失败:', error);
        ctx.status = 500;
        ctx.body = { msg: '确认失败' };
    }
});

// 删除配送进度（标记删除）
delivery_progress.delete('/:id', jwtAuth(), async (ctx) => {
    const { id } = ctx.params;

    try {
        const result = await db.search('UPDATE delivery_progress SET is_deleted = ? WHERE id = ?', [1, id]);

        ctx.body = result.affectedRows > 0
            ? { msg: 'success' }
            : { status: 404, msg: '配送进度记录未找到' };
    } catch (error) {
        console.error('删除配送进度失败:', error);
        ctx.status = 500;
        ctx.body = { msg: '删除配送进度失败' };
    }
});

module.exports = delivery_progress;
