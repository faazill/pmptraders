# Email Setup Guide for Contact Form

This guide will help you set up direct email sending to `taskaelite@gmail.com` using free services.

## Option 1: Formspree (Recommended - Easiest)

1. **Go to [Formspree.io](https://formspree.io)**
2. **Sign up for a free account**
3. **Create a new form:**
   - Click "New Form"
   - Name it "Aquavalor Contact Form"
   - Set recipient email to: `taskaelite@gmail.com`
4. **Get your form ID:**
   - Copy the form ID (looks like: `xrgjqjqj`)
5. **Update the code:**
   - Open `script.js`
   - Find line: `tempForm.action = 'https://formspree.io/f/YOUR_FORMSPREE_ID';`
   - Replace `YOUR_FORMSPREE_ID` with your actual form ID

## Option 2: EmailJS (Alternative)

1. **Go to [EmailJS.com](https://emailjs.com)**
2. **Sign up for a free account**
3. **Add Email Service:**
   - Go to Email Services
   - Add Gmail service
   - Connect your Gmail account
4. **Create Email Template:**
   - Go to Email Templates
   - Create new template
   - Use this template:
   ```
   Subject: New Contact Form Submission: {{subject}}
   
   Name: {{from_name}}
   Email: {{from_email}}
   Subject: {{subject}}
   Message: {{message}}
   
   ---
   This message was sent from the Aquavalor contact form.
   ```
5. **Get your credentials:**
   - Service ID (from Email Services)
   - Template ID (from Email Templates)
   - Public Key (from Account > API Keys)
6. **Update the code:**
   - In `script.js`, replace:
     - `YOUR_PUBLIC_KEY` with your EmailJS public key
     - `YOUR_SERVICE_ID` with your service ID
     - `YOUR_TEMPLATE_ID` with your template ID

## Testing

After setup:
1. Fill out the contact form on your website
2. Submit the form
3. Check `taskaelite@gmail.com` for the email
4. You should receive the contact form submission

## Features

- ✅ Direct email sending (no email client required)
- ✅ Form validation
- ✅ Loading states
- ✅ Success/error notifications
- ✅ Automatic form reset
- ✅ Mobile responsive
- ✅ Free service (up to 50 emails/month with Formspree)

## Troubleshooting

- **Emails not received:** Check spam folder
- **Form not submitting:** Check browser console for errors
- **Service limits:** Free plans have monthly limits
- **CORS issues:** Make sure you're using HTTPS in production

## Security Notes

- Formspree and EmailJS are trusted services
- Your email address is secure
- No sensitive data is stored on your server
- All communication is encrypted 