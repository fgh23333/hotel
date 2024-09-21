const Router = require('koa-router');
const user = new Router();
const db = require('../middleware/sql');
const jwtAuth = require('../middleware/jwtAuth');

user.prefix('/api/user');

user.get('/', jwtAuth(), async (ctx) => {
  try {
    const users = await db.search('SELECT * FROM users');

    ctx.body = {
      msg: 'success',
      data: users
    };
  } catch (error) {
    console.error('获取用户信息失败:', error);
    ctx.status = 500;
    ctx.body = {
      msg: '获取用户信息失败'
    };
  }
});

user.post('/', async (ctx) => {
  const { name, phone, email, address } = ctx.request.body;

  if (!name || !phone) {
    ctx.status = 400;
    ctx.body = {
      msg: '姓名和电话为必填项'
    };
    return;
  }

  try {
    // 向数据库中插入新客户
    const result = await db.search('INSERT INTO users (name, phone, email, address) VALUES (?, ?, ?, ?)', [name, phone, email, address]);

    if (result.affectedRows > 0) {
      ctx.body = {
        msg: 'success'
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        msg: '添加客户失败'
      };
    }
  } catch (error) {
    console.error('添加客户失败:', error);
    ctx.status = 500;
    ctx.body = {
      msg: '添加客户失败'
    };
  }
});

user.delete('/:id', jwtAuth(), async (ctx) => {
  const userId = ctx.params.id;

  try {
    // 从数据库中删除用户
    const result = await db.search('DELETE FROM users WHERE id = ?', [userId]);

    if (result.affectedRows > 0) {
      ctx.body = {
        msg: 'success'
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        msg: '用户不存在'
      };
    }
  } catch (error) {
    console.error('删除用户失败:', error);
    ctx.status = 500;
    ctx.body = {
      msg: '删除用户失败'
    };
  }
})

module.exports = user;