const Router = require('@koa/router');
const http = new Router();
const transcriptionController = require('../../controllers/symbl/transcription-controller');

http.post('/symbl-transcription-call', transcriptionController.postSymblTranscriptionCall);

http.post('/transcribe', transcriptionController.postSymblTranscription);

http.get('/symbl-transcription', transcriptionController.getSymblTranscription);

http.get('/symbl-action-items', transcriptionController.getSymblActionItems);

http.get('/symbl-questions', transcriptionController.getSymblQuestions);

http.get('/symbl-topics', transcriptionController.getSymblTopics);

module.exports = http;
