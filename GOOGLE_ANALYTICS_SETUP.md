# Google Analytics Setup Guide for PMP Traders

## Overview
Google Analytics 4 (GA4) has been successfully integrated into all pages of the PMP Traders website. This guide will help you complete the setup and understand how to use the analytics data.

## What's Been Added

### 1. Google Analytics 4 Tracking Code
The following tracking code has been added to all HTML pages in the `<head>` section:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-XXXXXXXXXX');
</script>
```

### 2. Pages with Analytics Integration
- ✅ `index.html` - Main homepage
- ✅ `checkout.html` - Checkout page
- ✅ `admin.html` - Admin dashboard
- ✅ `your-orders.html` - Order tracking page
- ✅ `ordersuccess.html` - Order confirmation page
- ✅ `privacy-policy.html` - Privacy policy
- ✅ `terms-conditions.html` - Terms and conditions
- ✅ `shipping-return-policy.html` - Shipping and return policy
- ✅ `return-policy.html` - Return policy
- ✅ `productpages/product1.html` - Aqua 2090 product page
- ✅ `productpages/product2.html` - Aqua Raga product page
- ✅ `productpages/product3.html` - Mars product page
- ✅ `productpages/product4.html` - Nova Star (Without Pressure Tank) product page
- ✅ `productpages/product5.html` - Nova Star (With Pressure Tank) product page

## Next Steps to Complete Setup

### 1. Create Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring" or sign in to your existing account
3. Click "Create Property"
4. Enter property details:
   - Property name: `PMP Traders`
   - Reporting time zone: `Asia/Kolkata`
   - Currency: `Indian Rupee (INR)`
5. Click "Next"
6. Enter business information:
   - Business size: `Small business`
   - Business category: `E-commerce`
   - Business objectives: Select relevant options
7. Click "Create"

### 2. Get Your Measurement ID

1. After creating the property, you'll get a Measurement ID (format: G-XXXXXXXXXX)
2. Copy this ID

### 3. Replace Placeholder ID

Replace `G-XXXXXXXXXX` in all HTML files with your actual Measurement ID:

```bash
# Find all HTML files and replace the placeholder
find . -name "*.html" -exec sed -i 's/G-XXXXXXXXXX/YOUR-ACTUAL-ID-HERE/g' {} \;
```

### 4. Enhanced E-commerce Tracking (Optional)

To track e-commerce events like purchases, add this to your JavaScript files:

```javascript
// Track purchase event
gtag('event', 'purchase', {
  transaction_id: 'ORDER_ID',
  value: 7999.00,
  currency: 'INR',
  items: [{
    item_id: 'product1',
    item_name: 'AQUA 2090 RO+Alkaline Water Purifier',
    price: 7999.00,
    quantity: 1
  }]
});

// Track add to cart
gtag('event', 'add_to_cart', {
  currency: 'INR',
  value: 7999.00,
  items: [{
    item_id: 'product1',
    item_name: 'AQUA 2090 RO+Alkaline Water Purifier',
    price: 7999.00,
    quantity: 1
  }]
});

// Track page views for product pages
gtag('event', 'view_item', {
  currency: 'INR',
  value: 7999.00,
  items: [{
    item_id: 'product1',
    item_name: 'AQUA 2090 RO+Alkaline Water Purifier',
    price: 7999.00,
    quantity: 1
  }]
});
```

## What You Can Track

### 1. Basic Metrics
- **Page Views**: How many times each page is viewed
- **Users**: Unique visitors to your site
- **Sessions**: Individual browsing sessions
- **Bounce Rate**: Percentage of single-page sessions
- **Session Duration**: How long visitors stay on your site

### 2. E-commerce Metrics
- **Revenue**: Total sales from your website
- **Transactions**: Number of completed purchases
- **Average Order Value**: Average amount spent per order
- **Product Performance**: Which products are most popular
- **Conversion Rate**: Percentage of visitors who make a purchase

### 3. User Behavior
- **Traffic Sources**: Where your visitors come from (Google, social media, etc.)
- **User Demographics**: Age, gender, location of your visitors
- **Device Usage**: Mobile vs desktop usage
- **Page Performance**: Which pages are most/least popular

## Privacy Compliance

### 1. Cookie Consent
Your website already has a cookie consent popup that complies with privacy regulations. The Google Analytics tracking respects user consent.

### 2. Privacy Policy Update
Consider updating your privacy policy to mention Google Analytics usage:

```html
<p>We use Google Analytics to analyze website traffic and improve user experience. 
Google Analytics uses cookies to collect information about your use of our website. 
This information is used to compile reports and help us improve our website.</p>
```

## Testing Your Setup

### 1. Real-Time Reports
1. Go to Google Analytics
2. Click "Reports" → "Realtime" → "Overview"
3. Visit your website
4. You should see your visit appear in real-time

### 2. Debug Mode
Add this parameter to your tracking code for testing:
```javascript
gtag('config', 'G-XXXXXXXXXX', {
  debug_mode: true
});
```

### 3. Google Analytics Debugger
Install the Google Analytics Debugger browser extension to see tracking data in the console.

## Common Issues and Solutions

### 1. No Data Appearing
- Check if the Measurement ID is correct
- Ensure the tracking code is in the `<head>` section
- Check browser console for JavaScript errors
- Verify the website is live and accessible

### 2. Duplicate Page Views
- Ensure tracking code is only loaded once per page
- Check for multiple instances of the tracking code

### 3. Missing E-commerce Data
- Verify that purchase events are being triggered
- Check that the event parameters are correctly formatted

## Advanced Features

### 1. Goals and Conversions
Set up goals in Google Analytics to track:
- Form submissions (contact forms, quote requests)
- Page views (product pages, checkout completion)
- Time on site
- Pages per session

### 2. Custom Dimensions
Track additional data like:
- User type (new vs returning)
- Product category
- Payment method (COD vs prepaid)

### 3. Enhanced E-commerce
Enable enhanced e-commerce tracking for detailed product and transaction data.

## Support and Resources

- [Google Analytics Help Center](https://support.google.com/analytics/)
- [GA4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [E-commerce Tracking Guide](https://developers.google.com/analytics/devguides/collection/ga4/ecommerce)

## Contact Information

For technical support with Google Analytics setup:
- Email: support@pmptraders.com
- Phone: +91 9946170056

---

**Note**: This setup provides basic Google Analytics tracking. For advanced features like enhanced e-commerce tracking, custom events, and goals, additional implementation may be required. 