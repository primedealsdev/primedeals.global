/* Prime Deals — quote form. No backend: validates, then builds a prefilled
   WhatsApp message and a mailto: fallback from the fields. */
(function () {
  'use strict';

  var form = document.getElementById('quote-form');
  if (!form) return;

  var en = document.documentElement.lang === 'en';
  var WHATSAPP = '51940934722';
  var EMAIL = 'info@primedeals.global';

  var T = en ? {
    required: 'This field is required.',
    quantity: 'Enter a whole number, 1 or more.',
    contact: 'Enter a WhatsApp number or an email address.',
    url: 'Enter a link starting with http:// or https://.',
    intro: 'Hi, I\'d like a quote.',
    brand: 'Brand/academy', product: 'Product', quantity_l: 'Estimated quantity',
    deadline: 'Deadline', files: 'Design files', contact_l: 'Contact',
    subject: 'Quote request: '
  } : {
    required: 'Este campo es obligatorio.',
    quantity: 'Escribe un número entero, 1 o más.',
    contact: 'Escribe un número de WhatsApp o un correo.',
    url: 'Escribe un enlace que empiece con http:// o https://.',
    intro: 'Hola, quiero una cotización.',
    brand: 'Marca/academia', product: 'Producto', quantity_l: 'Cantidad aproximada',
    deadline: 'Fecha límite', files: 'Archivos de diseño', contact_l: 'Contacto',
    subject: 'Solicitud de cotización: '
  };

  var fields = {
    brand: form.elements.brand,
    product: form.elements.product,
    quantity: form.elements.quantity,
    deadline: form.elements.deadline,
    files: form.elements.files,
    contact: form.elements.contact
  };

  // No past deadlines.
  var d = new Date();
  fields.deadline.min = d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);

  form.noValidate = true;

  function setError(field, message) {
    var box = document.getElementById(field.id + '-error');
    if (message) {
      field.setAttribute('aria-invalid', 'true');
      box.textContent = message;
    } else {
      field.removeAttribute('aria-invalid');
      box.textContent = '';
    }
  }

  function check(name) {
    var f = fields[name];
    var v = f.value.trim();
    var msg = '';
    if (name === 'brand' || name === 'product') {
      if (!v) msg = T.required;
    } else if (name === 'quantity') {
      if (!v) msg = T.required;
      else if (!/^\d+$/.test(v) || parseInt(v, 10) < 1) msg = T.quantity;
    } else if (name === 'contact') {
      if (!v) msg = T.required;
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) && v.replace(/\D/g, '').length < 7) msg = T.contact;
    } else if (name === 'files') {
      if (v && !/^https?:\/\/\S+$/i.test(v)) msg = T.url;
    }
    setError(f, msg);
    return !msg;
  }

  Object.keys(fields).forEach(function (name) {
    var f = fields[name];
    f.addEventListener('blur', function () { if (f.value.trim() || f.getAttribute('aria-invalid')) check(name); });
    f.addEventListener('input', function () { if (f.getAttribute('aria-invalid')) check(name); });
  });

  function buildMessage() {
    var productLabel = fields.product.options[fields.product.selectedIndex].text;
    var lines = [
      T.intro,
      T.brand + ': ' + fields.brand.value.trim(),
      T.product + ': ' + productLabel,
      T.quantity_l + ': ' + fields.quantity.value.trim()
    ];
    if (fields.deadline.value) lines.push(T.deadline + ': ' + fields.deadline.value);
    if (fields.files.value.trim()) lines.push(T.files + ': ' + fields.files.value.trim());
    lines.push(T.contact_l + ': ' + fields.contact.value.trim());
    return lines.join('\n');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var first = null;
    Object.keys(fields).forEach(function (name) {
      if (!check(name) && !first) first = fields[name];
    });
    if (first) { first.focus(); return; }

    var message = buildMessage();
    var wa = 'https://wa.me/' + WHATSAPP + '?text=' + encodeURIComponent(message);
    var mail = 'mailto:' + EMAIL + '?subject=' + encodeURIComponent(T.subject + fields.brand.value.trim()) +
      '&body=' + encodeURIComponent(message);

    var result = document.getElementById('quote-result');
    document.getElementById('quote-preview').textContent = message;
    document.getElementById('quote-wa').href = wa;
    document.getElementById('quote-mail').href = mail;
    result.hidden = false;
    result.focus();
    result.scrollIntoView({ block: 'start' });

    // No contact details go to analytics, only the shape of the request.
    if (typeof window.pdTrack === 'function') {
      window.pdTrack('quote_submit', {
        product: fields.product.value,
        quantity: parseInt(fields.quantity.value, 10),
        has_deadline: !!fields.deadline.value,
        has_design_link: !!fields.files.value.trim(),
        link_location: 'quote'
      });
    }

    window.open(wa, '_blank', 'noopener');
  });
})();
