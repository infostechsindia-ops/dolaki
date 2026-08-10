import { SetMetadata } from '@nestjs/common';

export const BYPASS_ENVELOPE_KEY = 'bypassEnvelope';
export const BypassEnvelope = () => SetMetadata(BYPASS_ENVELOPE_KEY, true);
