# 🚀 DOMAIN FIX DEPLOYMENT GUIDE

## 🔍 **Issue Identified**
- **Frontend Domain**: sulthanafitness.shop (deployed site)
- **API Domain**: sultanafitness.store (where APIs work)
- **Problem**: Domain mismatch causing API failures

## ✅ **Solution Applied**

### **Files Updated:**
1. `app/api/debug/route.ts` - Debug endpoint to check production config
2. `.env.production` - Production environment variables template
3. `lib/woocommerce.ts` - Enhanced domain validation and logging
4. `test-domains.js` - Domain testing script

### **Key Findings:**
- ✅ **sultanafitness.store**: All APIs working (WooCommerce ✓, Store API ✓)
- ❌ **sulthanafitness.shop**: APIs return 403 Forbidden

## 🛠️ **IMMEDIATE ACTION REQUIRED**

### **Step 1: Update Vercel Environment Variables**
Go to your Vercel Dashboard and set these environment variables:

```bash
NEXT_PUBLIC_WOOCOMMERCE_STORE_URL=https://sultanafitness.store
WOOCOMMERCE_CONSUMER_KEY=ck_fe2d2056ee594ff1c4693db397426f6a1425d4ec
WOOCOMMERCE_CONSUMER_SECRET=cs_f6f4f25a3aa73c7db791cf2816fb5a1bc5bb34a7
NEXT_PUBLIC_COCART_STORE_URL=https://sultanafitness.store
```

### **Step 2: Test Production Deployment**
After deployment, test these URLs:
- `https://sulthanafitness.shop/api/debug` - Check config
- `https://sulthanafitness.shop/` - Test homepage
- `https://sulthanafitness.shop/shop` - Test products

### **Step 3: WordPress Configuration (Optional)**
If you want both domains to work, configure in WordPress:
1. Go to `https://sultanafitness.store/wp-admin`
2. Settings → General → WordPress Address & Site Address
3. Add both domains or configure domain forwarding

## 🔍 **Verification Commands**

```bash
# Test both domains locally
node test-domains.js

# Check local config
curl http://localhost:3000/api/debug

# Check production config (after deployment)
curl https://sulthanafitness.shop/api/debug
```

## 🎯 **Expected Results**
After proper configuration:
- ✅ Homepage loads without "API Connection Issue"
- ✅ Products display correctly
- ✅ Cart functionality works
- ✅ All navigation links work

## 📋 **Troubleshooting**

### If APIs still fail:
1. Check Vercel environment variables
2. Verify domain DNS settings
3. Check WordPress CORS settings
4. Review WooCommerce API permissions

### Debug endpoint shows:
- Config status
- API test results
- Environment details
- Domain validation

---
**Next: Commit and deploy these fixes!**
