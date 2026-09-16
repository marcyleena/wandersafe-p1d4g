# Custom Domain Setup for WanderSafe

This guide explains how to point a domain you own to your WanderSafe app.

---

## Option 1: Deploy on Vercel (Recommended)

1. **Deploy your app to Vercel**
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Add your custom domain in Vercel Dashboard**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Open your project → **Settings** → **Domains**
   - Click **Add Domain** and enter your domain (e.g. `wandersafe.app`)

3. **Update your DNS records** at your domain registrar (e.g. Namecheap, GoDaddy, Cloudflare):

   | Type  | Name | Value                    |
   |-------|------|--------------------------|
   | A     | @    | 76.76.19.61              |
   | CNAME | www  | cname.vercel-dns.com     |

4. **Wait for DNS propagation** (usually 5–60 minutes, up to 48 hours).

5. Vercel automatically provisions a **free SSL/TLS certificate** via Let's Encrypt.

---

## Option 2: Deploy on Netlify

1. **Deploy your app to Netlify**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

2. **Add your custom domain in Netlify Dashboard**
   - Go to [app.netlify.com](https://app.netlify.com)
   - Open your site → **Domain settings** → **Add custom domain**

3. **Update your DNS records** at your domain registrar:

   | Type  | Name | Value                        |
   |-------|------|------------------------------|
   | CNAME | www  | your-site.netlify.app        |
   | A     | @    | 75.2.60.5                    |

   Or use **Netlify DNS** (recommended): delegate your domain's nameservers to Netlify for automatic configuration.

4. Netlify automatically provisions **free SSL** via Let's Encrypt.

---

## Option 3: GitHub Pages

1. **Build your app**
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder to GitHub Pages**
   (or use the `gh-pages` package)

3. **Create a `CNAME` file** in `/public/` (already included in this project) with your domain:
   ```
   yourdomain.com
   ```
   Replace `yourdomain.com` with your actual domain. This file is automatically copied to `dist/` on build.

4. **Update your DNS records** at your domain registrar:

   | Type  | Name | Value                          |
   |-------|------|--------------------------------|
   | A     | @    | 185.199.108.153                |
   | A     | @    | 185.199.109.153                |
   | A     | @    | 185.199.110.153                |
   | A     | @    | 185.199.111.153                |
   | CNAME | www  | yourusername.github.io         |

5. In your GitHub repo → **Settings** → **Pages** → set **Custom domain** to your domain and enable **Enforce HTTPS**.

---

## Option 4: Cloudflare Pages

1. Connect your GitHub repo at [pages.cloudflare.com](https://pages.cloudflare.com)
2. Set build command: `npm run build`, output directory: `dist`
3. Go to **Custom domains** → **Set up a custom domain**
4. If your domain is already on Cloudflare DNS, records are added automatically.

---

## Updating `vite.config.js` for Subdirectory Deploys

If your app is deployed at a subdirectory (e.g. `yourdomain.com/wandersafe/`), update `vite.config.js`:

```js
export default {
  base: '/wandersafe/',
  // ...rest of config
}
```

For root domain deploys (e.g. `wandersafe.app`), leave `base` as `/` (the default).

---

## Checklist

- [ ] Domain purchased and accessible at registrar
- [ ] DNS A / CNAME records updated
- [ ] CNAME file in `/public/` contains your domain (for GitHub Pages)
- [ ] SSL certificate active (check for 🔒 padlock in browser)
- [ ] App loads at `https://yourdomain.com`
- [ ] `www` redirect works (e.g. `www.yourdomain.com` → `yourdomain.com`)

---

## Notes

- **DNS propagation** can take up to 48 hours, though usually much faster.
- **Always use HTTPS** — all major hosting platforms provide free SSL certificates automatically.
- Replace `yourdomain.com` throughout this guide with your actual domain name.