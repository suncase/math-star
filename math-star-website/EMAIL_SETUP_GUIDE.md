# Email Setup Guide for Math Star Website

This guide explains how to set up the email functionality for the Math Star website so that appointment bookings are sent to admin@math-star.org.

## Setting Up EmailJS

The website uses [EmailJS](https://www.emailjs.com/) to send emails directly from JavaScript without requiring a backend server. Follow these steps to set it up:

### 1. Create an EmailJS Account

1. Go to [EmailJS.com](https://www.emailjs.com/) and sign up for a free account
2. The free plan includes 200 emails per month, which should be sufficient for initial use

### 2. Connect Your Email Service

1. In the EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Select your preferred email provider (Gmail, Outlook, or custom SMTP)
4. Follow the authentication steps to connect your admin@math-star.org email account
5. Name your service "default_service" (or update the service name in the script.js file)

### 3. Create an Email Template

1. In the EmailJS dashboard, go to "Email Templates"
2. Click "Create New Template"
3. Name your template "template_booking"
4. Design your email template with the following variables:
   - `{{parent_name}}` - Parent's name
   - `{{student_name}}` - Student's name
   - `{{grade}}` - Student's grade
   - `{{email}}` - Parent's email
   - `{{phone}}` - Parent's phone
   - `{{appointment_date}}` - Scheduled date
   - `{{appointment_time}}` - Scheduled time
   - `{{message}}` - Booking summary

Example template:

```
Subject: New Assessment Booking: {{student_name}}

Dear Math Star Admin,

A new assessment has been scheduled through your website.

Details:
- Parent: {{parent_name}}
- Student: {{student_name}}
- Grade: {{grade}}
- Date: {{appointment_date}}
- Time: {{appointment_time}}

Contact Information:
- Email: {{email}}
- Phone: {{phone}}

Please confirm this appointment with the parent.

Regards,
Math Star Website
```

### 4. Get Your Public Key

1. In the EmailJS dashboard, go to "Account" > "API Keys"
2. Copy your "Public Key"

### 5. Update Your Website Code

1. Open the `index.html` file
2. Find the EmailJS initialization code:
   ```javascript
   emailjs.init("YOUR_PUBLIC_KEY");
   ```
3. Replace "YOUR_PUBLIC_KEY" with the public key you copied

## Testing the Email Functionality

1. Open your website locally
2. Fill out the contact form with test information
3. Go to the Schedule section and book an appointment
4. Click "Confirm Booking"
5. Check the admin@math-star.org inbox to verify the email was received

## Troubleshooting

- If emails aren't being sent, check the browser console for error messages
- Verify that your EmailJS account is active and has available email quota
- Ensure your email service (Gmail, etc.) isn't blocking the authentication

## Moving to Production

When you deploy your website to a live server:

1. Make sure to keep your EmailJS configuration updated
2. Consider upgrading your EmailJS plan if you expect more than 200 emails per month
3. Add CAPTCHA or other anti-spam measures to prevent abuse of the booking system
