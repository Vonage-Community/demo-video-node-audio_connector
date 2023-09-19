exports.postSymblTranscriptionCall = (ctx) => {
	let otSession = ctx.openTokSession;
	let token = otSession.generateToken();
	let meetingLinkURI = `http://${process.env.TUNNEL_DOMAIN}/join-call`;
	let symblProcessor = ctx.symblProcessor;
	let configOptions = ctx.request.body.config;
	let config = [];
	if(typeof configOptions == "string") { config.push(configOptions) }
	if(Array.isArray(configOptions)) { config.push(...configOptions) }
	// console.log(config);
	symblProcessor.setConfig(config);

  return ctx.render('symbl-transcription-call', {
		apiKey: otSession.ot.apiKey,
    sessionId: otSession.sessionId,
    token: token,
		meetingLink: meetingLinkURI,
		config: config
	});
};

exports.postSymblTranscription = async (ctx, next) => {
	let opentok = ctx.opentok;
	let otSession = ctx.openTokSession;
	let token = otSession.generateToken();
	let socketURI = `wss://${process.env.TUNNEL_DOMAIN}/socket`;
	let symblProcessor = ctx.symblProcessor;
	let symblSdk = ctx.symblSdk;
	let ws = ctx.ws;
	let insightTypes = symblProcessor.setInsightTypes();
	let handlers = symblProcessor.sethandlers();
	console.log(insightTypes);
	console.log(handlers);

	opentok.listStreams(otSession.sessionId, function(error, streams) {
		if (error) {
			console.log('Error:', error.message);
		} else {
			console.log(streams);
			streams.forEach(async stream => {
				let stream_id = stream.id;
				let stream_name = stream.name;
				let symblConnection;
				let socketUriForStream = socketURI + '/' + stream_id;

				console.log("connecting to symbl for: ", stream_id);
				try {
					symblConnection = await symblSdk.startRealtimeRequest({
						id: stream_id,
						speaker: {
							name: stream_name
						},
						insightTypes: insightTypes,
						config: {
							meetingTitle: 'My Test Meeting',
							confidenceThreshold: 0.9,
							timezoneOffset: 0, // Offset in minutes from UTC
							languageCode: 'en-GB',
							sampleRateHertz: 16000,
						},
						handlers: handlers
					});
					console.log("Connected to Symbl for: ", symblConnection);

				} catch (e) {
					console.log("Symbl connect error");
					console.error(e);
				}

				ws.get(`/socket/${stream_id}`, ctx => {
					let connection = symblConnection;
					console.log(connection);
					ctx.websocket.on('message', function(message) {

						try {
							const event = JSON.parse(message);
							if (event.event === 'websocket:connected') {
								console.log(event);
							}
						} catch(err) {
							if (connection) {
								connection.sendAudio(message);
								return;
							}
						}

					});

				});

				opentok.websocketConnect(otSession.sessionId, token, socketUriForStream, {streams: [stream_id]}, function(error, socket) {
					if (error) {
						console.log('Error:', error.message);
					} else {
						console.log('OpenTok Socket websocket connected');
					}
				});

			});
		}
	});

	ctx.status = 200;
};

exports.getSymblTranscription = (ctx) => {
	let symblProcessor = ctx.symblProcessor;
	return ctx.render('symbl-transcriptions', {
		transcriptions: symblProcessor.getTranscriptions()
	}
 );
};

exports.getSymblActionItems = (ctx) => {
	let symblProcessor = ctx.symblProcessor;
	return ctx.render('symbl-output', {
		heading: 'Action Items',
		list: symblProcessor.getActionItems()
	}
 );
};

exports.getSymblQuestions = (ctx) => {
	let symblProcessor = ctx.symblProcessor;
	return ctx.render('symbl-output', {
		heading: 'Questions',
		list: symblProcessor.getQuestions()
	}
 );
};

exports.getSymblTopics = (ctx) => {
	let symblProcessor = ctx.symblProcessor;
	return ctx.render('symbl-output', {
		heading: 'Topics',
		list: symblProcessor.getTopics()
	}
 );
};
