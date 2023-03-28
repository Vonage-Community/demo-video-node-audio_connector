exports.getSymblTranscriptionCall = (ctx) => {
	let otSession = ctx.openTokSession;
	let token = otSession.generateToken();
	let meetingLinkURI = `http://${process.env.TUNNEL_DOMAIN}/join-call`;

  return ctx.render('symbl-transcription-call', {
		apiKey: otSession.ot.apiKey,
    sessionId: otSession.sessionId,
    token: token,
		meetingLink: meetingLinkURI
	});
};

exports.getSymblTranscription = (ctx) => {
	let transcriptions = ctx.transcriptions;

	return ctx.render('symbl-transcription', {
		transcriptions: transcriptions
	}
 );
};

exports.postSymblTranscription = async (ctx, next) => {
	let opentok = ctx.opentok;
	let otSession = ctx.openTokSession;
	let token = otSession.generateToken();
	let socketURI = `wss://${process.env.TUNNEL_DOMAIN}/socket`;
	let transcriptions = ctx.transcriptions;
	let symblSdk = ctx.symblSdk;
	let ws = ctx.ws;

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
						insightTypes: ['action_item', 'question'],
						config: {
							meetingTitle: 'My Test Meeting',
							confidenceThreshold: 0.9,
							timezoneOffset: 0, // Offset in minutes from UTC
							languageCode: 'en-GB',
							sampleRateHertz: 16000,
						},
						handlers: {
							onSpeechDetected: (data) => {
								if (data && data.isFinal) {
									const {user, punctuated} = data;
									console.log('Live: ', punctuated.transcript);
									transcriptions.push({id: user.id, name: user.name, transcription: punctuated.transcript});
								}
							}
						}
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
