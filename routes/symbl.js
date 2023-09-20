const Router = require('@koa/router');
const http = new Router();
const symblController = require('../controllers/symbl-controller');

http.post('/symbl-transcription-call', symblController.postSymblCall);

http.post('/transcribe', symblController.postSymblProcessing);

http.get('/symbl-transcription', symblController.getSymblTranscription);

http.get('/symbl-action-items', symblController.getSymblActionItems);

http.get('/symbl-questions', symblController.getSymblQuestions);

http.get('/symbl-topics', symblController.getSymblTopics);

module.exports = http;
