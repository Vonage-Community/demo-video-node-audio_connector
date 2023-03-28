exports.getRoot = (ctx) => {
  return ctx.render('index');
};

exports.joinCall = (ctx) => {
	let otSession = ctx.openTokSession;
	let token = otSession.generateToken();

  return ctx.render('join-call', {
		apiKey: otSession.ot.apiKey,
    sessionId: otSession.sessionId,
    token: token
	});
};
