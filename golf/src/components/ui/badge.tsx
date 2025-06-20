import { Badge as MockBadge } from './badge.mock';
import { Badge as RealBadge } from './badge.real';
import { USE_MOCK } from '@/config/config';

export const Badge = USE_MOCK ? MockBadge : RealBadge;
