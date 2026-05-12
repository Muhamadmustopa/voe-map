const { Resend } = require("resend");

exports.handler = async () => {

  try {

    if (!process.env.RESEND_API_KEY) {

      return {
        statusCode: 500,
        body: "RESEND_API_KEY NOT FOUND",
      };
    }

    return {
      statusCode: 200,
      body: "API KEY CONNECTED",
    };

  } catch (err) {

    return {
      statusCode: 500,
      body: err.toString(),
    };
  }
};