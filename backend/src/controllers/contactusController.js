const Query = require('../models/contactusModel');
const nodemailer = require('nodemailer');

require('dotenv').config({ 
  path: require('path').join(__dirname, '..', 'utils', '.env') 
});

// Create transporter for sending emails
const createTransporter = () => {
  return nodemailer.createTransporter({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
};

// Send confirmation email to user
const sendConfirmationEmail = async (userEmail, userName, queryData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Query Received - NutriConnect Support',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #28B463; color: white; padding: 20px; text-align: center;">
            <h1>NutriConnect Support</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Hello ${userName},</h2>
            <p>Thank you for reaching out to us! We have received your query and will get back to you within 24-48 hours.</p>

            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Your Query Details:</h3>
              <p><strong>Name:</strong> ${userName}</p>
              <p><strong>Email:</strong> ${userEmail}</p>
              <p><strong>Role:</strong> ${queryData.role}</p>
              <p><strong>Query:</strong> ${queryData.query}</p>
              <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
            </div>

            <p>If you have any additional information or urgent concerns, please reply to this email.</p>

            <p>Best regards,<br>The NutriConnect Team</p>
          </div>
          <div style="background-color: #28B463; color: white; padding: 10px; text-align: center;">
            <p>Contact us: nutriconnect6@gmail.com | +91 70757 83143</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    // Don't throw error - query should still be saved even if email fails
  }
};

// Send notification email to admin
const sendAdminNotification = async (queryData) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, // Send to admin email
      subject: 'New Query Received - NutriConnect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #dc3545; color: white; padding: 20px; text-align: center;">
            <h1>New Query Alert</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>New query received from ${queryData.name}</h2>

            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <h3>Query Details:</h3>
              <p><strong>Name:</strong> ${queryData.name}</p>
              <p><strong>Email:</strong> ${queryData.email}</p>
              <p><strong>Role:</strong> ${queryData.role}</p>
              <p><strong>Query:</strong> ${queryData.query}</p>
              <p><strong>Submitted:</strong> ${new Date(queryData.created_at).toLocaleString()}</p>
            </div>

            <p>Please log in to the admin panel to respond to this query.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Admin notification email sent');
  } catch (error) {
    console.error('Error sending admin notification:', error);
  }
};

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

    // Send confirmation email to user
    await sendConfirmationEmail(email, name, newQuery);

    // Send notification email to admin
    await sendAdminNotification(newQuery);

    res.status(200).json({
      success: true,
      message: 'Query submitted successfully. Check your email for confirmation.',
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

// Send reply email to user
const sendReplyEmail = async (userEmail, userName, userQuery, adminReply) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Response to Your Query - NutriConnect',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #28B463; color: white; padding: 20px; text-align: center;">
            <h1>NutriConnect Support</h1>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9;">
            <h2>Hello ${userName},</h2>
            <p>Thank you for your patience. We have reviewed your query and here is our response:</p>

            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #28B463;">
              <h3>Your Original Query:</h3>
              <p style="font-style: italic; color: #666;">"${userQuery}"</p>
            </div>

            <div style="background-color: white; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
              <h3>Our Response:</h3>
              <p>${adminReply}</p>
            </div>

            <p>If you have any further questions or need additional clarification, please don't hesitate to reply to this email.</p>

            <p>Best regards,<br>The NutriConnect Team</p>
          </div>
          <div style="background-color: #28B463; color: white; padding: 10px; text-align: center;">
            <p>Contact us: nutriconnect6@gmail.com | +91 70757 83143</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Reply email sent to:', userEmail);
  } catch (error) {
    console.error('Error sending reply email:', error);
    throw error; // Throw error for reply function to handle
  }
};

exports.submitReply = async (req, res) => {
  const { admin_reply } = req.body;
  const { id } = req.params;

  console.log('Received reply request for query ID:', id, 'with reply:', admin_reply);

  if (!admin_reply) {
    console.error('Missing admin reply');
    return res.status(400).json({ success: false, message: 'Reply is required.' });
  }

  try {
    console.log('Attempting to update query with ID:', id);
    const updatedQuery = await Query.findByIdAndUpdate(
      id,
      {
        admin_reply,
        replied_at: new Date(),
        status: 'replied',
      },
      { new: true, runValidators: true }
    );

    if (!updatedQuery) {
      console.error('Query not found:', id);
      return res.status(404).json({ success: false, message: 'Query not found.' });
    }

    console.log('Query updated successfully:', updatedQuery);

    // Send reply email to user
    try {
      await sendReplyEmail(
        updatedQuery.email,
        updatedQuery.name,
        updatedQuery.query,
        admin_reply
      );
    } catch (emailError) {
      console.error('Failed to send reply email, but query was updated:', emailError);
      // Continue with success response even if email fails
    }

    res.status(200).json({
      success: true,
      message: 'Reply submitted successfully and email sent to user',
      data: updatedQuery,
    });
  } catch (err) {
    console.error('Error processing reply:', err.stack);
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Failed to submit reply.', error: err.message });
  }
};