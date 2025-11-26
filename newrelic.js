'use strict';

exports.config = {
  app_name: [process.env.NEW_RELIC_APP_NAME || 'notificacoes'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY || '',
  distributed_tracing: {
    enabled: process.env.NEW_RELIC_DISTRIBUTED_TRACING_ENABLED === 'true'
  },
  logging: {
    level: process.env.NEW_RELIC_LOG_LEVEL || 'info',
    filepath: process.env.NEW_RELIC_LOG || 'stdout'
  },
  agent_enabled: Boolean(process.env.NEW_RELIC_LICENSE_KEY),
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
    ]
  }
};
