const jwt = require('jsonwebtoken');
const { PERMISSION_SECRET } = process.env;

// 封装通用的 JWT 鉴权中间件，仅验证 token 中的用户名
const jwtAuth = () => {
  return async (ctx, next) => {
    const token = ctx.headers['blade-auth'];

    if (!token) {
      ctx.status = 401;
      ctx.body = { msg: 'Authorization token missing' };
      return;
    }

    try {
      // 解码并验证 token
      const decoded = jwt.verify(token, PERMISSION_SECRET);

      // 验证 token 中是否包含用户名
      if (!decoded.username) {
        ctx.status = 401;
        ctx.body = { msg: 'Invalid token: username missing' };
        return;
      }

      // 在上下文中保存用户名信息，以便后续使用
      ctx.state.username = decoded.username;

      await next();  // 继续处理请求
    } catch (err) {
      console.error('JWT verification failed:', err);
      ctx.status = 401;
      ctx.body = { msg: 'Invalid or expired token' };
    }
  };
};

module.exports = jwtAuth;
