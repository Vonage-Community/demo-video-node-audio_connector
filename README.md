# Vonage Video Audio Connector Demo

## Overview

This is a demo of the Vonage Video API [Audio Connector](https://tokbox.com/developer/guides/audio-connector/) feature, using Symbl.ai's [Streaming API](https://docs.symbl.ai/docs/code-snippets-streaming-api#streaming-audio-in-real-time) to perform transcription.

## Pre-requisites

To run this demo, you will need:

- A [Vonage Video API account](https://tokbox.com/account/user/signup)
- A [Symbl.ai account](https://platform.symbl.ai/#/signup)
- [Node.js](https://nodejs.org/en) installed
- [Ngrok](https://ngrok.com/) installed

## Running the Demo Locally

1. Clone the repository

```
git clone https://github.com/Vonage-Community/demo-video-node-audio_connector.git
```

2. From within the main directory of the cloned rep, insstall the dependencies

```
npm install
```

3. Copy or rename the `.env-sample` file to `.env` and update the file with your Vonage Video and Symbl.ai credentials

4. Start up Ngrok

```
ngrok http 3000
```

5. Copy the Ngrok `Forwarding` URL and set this in the `.env` file as the value for `TUNNEL_DOMAIN` (do not include the scheme part `https://`)

6. In a separate console tab, start the Node application

```
node index.js
```

7. In your browser, navigate to `localhost:3000`

8. Select the Call Configuration Options for the call data that you want processed

9. Click on the 'Video call with Audio Processing' button

10. On the call screen, enter your name in the form field and click 'Join'

11. Share the 'Meeting Link' with other participants

12. Once all participants have joined, click on the 'Start Processing' button (there is normally a delay of a second or two before the processing starts)

13. To view the processed output of your video call, click on relevant links below the 'Processed Output' heading

