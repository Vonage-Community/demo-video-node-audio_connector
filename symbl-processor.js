class SymblProcessor {
	constructor() {
		this.messages = [];
		this.insights = [];
		this.topics = [];
		this.config = {
			transcription: false,
			actionItems: false,
			questions: false,
			topics: false
		};
	}

	setConfig(config) {
		config.forEach(option => this.config[option] = true);
	}

	sethandlers() {
		let handlers = {};
		if (this.config.transcription) { handlers.onMessageResponse = this.onMessageResponseHandler; }
		if (this.config.actionItems || this.config.questions) { handlers.onInsightResponse = this.onInsightResponseHandler; }
		if (this.config.topics) { handlers.onTopicResponse = this.onTopicResponseHandler; }
		return handlers;
	}

	setInsightTypes() {
		let insightTypes = [];
		if (this.config.actionItems) { insightTypes.push('action_item'); }
		if (this.config.questions) { insightTypes.push('question'); }
		return insightTypes;
	}

	getTranscriptions() {
		return this.messages.map(message => ({id: message[0].from.id, name: message[0].from.name, transcription: message[0].payload.content}));
	}

	getActionItems() {
		let actionItems = this.insights.filter(insight => insight[0].type == 'action_item');
		return actionItems.map(item => item[0].payload.content);
	}

	getQuestions() {
		let questions = this.insights.filter(insight => insight[0].type == 'question');
		return questions.map(question => question[0].payload.content);
	}

	getTopics() {
		return this.topics.map(topic => topic[0].phrases);
	}

	onMessageResponseHandler = (data) => {
		this.messages.push(data);
	}

	onInsightResponseHandler = (data) => {
		this.insights.push(data);
	}

	onTopicResponseHandler = (data) => {
		this.topics.push(data);
	}
}

module.exports = SymblProcessor;
