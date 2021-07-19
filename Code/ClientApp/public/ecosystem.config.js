module.exports = {
    script: 'serve',
    instances: 2,
    watch: true,
    autorestart: true,
    env: {
      PM2_SERVE_PATH: '.',
      PM2_SERVE_PORT: 8080
    }
  }