import { USE_MOCK } from '@/config/config';

import { AdminMembersPage as MockPage } from './AdminMembersPage.mock';
import { AdminMembersPage as RealPage } from './AdminMembersPage.real';

export const AdminMembersPage = USE_MOCK ? MockPage : RealPage;
