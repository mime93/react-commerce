import { SentryErrorIntegration } from './../packages/sentry/index';
import { SENTRY_SAMPLING_ENABLED, VERCEL_ENV } from '@config/env';
import { isCurrentProductionDeployment } from '@helpers/vercel-helpers';
import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const sampleRate = SENTRY_SAMPLING_ENABLED
   ? VERCEL_ENV === 'production'
      ? 1.0
      : 0
   : 1.0;

Sentry.init({
   async beforeSend(event) {
      try {
         const current_production = await isCurrentProductionDeployment();
         event.tags = { ...event.tags, current_production };
      } catch (e) {
         event.tags = { ...event.tags, before_send_error: true };
         event.extra = {
            ...event.extra,
            'Exception Checking Production Deployment': e,
         };
      }
      return event;
   },
   dsn: SENTRY_DSN,
   initialScope: {
      tags: {
         'next.runtime': 'edge',
      },
   },
   integrations: [new SentryErrorIntegration()],
   sampleRate,
});
