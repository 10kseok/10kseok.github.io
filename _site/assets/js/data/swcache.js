const resource = [
    /* --- CSS --- */
    '/10kseok.github.io/assets/css/style.css',

    /* --- PWA --- */
    '/10kseok.github.io/app.js',
    '/10kseok.github.io/sw.js',

    /* --- HTML --- */
    '/10kseok.github.io/index.html',
    '/10kseok.github.io/404.html',

    
        '/10kseok.github.io/categories/',
    
        '/10kseok.github.io/tags/',
    
        '/10kseok.github.io/archives/',
    
        '/10kseok.github.io/about/',
    

    /* --- Favicons & compressed JS --- */
    
    
        '/10kseok.github.io/assets/img/favicons/android-chrome-192x192.png',
        '/10kseok.github.io/assets/img/favicons/android-chrome-512x512.png',
        '/10kseok.github.io/assets/img/favicons/apple-touch-icon.png',
        '/10kseok.github.io/assets/img/favicons/favicon-16x16.png',
        '/10kseok.github.io/assets/img/favicons/favicon-32x32.png',
        '/10kseok.github.io/assets/img/favicons/favicon.ico',
        '/10kseok.github.io/assets/img/favicons/mstile-150x150.png',
        '/10kseok.github.io/assets/js/dist/categories.min.js',
        '/10kseok.github.io/assets/js/dist/commons.min.js',
        '/10kseok.github.io/assets/js/dist/home.min.js',
        '/10kseok.github.io/assets/js/dist/misc.min.js',
        '/10kseok.github.io/assets/js/dist/page.min.js',
        '/10kseok.github.io/assets/js/dist/post.min.js',
        '/10kseok.github.io/assets/js/dist/pvreport.min.js'
];

/* The request url with below domain will be cached */
const allowedDomains = [
    

    'localhost:4000',

    
        'demo-img.cotes.page',
    

    'fonts.gstatic.com',
    'fonts.googleapis.com',
    'cdn.jsdelivr.net',
    'polyfill.io'
];

/* Requests that include the following path will be banned */
const denyUrls = [
    
];

