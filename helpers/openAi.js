const OpenAI = require("openai");

let openaiClient;

if (process.env.NODE_ENV === "test") {
  openaiClient = {
    chat: {
      completions: {
        create: async () => {
          return {
            choices: [
              {
                message: {
                  content:
                    '{"items":[],"vatAmount":0,"serviceChargeAmt":0,"totalPayment":0}',
                },
              },
            ],
          };
        },
      },
    },
  };
} else {
  openaiClient = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

module.exports = openaiClient;
