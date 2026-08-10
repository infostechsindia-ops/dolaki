import { Logger } from '@nestjs/common';

export interface EnvValidationResult {
  isValid: boolean;
  missingVars: string[];
  warnings: string[];
}

export function validateEnvironment(isProduction: boolean): EnvValidationResult {
  const logger = new Logger('EnvironmentValidator');
  const missingVars: string[] = [];
  const warnings: string[] = [];

  const requiredInProduction = [
    'JWT_SECRET',
    'DB_PASSWORD',
    'DB_HOST',
    'DB_USER',
    'DB_NAME',
  ];

  const optionalConfigs = [
    'PAYMENT_PROVIDER',
    'STRIPE_WEBHOOK_SECRET',
    'RAZORPAY_WEBHOOK_SECRET',
    'EMAIL_PROVIDER',
    'SMTP_HOST',
    'SENDGRID_API_KEY',
    'SMS_PROVIDER',
    'TWILIO_ACCOUNT_SID',
    'PUSH_PROVIDER',
    'FCM_PROJECT_ID',
    'STORAGE_PROVIDER',
    'AWS_S3_BUCKET',
    'SEARCH_PROVIDER',
    'TYPESENSE_API_KEY',
    'ANALYTICS_PROVIDER',
    'SENTRY_DSN',
  ];

  if (isProduction) {
    for (const key of requiredInProduction) {
      if (!process.env[key] || process.env[key]?.trim().length === 0) {
        missingVars.push(key);
      }
    }
  }

  for (const key of optionalConfigs) {
    if (!process.env[key]) {
      warnings.push(`Optional config "${key}" is not set; defaulting to fallback mode.`);
    }
  }

  if (missingVars.length > 0) {
    logger.error(
      `CRITICAL CONFIGURATION ERROR: Missing required production environment variables: ${missingVars.join(', ')}`,
    );
    if (isProduction) {
      throw new Error(`Production startup aborted due to missing secrets: ${missingVars.join(', ')}`);
    }
  } else {
    logger.log('Environment configuration validation passed successfully.');
  }

  return {
    isValid: missingVars.length === 0,
    missingVars,
    warnings,
  };
}
