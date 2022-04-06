module.exports.middleware = require('./middleware');

// To activate commento sso feature:
//
// Create a page-commento.hbs in you theme with, for ie:
// 
// {{#if @member}}
//   <!DOCTYPE html>
//   <html>
//     <head>
//         <meta charset="utf-8" />
//         <script>
//             const onLoad = (function() {
//                 var params = new URLSearchParams(location.search);
//                 var token = params.get('token');
//                 var hmac = params.get('hmac');
//                 var avatar = '{{@member.profile_image}}';
//                 window.location.href = '/commento/sso?token='+token+'&hmac='+hmac+'&avatar='+avatar;
//             })();
//         </script>
//     </head>
//     <body onLoad="onLoad();"></body>
//   </html>
// {{else}}
// {{!< default}}
// <section class="outer footer-cta">
//     <div class="inner">
//         <h2>Please signin to comment !!</h2>
//         <a class="footer-cta-button" href="#/portal" data-portal>
//             <div class="footer-cta-input">Enter your email</div>
//             <span>Signin</span>
//         </a>
//     </div>
// </section>
// {{/if}}
//
// Then create an empty page from admin panel named commento to expose commento page.
// This is required to forward auth cookies from browser session.
//
// On commento dedicated ghost site admin panel:
// Activate Single Sign On Authentication Options
// Add https://GHOST_FRONT_URL/commento as REDIRECT URL
// Copy the HMAC SHARED SECRET KEY as secret
// 
// Then set 2 env vars deploying ghost:
// commento__serverUrl=...
// commento__sso__secret=...