const Router = require('koa-router');
const { search } = require('../middleware/sql'); // 引入封装好的数据库连接池
const warehouse = new Router({
    prefix: '/api/warehouse'
});

// 获取所有仓库记录（未被标记删除）
warehouse.get('/', async (ctx) => {
    const sql = 'SELECT * FROM warehouse WHERE is_deleted = 0';
    try {
        const warehouses = await search(sql);
        ctx.body = warehouses;
    } catch (err) {
        ctx.status = 500;
        ctx.body = { message: '获取仓库记录失败', error: err.message };
    }
});

// 获取特定仓库记录（未被标记删除）
warehouse.get('/:id', async (ctx) => {
    const sql = 'SELECT * FROM warehouse WHERE WarehouseID = ? AND is_deleted = 0';
    const { id } = ctx.params;
    try {
        const warehouses = await search(sql, [id]);
        if (warehouses.length === 0) {
            ctx.status = 404;
            ctx.body = { message: '仓库记录未找到或已被删除' };
        } else {
            ctx.body = warehouses[0];
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = { message: '获取仓库记录失败', error: err.message };
    }
});

// 新增仓库记录
warehouse.post('/', async (ctx) => {
    const { GoodsID, EntryDate, ExitDate } = ctx.request.body;
    const sql = 'INSERT INTO warehouse (GoodsID, EntryDate, ExitDate) VALUES (?, ?, ?)';
    try {
        const formattedEntryDate = new Date(EntryDate).toISOString().slice(0, 10);
        const formattedExitDate = new Date(ExitDate).toISOString().slice(0, 10);
        await search(sql, [GoodsID, formattedEntryDate, formattedExitDate]);
        ctx.status = 201;
        ctx.body = { message: '仓库记录创建成功' };
    } catch (err) {
        ctx.status = 400;
        ctx.body = { message: '创建仓库记录失败', error: err.message };
    }
});

// 更新仓库记录
warehouse.put('/:id', async (ctx) => {
    const { GoodsID, EntryDate, ExitDate } = ctx.request.body;
    const { id } = ctx.params;
    const sql = 'UPDATE warehouse SET GoodsID = ?, EntryDate = ?, ExitDate = ? WHERE WarehouseID = ? AND is_deleted = 0';
    try {
        const formattedEntryDate = new Date(EntryDate).toISOString().slice(0, 10);
        const formattedExitDate = new Date(ExitDate).toISOString().slice(0, 10);
        const result = await search(sql, [GoodsID, formattedEntryDate, formattedExitDate, id]);
        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { message: '仓库记录未找到或已被删除' };
        } else {
            ctx.body = { message: '仓库记录更新成功' };
        }
    } catch (err) {
        ctx.status = 400;
        ctx.body = { message: '更新仓库记录失败', error: err.message };
    }
});

// 标记删除仓库记录
warehouse.delete('/:id', async (ctx) => {
    const { id } = ctx.params;
    const sql = 'UPDATE warehouse SET is_deleted = 1 WHERE WarehouseID = ? AND is_deleted = 0';
    try {
        const result = await search(sql, [id]);
        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { message: '仓库记录未找到或已被删除' };
        } else {
            ctx.status = 204; // No Content
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = { message: '标记删除仓库记录失败', error: err.message };
    }
});

module.exports = warehouse;
