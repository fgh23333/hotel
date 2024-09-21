const Router = require('koa-router');
const truck = new Router();
const db = require('../middleware/sql');
const jwtAuth = require('../middleware/jwtAuth');

truck.prefix('/api/truck');

truck.get('/', jwtAuth(), async (ctx) => {
  try {
    const users = await db.search('SELECT * FROM truck');

    ctx.body = {
      msg: 'success',
      data: users
    };
  } catch (error) {
    console.error('获取信息失败:', error);
    ctx.status = 500;
    ctx.body = {
      msg: '获取信息失败'
    };
  }
});

truck.post('/', jwtAuth(), async (ctx) => {
  const { name, driverId } = ctx.request.body;

  if (!name || !driverId) {
    ctx.status = 400;
    ctx.body = {
      msg: '车名和司机ID为必填项'
    };
    return;
  }

  try {
    const result = await db.search('INSERT INTO truck (TruckName, DriverId) VALUES (?, ?)', [name, driverId]);

    if (result.affectedRows > 0) {
      ctx.body = {
        msg: 'success'
      };
    } else {
      ctx.status = 500;
      ctx.body = {
        msg: '添加失败'
      };
    }
  } catch (error) {
    console.error('添加失败:', error);
    ctx.status = 500;
    ctx.body = {
      msg: '添加失败'
    };
  }
});

truck.delete('/:id', jwtAuth(), async (ctx) => {
  const userId = ctx.params.id;

  try {
    const result = await db.search('DELETE FROM truck WHERE id = ?', [userId]);

    if (result.affectedRows > 0) {
      ctx.body = {
        msg: 'success'
      };
    } else {
      ctx.status = 404;
      ctx.body = {
        msg: '车辆不存在'
      };
    }
  } catch (error) {
    console.error('删除车辆失败:', error);
    ctx.status = 500;
    ctx.body = {
      msg: '删除车辆失败'
    };
  }
})

module.exports = truck;