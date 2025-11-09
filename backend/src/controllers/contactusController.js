const Query = require('../models/contactusModel');
const nodemailer = require('nodemailer');

// Create transporter for Gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address
    pass: process.env.EMAIL_PASS  // Your Gmail app password
  }
});

exports.submitContact = async (req, res) => {
  const { name, email, role, query } = req.body;
  console.log('Received contact form data:', { name, email, role, query });

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Valid email is required.' });
  }

  try {
    const newQuery = new Query({
      name,
      email,
      role,
      query,
    });
    await newQuery.save();
    console.log('Query saved successfully:', newQuery);

    // Send confirmation email to the user
    const confirmationHtml = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #28B463; color: white; padding: 20px; text-align: center;">
        <h1>NutriConnect Support</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2>Hello ${name},</h2>
        <p>Thank you for reaching out to us! We have received your query and will get back to you within 24-48 hours.</p>

        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3>Your Query Details:</h3>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Role:</strong> ${role}</p>
          <p><strong>Query:</strong> ${query}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        </div>

        <p>If you have any additional information or urgent concerns, please reply to this email.</p>

        <p>Best regards,<br>The NutriConnect Team</p>
      </div>
      <div style="background-color: #28B463; color: white; padding: 10px; text-align: center;">
        <p>Contact us: nutriconnect6@gmail.com | +91 70757 83143</p>
      </div>
    </div>`;

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Query Received - NutriConnect Support',
        html: confirmationHtml
      });
      console.log('Confirmation email sent successfully to:', email);
    } catch (emailErr) {
      console.error('Error sending confirmation email:', emailErr);
      // Don't fail the request if email fails, just log it
    }

    res.status(200).json({
      success: true,
      message: 'Query submitted successfully. You will receive a confirmation email shortly.',
      id: newQuery._id
    });
  } catch (err) {
    console.error('Error saving query:', err);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
  }
};

exports.replyToQuery = async (req, res) => {
  const { queryId, replyMessage } = req.body;

  if (!queryId || !replyMessage) {
    return res.status(400).json({ success: false, message: 'Query ID and reply message are required.' });
  }

  try {
    const query = await Query.findById(queryId);
    if (!query) {
      return res.status(404).json({ success: false, message: 'Query not found.' });
    }

    // Update the query
    query.admin_reply = replyMessage;
    query.replied_at = new Date();
    query.status = 'replied';
    await query.save();

    // Send email to the user
    const htmlTemplate = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #28B463; color: white; padding: 20px; text-align: center;">
        <h1>NutriConnect Support</h1>
      </div>
      <div style="padding: 20px; background-color: #f9f9f9;">
        <h2>Hello ${query.name},</h2>
        <p>Thank you for your patience. We have reviewed your query and here is our response:</p>

        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28B463;">
          <h3>Your Original Query:</h3>
          <p style="font-style: italic; color: #666;">"${query.query}"</p>
        </div>

        <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <h3>Our Response:</h3>
          <p>${replyMessage}</p>
        </div>

        <p>If you have any further questions or need additional clarification, please don't hesitate to reply to this email.</p>

        <p>Best regards,<br>The NutriConnect Team</p>
      </div>
      <div style="background-color: #28B463; color: white; padding: 10px; text-align: center;">
        <p>Contact us: nutriconnect6@gmail.com | +91 70757 83143</p>
      </div>
    </div>`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: query.email,
      subject: 'Reply to your query - NutriConnect Support',
      html: htmlTemplate
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: 'Reply sent successfully.' });
  } catch (err) {
    console.error('Error sending reply:', err);
    res.status(500).json({ success: false, message: 'Failed to send reply.', error: err.message });
  }
};

exports.getAllQueries = async (req, res) => {
  console.log('Received GET request for /queries-list');
  try {
    console.log('Attempting to query database for all queries...');
    const queries = await Query.find({}).sort({ created_at: -1 });
    console.log('Queries fetched successfully:', queries.length);

    // Transform the data to match frontend expectations
    const transformedQueries = queries.map(query => ({
      _id: query._id,
      name: query.name,
      email: query.email,
      role: query.role.toLowerCase().replace(' ', ''),
      query: query.query,
      status: query.status,
      admin_reply: query.admin_reply,
      replied_at: query.replied_at,
      created_at: query.created_at
    }));

    console.log('Query details:');
    if (transformedQueries.length === 0) {
      console.log('No queries found.');
    } else {
      transformedQueries.forEach((query, index) => {
        console.log(`Query ${index + 1}:`);
        console.log('  ID:', query._id);
        console.log('  Name:', query.name);
        console.log('  Email:', query.email);
        console.log('  Role:', query.role);
        console.log('  Query:', query.query);
        console.log('  Status:', query.status);
        console.log('  Created At:', query.created_at);
        if (query.admin_reply) {
          console.log('  Admin Reply:', query.admin_reply);
          console.log('  Replied At:', query.replied_at);
        }
        console.log('---');
      });
    }
    res.status(200).json({ success: true, data: transformedQueries });
  } catch (err) {
    console.error('Error fetching queries:', err.stack);
    res.status(500).json({ success: false, message: 'Failed to fetch queries.', error: err.message });
  }
};



