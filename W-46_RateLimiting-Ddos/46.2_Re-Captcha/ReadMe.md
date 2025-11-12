# 🛡️ reCAPTCHA Protection Guide

## 📚 Table of Contents
- [What is reCAPTCHA?](#what-is-recaptcha)
- [Why Use reCAPTCHA?](#why-use-recaptcha)
- [Types of reCAPTCHA](#types-of-recaptcha)
- [Implementation Options](#implementation-options)
  - [Google reCAPTCHA](#google-recaptcha)
  - [Cloudflare Turnstile](#cloudflare-turnstile)
- [Step-by-Step Implementation](#step-by-step-implementation)
- [Best Practices](#best-practices)

---

## 🤔 What is reCAPTCHA?

reCAPTCHA is a **free security service** that protects your website from spam, abuse, and bot attacks. It uses advanced risk analysis techniques to distinguish between humans and bots, ensuring that only legitimate users can interact with your application.

### 🎯 Key Features:
- ✅ Prevents automated attacks (brute force, credential stuffing)
- ✅ Protects forms (login, registration, password reset)
- ✅ Reduces spam submissions
- ✅ Improves overall security posture
- ✅ Easy to integrate

---

## 💡 Why Use reCAPTCHA?

### Common Attack Scenarios:
1. **🔓 Brute Force Attacks**: Attackers try thousands of password combinations
2. **📧 Spam Bots**: Automated scripts flood your forms with junk data
3. **🎯 OTP Brute Forcing**: Bots attempt to guess OTP codes
4. **💳 Credential Stuffing**: Using stolen credentials to gain unauthorized access
5. **🌐 DDoS Attacks**: Overwhelming your server with requests

reCAPTCHA acts as a **first line of defense** against these threats! 🛡️

---

## 🔍 Types of reCAPTCHA

### 1. **reCAPTCHA v2** 📋
- **Checkbox**: "I'm not a robot" checkbox
- **Invisible**: Works in the background, no user interaction needed (unless suspicious)

### 2. **reCAPTCHA v3** 🤖
- Returns a **score (0.0 to 1.0)** indicating the likelihood of being a bot
- No user interaction required
- Allows you to decide the threshold for blocking

### 3. **reCAPTCHA Enterprise** 🏢
- Advanced features for large-scale applications
- Better fraud detection
- Custom risk analysis

---

## 🚀 Implementation Options

## 📘 Google reCAPTCHA

### Step 1: Get API Keys 🔑

1. Go to [Google reCAPTCHA Admin Console](https://www.google.com/recaptcha/admin)
2. Click **"+"** to register a new site
3. Fill in the details:
   - **Label**: Your project name
   - **reCAPTCHA type**: Choose v2 or v3
   - **Domains**: Add your domains (use `localhost` for testing)
4. Accept terms and click **Submit**
5. Copy your **Site Key** and **Secret Key**

### Step 2: Frontend Integration 🎨

```html
<!-- Add this script to your HTML -->
<script src="https://www.google.com/recaptcha/api.js" async defer></script>

<!-- For reCAPTCHA v2 (Checkbox) -->
<form>
  <div class="g-recaptcha" data-sitekey="YOUR_SITE_KEY"></div>
  <button type="submit">Submit</button>
</form>

<!-- For reCAPTCHA v2 (Invisible) -->
<button class="g-recaptcha" 
        data-sitekey="YOUR_SITE_KEY" 
        data-callback="onSubmit">
  Submit
</button>
```

```javascript
// For reCAPTCHA v3
<script>
  grecaptcha.ready(function() {
    grecaptcha.execute('YOUR_SITE_KEY', {action: 'submit'})
      .then(function(token) {
        // Add token to your form
        document.getElementById('recaptchaToken').value = token;
      });
  });
</script>
```

### Step 3: Backend Verification ✅

```typescript
import axios from 'axios';

async function verifyRecaptcha(token: string): Promise<boolean> {
  const SECRET_KEY = 'YOUR_SECRET_KEY';
  
  try {
    const response = await axios.post(
      'https://www.google.com/recaptcha/api/siteverify',
      null,
      {
        params: {
          secret: SECRET_KEY,
          response: token
        }
      }
    );
    
    // For v2: Check success
    if (response.data.success) {
      return true;
    }
    
    // For v3: Check score (0.0 = bot, 1.0 = human)
    if (response.data.score > 0.5) {
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('reCAPTCHA verification failed:', error);
    return false;
  }
}

// Usage in your endpoint
app.post('/verify-otp', async (req, res) => {
  const { recaptchaToken, email, otp } = req.body;
  
  // Verify reCAPTCHA first
  const isHuman = await verifyRecaptcha(recaptchaToken);
  
  if (!isHuman) {
    return res.status(403).json({ 
      success: false, 
      message: 'reCAPTCHA verification failed' 
    });
  }
  
  // Continue with OTP verification
  // ...
});
```

---

## ☁️ Cloudflare Turnstile (reCAPTCHA Alternative)

**Cloudflare Turnstile** is a privacy-first, user-friendly alternative to reCAPTCHA! 🎉

### 🌟 Advantages:
- ✅ Better privacy (no Google tracking)
- ✅ Faster performance
- ✅ Free for unlimited use
- ✅ Simpler implementation
- ✅ Works seamlessly with Cloudflare CDN

### Step 1: Get Cloudflare Turnstile Keys 🔑

1. Sign up/Login to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to **Turnstile** section
3. Click **"Add Site"**
4. Configure:
   - **Site name**: Your project name
   - **Domain**: Add your domain (use `localhost` for testing)
   - **Widget Mode**: Choose Managed, Non-Interactive, or Invisible
5. Copy your **Site Key** and **Secret Key**

### Step 2: Frontend Integration 🎨

```html
<!-- Add Turnstile script -->
<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<!-- Add Turnstile widget to your form -->
<form id="myForm">
  <input type="email" name="email" placeholder="Email" required />
  <input type="text" name="otp" placeholder="OTP" required />
  
  <!-- Turnstile widget -->
  <div class="cf-turnstile" 
       data-sitekey="YOUR_SITE_KEY"
       data-callback="onTurnstileSuccess">
  </div>
  
  <button type="submit">Submit</button>
</form>

<script>
  function onTurnstileSuccess(token) {
    console.log('Turnstile token:', token);
    // Token will be automatically included in form submission
  }
</script>
```

### Step 3: Backend Verification ✅

```typescript
import axios from 'axios';

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const SECRET_KEY = 'YOUR_SECRET_KEY';
  
  try {
    const response = await axios.post(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        secret: SECRET_KEY,
        response: token,
        remoteip: ip // Optional but recommended
      }
    );
    
    return response.data.success;
  } catch (error) {
    console.error('Turnstile verification failed:', error);
    return false;
  }
}

// Usage in Express.js
app.post('/verify-otp', async (req, res) => {
  const { 'cf-turnstile-response': turnstileToken, email, otp } = req.body;
  const clientIp = req.ip;
  
  // Verify Turnstile
  const isHuman = await verifyTurnstile(turnstileToken, clientIp);
  
  if (!isHuman) {
    return res.status(403).json({ 
      success: false, 
      message: 'Verification failed. Please try again.' 
    });
  }
  
  // Continue with OTP verification
  // ...
});
```

### Complete Example with React ⚛️

```tsx
import { useRef } from 'react';

function LoginForm() {
  const turnstileRef = useRef(null);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const turnstileToken = formData.get('cf-turnstile-response');
    
    const response = await fetch('/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.get('email'),
        otp: formData.get('otp'),
        'cf-turnstile-response': turnstileToken
      })
    });
    
    const data = await response.json();
    console.log(data);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" name="email" required />
      <input type="text" name="otp" required />
      
      <div 
        className="cf-turnstile" 
        data-sitekey="YOUR_SITE_KEY"
        ref={turnstileRef}
      />
      
      <button type="submit">Submit</button>
    </form>
  );
}
```

---

## 🎯 Best Practices

### 1. **Combine with Rate Limiting** 🚦
Don't rely solely on reCAPTCHA. Use it together with:
- IP-based rate limiting
- Account lockout policies
- Session management

### 2. **Choose the Right Type** 🎪
- **v2 Checkbox**: Good for critical actions (login, payment)
- **v3**: Better UX for less critical forms
- **Turnstile**: Best balance of security and privacy

### 3. **Server-Side Validation is Mandatory** 🔒
- **Always** verify tokens on the backend
- Never trust client-side validation alone
- Store secret keys securely (use environment variables)

### 4. **Handle Failures Gracefully** 🤝
```typescript
if (!isHuman) {
  return res.status(403).json({ 
    success: false, 
    message: 'Please complete the security check' 
  });
}
```

### 5. **Monitor and Adjust** 📊
- Track verification success rates
- Adjust score thresholds (for v3)
- Monitor for false positives

### 6. **Test Thoroughly** 🧪
- Test with different browsers
- Test on mobile devices
- Test with VPNs and different IPs

---

## 🔗 Useful Resources

- 📖 [Google reCAPTCHA Documentation](https://developers.google.com/recaptcha)
- ☁️ [Cloudflare Turnstile Docs](https://developers.cloudflare.com/turnstile/)
- 🛡️ [OWASP Security Guidelines](https://owasp.org/)
- 💻 [Express Rate Limiting Guide](https://www.npmjs.com/package/express-rate-limit)

---

## 🎓 Key Takeaways

✨ reCAPTCHA/Turnstile is **essential** for modern web security  
✨ Always combine with other security measures (rate limiting, etc.)  
✨ **Server-side verification** is non-negotiable  
✨ Cloudflare Turnstile offers better privacy and performance  
✨ Choose the right type based on your use case  

---

## 🚨 Security Note

reCAPTCHA is **not foolproof**! Sophisticated bots can sometimes bypass it. Always implement:
- ✅ Rate limiting
- ✅ IP blocking for suspicious activity
- ✅ Account lockout mechanisms
- ✅ Logging and monitoring
- ✅ Multi-factor authentication (MFA)

**Defense in depth** is the key to robust security! 🛡️🔐

---

Made with ❤️ for secure web applications
