# Deployment Guide for Core Engineering Website

## Pre-Deployment Checklist

1. File Optimization
   - Verify all HTML files are minified
   - Confirm all images are compressed and optimized
   - Check all JavaScript files are minified
   - Ensure all CSS files are minified

2. Performance Verification
   - Run Google Lighthouse test
   - Check mobile responsiveness
   - Verify all forms work
   - Test all social media links
   - Confirm all images load properly

3. SEO Verification
   - Verify meta tags are in place
   - Check robots.txt is accessible
   - Confirm sitemap.xml is valid
   - Test canonical URLs
   - Verify structured data

## Cloudflare Setup

1. DNS Configuration
   - Add A record pointing to your server IP
   - Enable DNSSEC
   - Set up SSL/TLS to Full

2. Performance Settings
   - Enable Auto Minify (HTML, CSS, JS)
   - Enable Brotli Compression
   - Enable Early Hints
   - Enable HTTP/2 and HTTP/3
   - Configure Browser Cache TTL (4 weeks)
   - Enable Rocket Loader

3. Caching Rules
   - Set Cache Everything rule for static content
   - Configure Edge Cache TTL
   - Enable Polish for images
   - Set up Page Rules as per cloudflare.json

4. Security Settings
   - Enable WAF
   - Configure Firewall Rules
   - Set up Rate Limiting
   - Enable Bot Fight Mode
   - Configure Security Level

## Server Configuration

1. Apache Settings
   ```apache
   # Enable Compression
   AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript
   
   # Set Cache Headers
   <FilesMatch "\.(ico|pdf|jpg|jpeg|png|gif|webp|js|css|swf)$">
       Header set Cache-Control "max-age=31536000, public"
   </FilesMatch>
   
   # Enable Keep-Alive
   KeepAlive On
   KeepAliveTimeout 5
   MaxKeepAliveRequests 100
   ```

2. SSL Configuration
   - Install SSL certificate
   - Configure HSTS
   - Enable OCSP Stapling
   - Set up SSL session cache

## Post-Deployment Checklist

1. Monitoring Setup
   - Configure uptime monitoring
   - Set up error logging
   - Enable performance monitoring
   - Set up security scanning

2. Testing
   - Check all pages load correctly
   - Verify contact forms work
   - Test mobile responsiveness
   - Confirm SSL is working
   - Verify CDN is functioning

3. Performance Verification
   - Run speed tests from multiple locations
   - Check Core Web Vitals
   - Verify image loading
   - Test form submissions

4. SEO Final Check
   - Submit sitemap to Google Search Console
   - Verify robots.txt is working
   - Check structured data
   - Test social media cards

## Maintenance Plan

1. Regular Updates
   - Weekly content updates
   - Monthly security patches
   - Quarterly performance review
   - Bi-annual comprehensive audit

2. Backup Strategy
   - Daily incremental backups
   - Weekly full backups
   - Monthly offsite backups
   - Verify backup restoration

3. Monitoring
   - Set up uptime monitoring
   - Configure error alerts
   - Monitor security events
   - Track performance metrics

## Emergency Contacts

- Technical Support: support@corengineering.com.qa
- Emergency Contact: +974-30116612
- Cloudflare Support: https://support.cloudflare.com