const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
require('dotenv').config();

const cors = require('@koa/cors')

const auth = require('./routes/auth')
const product = require('./routes/product')
const user = require('./routes/user')
const order = require('./routes/order')
const truck = require('./routes/truck')
const employee = require('./routes/employee')
const goodsList = require('./routes/goodsList')

app.use(cors())
// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'ejs'
}))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(user.routes(), user.allowedMethods())
app.use(auth.routes(), auth.allowedMethods())
app.use(order.routes(), order.allowedMethods())
app.use(product.routes(), product.allowedMethods())
app.use(truck.routes(), truck.allowedMethods())
app.use(employee.routes(), employee.allowedMethods())
app.use(goodsList.routes(), goodsList.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
