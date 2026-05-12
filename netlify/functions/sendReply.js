const { Resend } = require("resend");

exports.handler = async (event) => {

  try {

    const body = JSON.parse(event.body);

    const {
      to,
      mood,
      note,
      reply,
    } = body;

    const resend = new Resend(
      process.env.RESEND_API_KEY
    );

    const data = await resend.emails.send({

      from:
        "Mind Share <onboarding@resend.dev>",

      to: [to],

      subject:
        "HRDGA Reply - Mind Share MAP",

      html: `
        <div style="font-family:sans-serif">
          <h2>💬 HRDGA Reply</h2>

          <p><b>Mood:</b> ${mood}</p>

          <p><b>Cerita:</b><br/>
          ${note}</p>

          <hr/>

          <p><b>Balasan HRDGA:</b></p>

          <p>${reply}</p>
        </div>
      `,
    });

    console.log(data);

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };

  } catch (err) {

    console.log(err);

    return {
      statusCode: 500,
      body: JSON.stringify(err),
    };
  }
};