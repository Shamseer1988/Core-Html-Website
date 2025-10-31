
    // Contact form handler with email + sheet logging
        (function () {
        const form = document.getElementById('contact-form');
        if (!form) return;

        // 1) EMAIL endpoint (your existing Apps Script that sends the email)
        const EMAIL_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw2zC_U2aZLAaqYo5zO_NqNbLfe3_lLKPWmsZ6iD-m39G-WGbhcVPspglkowF8YBwtW/exec';

        // 2) SHEET-logger endpoint (NEW Apps Script)
        const CONTACT_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxc3DWDmwjGQiDvWlHCrmXFHWctnVS0oQOUFPK92ef-Y852A86HRdcDEZQx4m3IoaDe/exec';

        // Prevent native browser validation bubbles
        form.setAttribute('novalidate', 'novalidate');

        // Fields
        const fName    = form.querySelector('[name="name"]');
        const fEmail   = form.querySelector('[name="email"]');
        const fPhone   = form.querySelector('[name="telephone"]');
        const fSubject = form.querySelector('[name="subject"]');
        const fMessage = form.querySelector('[name="message"]');

        // Helpful constraints
        if (fName)    { fName.required = true;     fName.maxLength = 60; }
        if (fEmail)   { fEmail.required = true;    fEmail.maxLength = 120; }
        if (fPhone)   { fPhone.required = true;    fPhone.maxLength = 20; }
        if (fSubject) { fSubject.required = true;  fSubject.maxLength = 100; }
        if (fMessage) { fMessage.required = true;  fMessage.maxLength = 2000; }

        // Wrap each field once so errors can be positioned without reflow
        const fields = [fName, fEmail, fPhone, fSubject, fMessage].filter(Boolean);
        fields.forEach(el => {
        if (!el.parentElement.classList.contains('input-wrap')) {
            const wrap = document.createElement('div');
            wrap.className = 'input-wrap';
            el.parentNode.insertBefore(wrap, el);
            wrap.appendChild(el);
        }
        });

        // Honeypot (anti-bot)
        const hp = document.createElement('input');
        hp.type = 'text'; hp.name = 'honeypot';
        hp.style.position = 'absolute'; hp.style.left = '-9999px';
        form.appendChild(hp);

        // ---------- Validation helpers (no layout shift) ----------
        function clearError(input) {
        if (!input) return;
        input.classList.remove('is-invalid');
        const wrap = input.closest('.input-wrap');
        if (!wrap) return;
        const msg = wrap.querySelector('.field-error-msg');
        if (msg) msg.remove();
        }

        function showError(input, message) {
        if (!input) return;
        clearError(input);
        input.classList.add('is-invalid');
        const wrap = input.closest('.input-wrap');
        if (!wrap) return;
        let msg = wrap.querySelector('.field-error-msg');
        if (!msg) { msg = document.createElement('div'); msg.className = 'field-error-msg'; wrap.appendChild(msg); }
        msg.textContent = message;
        }

        const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRe = /^\+?[0-9\s\-()]{7,20}$/;

        function validateField(input) {
        if (!input) return true;
        const val = (input.value || '').trim();
        switch (input.name) {
            case 'name':
            if (val.length < 2) { showError(input, 'Please enter your full name.'); return false; }
            break;
            case 'email':
            if (!emailRe.test(val)) { showError(input, 'Enter a valid email.'); return false; }
            break;
            case 'telephone':
            if (val.length < 7 || !phoneRe.test(val)) { showError(input, 'Enter a valid phone number.'); return false; }
            break;
            case 'subject':
            if (val.length < 2) { showError(input, 'Subject looks too short.'); return false; }
            break;
            case 'message':
            if (val.length < 10) { showError(input, 'Please write at least 10 characters.'); return false; }
            break;
        }
        clearError(input);
        return true;
        }

        // Live validation
        fields.forEach(el => {
        el.addEventListener('blur', () => validateField(el));
        el.addEventListener('input', () => { if (el.classList.contains('is-invalid')) validateField(el); });
        });

        // Utility: simple sanitize (strip tags)
        function sanitize(str) {
        return String(str || '').replace(/<\/?[^>]*>/g, '');
        }

        function toURLEncoded(obj) {
        return Object.keys(obj)
            .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(obj[k] ?? ''))
            .join('&');
        }

        async function postJSONorForm(url, payload) {
        // Try JSON first
        try {
            const r1 = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
            });
            try { return await r1.json(); } catch (_) { return { ok: r1.ok }; }
        } catch (_) { /* fall back */ }
        // Fallback: x-www-form-urlencoded (common for GAS samples)
        const r2 = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: toURLEncoded(payload)
        });
        try { return await r2.json(); } catch (_) { return { ok: r2.ok }; }
        }

        // --- Geolocation helper (IP → City, Region, Country) ---
        async function fetchLocationString() {
        try {
            const r = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
            if (!r.ok) return '';
            const j = await r.json();
            return [j.city, j.region, j.country_name].filter(Boolean).join(', ');
        } catch {
            return '';
        }
        }

        // ---------- Submit ----------
        form.addEventListener('submit', async function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();

        const okAll =
            validateField(fName) &
            validateField(fEmail) &
            validateField(fPhone) &
            validateField(fSubject) &
            validateField(fMessage);

        if (!okAll) {
            const firstErr = form.querySelector('.is-invalid');
            if (firstErr) firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            Swal.fire({ icon: 'error', title: 'Please fix the highlighted fields 😊' });
            return;
        }

        const btn = form.querySelector('button[type="submit"]');
        const oldLabel = btn ? btn.textContent : '';
        if (btn) { btn.disabled = true; btn.textContent = 'Sending…'; }

        // NEW: resolve location string
        const locationStr = await fetchLocationString();

        const payload = {
            type:      'Contact',
            name:      sanitize(fName.value),
            email:     sanitize(fEmail.value),
            telephone: sanitize(fPhone.value),
            phone:     sanitize(fPhone.value), // alias
            subject:   sanitize(fSubject.value),
            message:   sanitize(fMessage.value),
            page:      location.href,
            ua:        navigator.userAgent,
            location:  locationStr,            // <— include human-readable location
            honeypot:  ''                      // must stay empty
        };

        try {
            // 1) Send EMAIL (your existing Apps Script)
            const emailRes = await postJSONorForm(EMAIL_ENDPOINT, payload);

            // 2) Save to SHEET (new Apps Script)
            const sheetRes = await postJSONorForm(CONTACT_ENDPOINT, payload);

            const okEmail = !!(emailRes && (emailRes.ok || emailRes.emailed || emailRes.status === 'success'));
            const okSheet = !!(sheetRes && (sheetRes.ok || sheetRes.saved));

            if (okEmail && okSheet) {
            form.reset(); fields.forEach(clearError);
            Swal.fire({ icon: 'success', title: 'Message sent', text: 'We received your message and saved it.', timer: 2500, showConfirmButton: false });
            } else if (okEmail && !okSheet) {
            Swal.fire({ icon: 'success', title: 'Message sent', text: 'Email delivered ✅. (Note: saving to sheet failed — check the Sheet URL/permission.)' });
            } else if (!okEmail && okSheet) {
            Swal.fire({ icon: 'warning', title: 'Saved only', text: 'Saved to sheet ✅, but email sending failed.' });
            } else {
            Swal.fire({ icon: 'error', title: 'Oops!', text: 'Could not send or save. Please try again.' });
            }
        } catch (err) {
            Swal.fire({ icon: 'error', title: 'Network error', text: 'Please try again.' });
        } finally {
            if (btn) { btn.disabled = false; btn.textContent = oldLabel; }
        }
        }, true); // capture=true so theme scripts can't hijack
        })();

    // Contact form handler with email + sheet logging End


    // Start Newsletter Script (vanilla JS, no dependencies)


        (function () {
        const ENDPOINT = 'https://script.google.com/macros/s/AKfycbzXEcmS5OfNUTMrEf8SOKnbZTT2W-aIP2hCW0yuEKDhTEkuj3QNJfL8PsGxv9H5bog/exec'; // Replace with your Apps Script URL

        const form = document.getElementById('newsletter-form');
        if (!form) return;

        form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = (form.querySelector('#nl-email').value || '').trim();
        const honeypot = form.querySelector('input[name="honeypot"]').value || '';

        if (!email) {
            Swal.fire({
            icon: 'warning',
            title: 'Please enter a valid email address!',
            showConfirmButton: false,
            timer: 1800
            });
            return;
        }

        if (honeypot) return; // ignore bots

        // Step 1: show "Subscribing..." loader
        Swal.fire({
            title: 'Subscribing...',
            text: 'Please wait a moment.',
            allowOutsideClick: false,
            didOpen: () => {
            Swal.showLoading();
            }
        });

        // Step 2: send to Apps Script
        try {
            const payload = new URLSearchParams();
            payload.append('formType', 'newsletter');
            payload.append('email', email);

            const res = await fetch(ENDPOINT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
            body: payload.toString()
            });
            await res.text();

            // Step 3: show success message
            Swal.fire({
            icon: 'success',
            title: '🎉 Subscribed Successfully!',
            text: 'Thank you for joining our newsletter.',
            confirmButtonColor: '#ff5722'
            });
            form.reset();

        } catch (err) {
            // Step 4: error alert
            Swal.fire({
            icon: 'error',
            title: 'Oops!',
            text: 'Something went wrong. Please try again later.',
            confirmButtonColor: '#d33'
            });
        }
        });
        })();
    // End Newsletter Script
    /* Moved inline styles to custom.css for better maintainability */
