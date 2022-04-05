module.exports.middleware = require('./middleware');

// To activate commento sso feature:
//
// Activate Single Sign On Authentication Options
// Add https://GHOST_FRONT_URL/commento/sso as REDIRECT URL
// Copy the HMAC SHARED SECRET KEY as secret

// Then set 2 env vars deploying ghost:
// commento__serverUrl=...
// commento__sso__secret=...

// Then create a page-commento.hbs in you theme with:
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
//                 var avatar = '{{@member.profile_image}}';
//                 window.location.href = '/commento/post?token='+token+'&avatar='+avatar;
//             })();
//         </script>
//     </head>
//     <body onLoad="onLoad();"></body>
//   </html>
// {{else}}
// {{!< default}}
// <section class="outer error-content">
//     <div class="inner">
//         <section class="error-message">
//             <h1>Please signin first to comment.</h1>
//             <a class="error-link" href="{{@site.url}}">Go to the front page →</a>
//         </section>
//     </div>
// </section>
// {{/if}}
//
// Finally create an empty page from admin panel named commento to expose previous step.
// This is required to forward auth cookies from browser session.