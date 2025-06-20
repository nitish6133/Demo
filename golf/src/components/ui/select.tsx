// components/ui/select.tsx
import { USE_MOCK } from '@/config/config';

import * as MockSelect from './select.mock';
import * as RealSelect from './select.real';

export const Select = USE_MOCK ? MockSelect.Select : RealSelect.Select;
export const SelectTrigger = USE_MOCK ? MockSelect.SelectTrigger : RealSelect.SelectTrigger;
export const SelectValue = USE_MOCK ? MockSelect.SelectValue : RealSelect.SelectValue;
export const SelectContent = USE_MOCK ? MockSelect.SelectContent : RealSelect.SelectContent;
export const SelectItem = USE_MOCK ? MockSelect.SelectItem : RealSelect.SelectItem;
