const { Resend } = require("resend");

exports.handler = async (event) => {

  try {

    if (!process.env.RESEND_API_KEY) {

      return {
        statusCode: 500,
        body: "RESEND_API_KEY NOT FOUND",
      };
    }

    const resend = new Resend(
      process.env.RESEND_API_KEY
    );

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