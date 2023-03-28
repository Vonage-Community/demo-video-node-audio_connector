const Router = require('@koa/router');
const http = new Router();
const transcriptionController = require('../../controllers/symbl/transcription-controller');

http.get('/symbl-transcription-call', transcriptionController.getSymblTranscriptionCall);

http.post('/transcribe', transcriptionController.postSymblTranscription);

http.get('/symbl-transcription', transcriptionController.getSymblTranscription);

module.exports = http;
