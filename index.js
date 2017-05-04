const Koa = require('koa');
const app = new Koa();

const xmlRouter = require('koa-router')();
const conferences = require('./conferences');

xmlRouter.use((ctx, next) => {
  ctx.type = 'text/xml';
  next();
});

xmlRouter.get('/Welcome', (ctx) => {
  ctx.body = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Say voice="alice">Welcome to the conferencing system.</Say>
      <Redirect method="GET">/GatherAccessCode</Redirect>
    </Response>`;
});

xmlRouter.get('/GatherAccessCode', (ctx) => {
  ctx.body = `<?xml version="1.0" encoding="UTF-8"?>
    <Response>
      <Gather
        timeout="10"
        finishOnKey="#"
        action="/JoinConference"
        method="GET">
        <Say voice="alice">Please enter your access code.</Say>
      </Gather>
      <Redirect method="GET">/GatherAccessCode</Redirect>
    </Response>`;
});

xmlRouter.get('/JoinConference', (ctx) => {
  const conference = conferences.getConferenceByCode(ctx.query.Digits);
  if (conference) {
    ctx.body = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="alice">You are now entering the conference.</Say>
        <Dial>
          <Conference>
            ${conference}
          </Conference>
        </Dial>
      </Response>`;
  } else {
    ctx.body = `<?xml version="1.0" encoding="UTF-8"?>
      <Response>
        <Say voice="alice">The access code you entered is incorrect.</Say>
        <Redirect method="GET">/GatherAccessCode</Redirect>
      </Response>`;
  }
});

app.use(xmlRouter.routes()).use(xmlRouter.allowedMethods());

app.listen(3003);
