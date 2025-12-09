import { newEmailAction } from './actions/new-email.action';
import { NewEmailHook } from './hooks/new-email.hook';
import { sendEmailReaction } from './reactions/send-email.reaction';
import { GoogleService } from './google.service';
import { ServiceAuthRepository } from '../../auth/service-auth.repository';
import { AutomationEngine } from '../../automation/engine.service';
import { ServiceDefinition } from '../abstract/service.interface';

export function googleIntegration(
  googleService: GoogleService,
  authRepo: ServiceAuthRepository,
  engine: AutomationEngine,
  newEmailHook: NewEmailHook,
): ServiceDefinition {
  return {
    id: 'google',
    displayName: 'Google',

    instance: {
      googleService,
      authRepo,
      engine,
    },

    actions: [newEmailAction],

    reactions: [sendEmailReaction],

    hooks: [newEmailHook],
  };
}
