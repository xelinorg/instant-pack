module.exports = {
  apps: [
    {
      instances: 3,
      cwd: '/project/root/directory',
      exec_mode: 'cluster',
      name: 'instant-pack',
      script: 'build/index.js',
      args:
        'port=5000 wildcard=true websocket=socketio redishost=redis.devnet redisport=6379',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
