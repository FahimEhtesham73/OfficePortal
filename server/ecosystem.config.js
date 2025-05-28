// server/ecosystem.config.js
module.exports = {
    apps: [
      {
        name: 'server',
        script: './src/server.js',
        instances: 'max',
        exec_mode: 'cluster',
        env: {
          NODE_ENV: 'development',
        },
        env_production: {
          NODE_ENV: 'production',
        },
      },
    ],
  };