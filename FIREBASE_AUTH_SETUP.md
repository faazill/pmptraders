# Firebase Phone Authentication Setup Guide

## ⚠️ IMPORTANT: Complete these steps before OTP verification will work

### 1. Enable Phone Authentication in Firebase Console

1. **Go to [Firebase Console](https://console.firebase.google.com/)**
2. **Select your project** (`aquavalor-c8e59`)
3. **Navigate to Authentication** → **Sign-in method**
4. **Click on "Phone"** provider
5. **Enable it** by toggling the switch
6. **Save the changes**

### 2. Configure Authorized Domains (CRITICAL STEP)

1. **In Firebase Console** → **Authentication** → **Settings**
2. **Scroll to "Authorized domains"** section
3. **Add these domains:**
   - `localhost` (for local development)
   - `127.0.0.1` (for local development)
   - Your production domain (e.g., `yourdomain.com`)
4. **Click "Add domain"** for each one
5. **Save changes**

**⚠️ IMPORTANT:** This step is required for Phone Authentication to work properly. Without authorized domains, you'll get OAuth errors like "The current domain is not authorized for OAuth operations."

### 3. Configure reCAPTCHA for Web

1. **In Firebase Console** → **Authentication** → **Settings**
2. **Scroll to "reCAPTCHA Enterprise"** section (if available)
3. **Enable reCAPTCHA** if not already enabled
4. **For custom reCAPTCHA implementation:**
   - Go to [Google reCAPTCHA Admin](https://www.google.com/recaptcha/admin)
   - Create a new site
   - Choose reCAPTCHA v2 → "I'm not a robot" Checkbox
   - Add your domains (localhost, 127.0.0.1, production domain)
   - Copy the Site Key and Secret Key

### 4. Test the Setup

1. **Open your website** with the OTP verification page
2. **Enter a valid Indian mobile number** (10 digits starting with 6-9)
3. **Click "Send OTP"**
4. **Check if OTP is received** on the mobile number

### 5. Common Issues & Solutions

#### Issue: "The current domain is not authorized for OAuth operations"
- **Solution**: Add your domain (localhost, 127.0.0.1) to authorized domains in Firebase Console → Authentication → Settings → Authorized domains

#### Issue: "Phone authentication is not enabled"
- **Solution**: Enable Phone provider in Firebase Console (Step 1)

#### Issue: "reCAPTCHA verification failed"
- **Solution**: Add your domain to authorized domains (Step 2)

#### Issue: "Invalid phone number format"
- **Solution**: Ensure mobile number starts with 6-9 and is exactly 10 digits

#### Issue: "Too many requests"
- **Solution**: Wait a few minutes before trying again

#### Issue: "SMS quota exceeded"
- **Solution**: Firebase has daily SMS limits. Consider upgrading plan if needed.

### 6. Firebase Billing (Important)

⚠️ **Phone Authentication requires a paid Firebase plan:**
- **Free tier**: 10,000 SMS/month
- **Paid tier**: $0.01 per SMS after free quota

**To enable billing:**
1. **Go to Firebase Console** → **Usage and billing**
2. **Click "Modify plan"**
3. **Add a payment method**
4. **Select Blaze (pay-as-you-go) plan**

### 7. Security Rules (Recommended)

Add these Firebase Database rules for security:

```json
{
  "rules": {
    "prepaid_orders": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "cod_orders": {
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
}
```

### 8. Testing Checklist

- [ ] Phone Authentication enabled in Firebase Console
- [ ] Domain added to authorized domains
- [ ] Billing plan configured (if needed)
- [ ] Valid Indian mobile number format (10 digits, starts with 6-9)
- [ ] reCAPTCHA script loaded properly
- [ ] OTP received on mobile device
- [ ] Orders display after successful verification

### 9. Production Deployment

For production:
1. **Add your production domain** to authorized domains
2. **Configure proper security rules**
3. **Monitor usage and billing**
4. **Test with real mobile numbers**

---

## 🚀 Ready to Test?

Once you've completed the setup:
1. **Refresh your website**
2. **Try the OTP verification**
3. **Check browser console** for any errors
4. **Verify OTP is received** on mobile

If you encounter any issues, check the browser console for specific error messages and refer to the troubleshooting section above. 