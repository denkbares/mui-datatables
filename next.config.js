// next.config.js
module.exports = {
  exportPathMap: function() {
    return {
      '/': { page: '/' },
    }
  },
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'none'",
              "script-src 'self' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob:",
              "font-src 'self' data: https://fonts.gstatic.com",
              `connect-src 'self'${
                isDev ? ' http://localhost:5050 ws://localhost:5050 http://localhost:3000 ws://localhost:3000' : ''
              }`,
            ].join('; '),
          },
        ],
      },
    ];
  },
};