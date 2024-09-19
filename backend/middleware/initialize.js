const bcrypt = require('bcrypt');
const mysql = require('mysql');

// 创建数据库连接
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin123', // 修改为你的 MySQL 密码
  database: 'delivery'
});

db.connect((err) => {
  if (err) {
    console.error('数据库连接失败:', err);
    return;
  }
  console.log('已连接数据库');
});

// 需要初始化的用户列表
const users = [
  { username: 'admin', password: 'admin123' }
];

// 盐的轮数（bcrypt）
const saltRounds = 10;

async function initUsers() {
  for (const user of users) {
    // 生成加密密码
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);

    // 将用户插入数据库
    await new Promise((resolve, reject) => {
      db.query(
        'INSERT INTO auth (username, password) VALUES (?, ?)',
        [user.username, hashedPassword],
        (err, result) => {
          if (err) {
            console.error('插入用户失败:', err);
            reject(err);
          } else {
            console.log(`用户 ${user.username} 已插入数据库`);
            resolve(result);
          }
        }
      );
    });
  }

  // 关闭数据库连接
  db.end();
}

initUsers()
  .then(() => {
    console.log('用户初始化完成');
  })
  .catch((err) => {
    console.error('初始化失败:', err);
  });
