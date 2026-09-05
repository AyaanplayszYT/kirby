const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/kirby-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/kirby-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/kirby-ping - Check bot latency
/kirby-catfact - Get a cat fact
/kirby-joke - Get a random joke
/kirby-quote - Get a random quote
/kirby-advice - Get a random advice
/kirby-dogfact - Get a random dog fact`
  });
});

app.command("/kirby-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});

app.command("/kirby-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});

app.command("/kirby-quote", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://api.quotable.io/random");

    await respond({
      text: `"${response.data.content}"\n- ${response.data.author}`
    });
  } catch {
    await respond({ text: "Failed to fetch a quote." });
  }
});
    
app.command("/kirby-advice", async ({ ack, respond }) => {
    await ack();

    try {
        const response = await axios.get("https://api.adviceslip.com/advice");

        await respond({
            text: `advice: "$response.data.slip.advice"`
        });
    } catch {
        await respond({ text: "Failed to fetch advice. No advice for u :(" });
    }
});

app.command("/kirby-dogfact", async ({ ack, respond }) => {
    await ack();

    try {
        const response = await axios.get("https://dogapi.dog/api/v2/facts");

        await respond({
            text: `Dog Fact:\n${response.data.data[0].attributes.body}`
        });
    } catch {
        await respond({ text: "Failed to fetch a dog fact :(" });
    }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();