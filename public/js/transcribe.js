document.addEventListener("DOMContentLoaded", function() {
	const button = document.getElementById('transcribe-btn');

	button.addEventListener('click', async _ => {
		try {
			const response = await fetch('/transcribe', {
				method: 'post'
			});
			console.log('Processing requested', response);
		} catch(err) {
			console.error(`Error: ${err}`);
		}
	});
});

