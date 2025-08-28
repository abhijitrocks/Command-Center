
import { Tenant } from './types';

export const TENANTS: Tenant[] = [
  { id: 'all', name: 'All Tenants' },
  { id: 'showroom', name: 'Showroom' },
  { id: 'hdfc_uat', name: 'HDFC UAT' },
  { id: 'hdfc_lz', name: 'HDFC LZ' },
  { id: 'common_prod', name: 'Common Prod' },
  { id: 'us', name: 'US' },
];

export const TIME_RANGES = ['Last 1h', 'Last 24h', 'Last 7d', 'Last 30d'];
