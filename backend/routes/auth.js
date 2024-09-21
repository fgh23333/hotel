const router = require("koa-router")
const auth = new router
const db = require("../middleware/sql")
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const jwtAuth = require("../middleware/jwtAuth");
const { PERMISSION_SECRET } = process.env;

auth.prefix('/auth')

auth.post('/', async (ctx) => {
  const { username, password } = ctx.request.body;

  // 简单的验证逻辑（实际使用中请进行更复杂的验证）
  const user = await db.search('SELECT * FROM auth WHERE username = ?', [username]);

  if (user.length === 0) {
    ctx.status = 401;
    ctx.body = { msg: 'Invalid username or password' };
    return;
  }

  if (user && bcrypt.compareSync(password, user[0].password)) {
    const token = jwt.sign({ username: user[0].username }, PERMISSION_SECRET, { expiresIn: '24h' });
    ctx.body = { token };
  } else {
    ctx.status = 401;
    ctx.body = { msg: 'Invalid username or password' };
  }
})

auth.post('/verify-token', jwtAuth(), async (ctx) => {
  const username = ctx.state.username;

  // 根据用户名从数据库中获取用户信息
  const user = await db.search('SELECT * FROM auth WHERE username = ?', [username]);

  if (user.length === 0) {
    ctx.status = 404;
    ctx.body = { msg: 'User not found' };
    return;
  }

  ctx.body = { user: user[0] };
});


module.exports = auth