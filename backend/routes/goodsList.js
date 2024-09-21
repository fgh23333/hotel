const Router = require('koa-router');
const { search } = require('../middleware/sql'); // 引入封装的数据库连接池
const goodsList = new Router();
const jwtAuth = require('../middleware/jwtAuth')

goodsList.prefix('/api/goodsList')

goodsList.get('/', jwtAuth(), async (ctx) => {
    const sql = 'SELECT * FROM goods WHERE is_deleted = 0';
    try {
        const goods = await search(sql);
        ctx.body = goods;
    } catch (err) {
        ctx.status = 500;
        ctx.body = { message: '获取货物失败', error: err.message };
    }
});

goodsList.get('/:id', jwtAuth(), async (ctx) => {
    const sql = 'SELECT * FROM goods WHERE GoodsID = ? AND is_deleted = 0';
    try {
        const goods = await search(sql, [ctx.params.id]);
        if (goods.length === 0) {
            ctx.status = 404;
            ctx.body = { message: '货物未找到或已被删除' };
        } else {
            ctx.body = goods[0];
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = { message: '获取货物失败', error: err.message };
    }
});

goodsList.post('/', jwtAuth(), async (ctx) => {
    const { CustomerID, GoodsName, EntryDate } = ctx.request.body;
    const sql = 'INSERT INTO goods (CustomerID, GoodsName, EntryDate) VALUES (?, ?, ?)';
    try {
        const formattedDate = new Date(EntryDate).toISOString().slice(0, 10);
        await search(sql, [CustomerID, GoodsName, formattedDate]);
        ctx.status = 201;
        ctx.body = { message: '货物创建成功' };
    } catch (err) {
        ctx.status = 400;
        ctx.body = { message: '创建货物失败', error: err.message };
    }
});

goodsList.put('/:id', jwtAuth(), async (ctx) => {
    const { CustomerID, GoodsName, EntryDate } = ctx.request.body;
    const sql = 'UPDATE goods SET CustomerID = ?, GoodsName = ?, EntryDate = ? WHERE GoodsID = ?';
    try {
        const formattedDate = new Date(EntryDate).toISOString().slice(0, 10);
        const result = await search(sql, [CustomerID, GoodsName, formattedDate, ctx.params.id]);
        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { message: '货物未找到' };
        } else {
            ctx.body = { message: '货物更新成功' };
        }
    } catch (err) {
        ctx.status = 400;
        ctx.body = { message: '更新货物失败', error: err.message };
    }
});

goodsList.delete('/:id', async (ctx) => {
    const sql = 'UPDATE goods SET is_deleted = 1 WHERE GoodsID = ?';
    try {
        const result = await search(sql, [ctx.params.id]);
        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { message: '货物未找到' };
        } else {
            ctx.status = 204;
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = { message: '标记删除货物失败', error: err.message };
    }
});

module.exports = goodsList
