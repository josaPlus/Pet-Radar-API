import winston from 'winston';
import * as appInsights from 'applicationinsights';
import { envs } from './envs';

console.log('🔍 Connection String:', envs.APPINSIGHTS_CONNECTION_STRING ? 'Existe' : 'Undefined');

// Inicializar solo si existe la connection string
let aiClient: any = null;

if (envs.APPINSIGHTS_CONNECTION_STRING) {
  appInsights
    .setup(envs.APPINSIGHTS_CONNECTION_STRING)
    .setAutoCollectConsole(false)
    .setSendLiveMetrics(true)
    .start();

  aiClient = appInsights.defaultClient;
  console.log('Application Insights inicializado');
} else {
  console.warn('APPINSIGHTS_CONNECTION_STRING no configurada. Los logs no se enviarán a Azure.');
}

const appInsightsTransport = new winston.transports.Console({
  level: 'info',
  format: winston.format.printf(({ level, message, timestamp }) => {
    const logMessage = `[${level}] ${message}`;
    
    // Solo si aiClient existe
    if (aiClient) {
      try {
        if (level === 'error') {
          aiClient.trackException({
            exception: new Error(String(message)),
            properties: { timestamp },
          });
        } else {
          aiClient.trackTrace({
            message: logMessage,
            properties: { timestamp },
          });
        }
      } catch (error) {
        console.error('Error enviando a App Insights:', error);
      }
    }
    
    return `${timestamp} ${logMessage}`;
  }),
});

export const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [new winston.transports.Console(), appInsightsTransport],
});