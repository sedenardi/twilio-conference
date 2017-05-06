const express = require('express');
const VoiceResponse = require('twilio').twiml.VoiceResponse;
const urlencoded = require('body-parser').urlencoded;

const conferences = require('./conferences');

const app = express();
app.use(urlencoded({extended: false}));
app.use((request, response, next) => {
  response.type('text/xml');
  next();
})

app.post('/voice', (request, response) => {
  const twiml = new VoiceResponse();
  twiml.say('Welcome to the conference system.', { voice: 'alice' });
  twiml.redirect('/gather');
  response.send(twiml.toString());
});

app.post('/gather', (request, response) => {
  const twiml = new VoiceResponse();
  const gather = twiml.gather({
    timeout: '10',
    finishOnKey: '#',
    action: '/join'
  });
  gather.say('Please enter your access code.', { voice: 'alice' });
  twiml.redirect('/gather');
  response.send(twiml.toString());
});

app.post('/join', (request, response) => {
  const twiml = new VoiceResponse();
  const conference = conferences.getConferenceByCode(request.body.Digits);
  if (conference) {
    twiml.say('You are now entering the conference.', { voice: 'alice' });
    const dial = twiml.dial();
    dial.conference(conference);
  } else {
    twiml.say('The access code you entered is incorrect.', { voice: 'alice' });
    twiml.redirect('/gather');
  }
  response.send(twiml.toString());
});

console.log('Conference system app HTTP server running at http://127.0.0.1:3000');
app.listen(3000);
