const Router = require('koa-router');
const { search } = require('../middleware/sql'); // 引入封装好的数据库连接池
const recipient = new Router({
    prefix: '/api/recipient'
});

// 获取所有收件人记录（未被标记删除）
recipient.get('/', async (ctx) => {
    const sql = 'SELECT * FROM recipient WHERE is_deleted = 0';
    try {
        const recipients = await search(sql);
        ctx.body = recipients;
    } catch (err) {
        ctx.status = 500;
        ctx.body = { message: '获取收件人记录失败', error: err.message };
    }
});

// 获取特定收件人记录（未被标记删除）
recipient.get('/:id', async (ctx) => {
    const sql = 'SELECT * FROM recipient WHERE RecipientID = ? AND is_deleted = 0';
    const { id } = ctx.params;
    try {
        const recipients = await search(sql, [id]);
        if (recipients.length === 0) {
            ctx.status = 404;
            ctx.body = { message: '收件人记录未找到或已被删除' };
        } else {
            ctx.body = recipients[0];
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = { message: '获取收件人记录失败', error: err.message };
    }
});

// 新增收件人记录
recipient.post('/', async (ctx) => {
    const { RecipientName, PhoneNumber, Address } = ctx.request.body;
    // 简单的字段验证
    if (!RecipientName || !PhoneNumber || !Address) {
        ctx.status = 400;
        ctx.body = { message: '收件人名称、电话和地址都是必填的' };
        return;
    }
    try {
        const sql = 'INSERT INTO recipient (RecipientName, PhoneNumber, Address) VALUES (?, ?, ?)';
        await search(sql, [RecipientName, PhoneNumber, Address]);
        ctx.status = 201;
        ctx.body = { message: '收件人记录创建成功' };
    } catch (err) {
        ctx.status = 500;
        ctx.body = { message: '创建收件人记录失败', error: err.message };
    }
});

// 更新收件人记录
recipient.put('/:id', async (ctx) => {
    const { RecipientName, PhoneNumber, Address } = ctx.request.body;
    const { id } = ctx.params;
    // 简单的字段验证
    if (!RecipientName || !PhoneNumber || !Address) {
        ctx.status = 400;
        ctx.body = { message: '收件人名称、电话和地址都是必填的' };
        return;
    }
    try {
        const sql = 'UPDATE recipient SET RecipientName = ?, PhoneNumber = ?, Address = ? WHERE RecipientID = ? AND is_deleted = 0';
        const result = await search(sql, [RecipientName, PhoneNumber, Address, id]);
        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { message: '收件人记录未找到或已被删除' };
        } else {
            ctx.body = { message: '收件人记录更新成功' };
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = { message: '更新收件人记录失败', error: err.message };
    }
});

// 标记删除收件人记录
recipient.delete('/:id', async (ctx) => {
    const { id } = ctx.params;
    try {
        const sql = 'UPDATE recipient SET is_deleted = 1 WHERE RecipientID = ? AND is_deleted = 0';
        const result = await search(sql, [id]);
        if (result.affectedRows === 0) {
            ctx.status = 404;
            ctx.body = { message: '收件人记录未找到或已被删除' };
        } else {
            ctx.status = 204; // No Content
        }
    } catch (err) {
        ctx.status = 500;
        ctx.body = { message: '标记删除收件人记录失败', error: err.message };
    }
});

module.exports = recipient;
