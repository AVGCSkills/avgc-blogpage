// actions/sendEmail.js
"use server";

import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(prevState, formData) {
  const firstName = formData.get("firstName");
  const lastName = formData.get("lastName");
  const email = formData.get("email");
  const subject = formData.get("subject");
  const message = formData.get("message");

  try {
    const { data, error } = await resend.emails.send({
      // This must be a verified domain in your Resend account
      from: "AVGC Contact Form <onboarding@resend.dev>",
      to: ["avgcweb@gmail.com"],
      subject: `New Inquiry: ${subject}`,
      // You can use standard HTML here to format the email you receive
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
      reply_to: email, // This allows you to hit "Reply" in your inbox and reply directly to the user
    });

    if (error) {
      return { success: false, message: error.message };
    }

    return {
      success: true,
      message: "Your message has been sent successfully!",
    };
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
}
