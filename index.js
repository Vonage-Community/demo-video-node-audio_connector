'use strict';

require('dotenv').config();

const Koa = require('koa');
const Router = require('@koa/router');
const render = require('koa-ejs');
const path = require('path');
const serve = require('koa-static');
const websockify = require('koa-websocket');
const OpenTok = require("opentok");

const app = new Koa();
const socket = websockify(app);
const ws = new Router();
app.context.ws = ws;

const basicHttp = require('./routes/basic');
const symblTranscriptionHttp = require('./routes/symbl/transcription');

const opentok = new OpenTok(process.env.VONAGE_API_KEY, process.env.VONAGE_API_SECRET);
app.context.opentok = opentok;

const symblSdk = require('@symblai/symbl-js').sdk;
app.context.symblSdk = symblSdk;

const SymblProcessor = require('./symbl-processor');
app.context.symblProcessor = new SymblProcessor();

symblSdk.init({
  appId: process.env.SYMBL_APP_ID,
  appSecret: process.env.SYMBL_APP_SECRET,
  basePath: 'https://api.symbl.ai'
})
.then(() => console.log('Symbl.ai SDK Initialized.'))
.catch(err => console.error('Error in initialization.', err));

opentok.createSession({ mediaMode: "routed" }, function (err, session) {
  if (err) throw err;
	app.context.openTokSession = session;
});

app.use(serve('./public'));

app.use(async (ctx, next) => {
  try {
    await next()
  } catch(err) {
    console.log(err.status)
    ctx.status = err.status || 500;
    ctx.body = err.message;
  }
});

render(app, {
	root: path.join(__dirname, 'views'),
	layout: false,
	viewExt: 'html',
	cache: false,
	debug: true
});

app.use(basicHttp.routes()).use(basicHttp.allowedMethods());
app.ws.use(ws.routes()).use(ws.allowedMethods());

app.use(symblTranscriptionHttp.routes()).use(symblTranscriptionHttp.allowedMethods());


app.listen(3000, console.log('Listening on port 3000'));
