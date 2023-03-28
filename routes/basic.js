const Router = require('@koa/router');
const http = new Router();

const basicController = require('../controllers/basic-controller');

http.get('/', basicController.getRoot);

http.get('/join-call', basicController.joinCall);

module.exports = http;
