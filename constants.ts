
import { Subscriber, Zone } from './types';

export const ZONES: Zone[] = [
  { id: 'all', name: 'All Zones' },
  { id: 'us-east-1', name: 'US-East-1' },
  { id: 'eu-west-1', name: 'EU-West-1' },
  { id: 'apac-north-1', name: 'APAC-North-1' },
];

export const SUBSCRIBERS: Subscriber[] = [
  { id: 'all', name: 'All Subscribers', zoneId: 'all' },
  { id: 'cardworks', name: 'Cardworks', zoneId: 'us-east-1' },
  { id: 'sparrow', name: 'Sparrow', zoneId: 'apac-north-1' },
  { id: 'hdfc', name: 'HDFC', zoneId: 'apac-north-1' },
  { id: 'optum', name: 'Optum', zoneId: 'eu-west-1' },
  { id: 'jenius_bank', name: 'Jenius Bank', zoneId: 'us-east-1' },
  { id: 'lakestack', name: 'Lakestack', zoneId: 'us-east-1' },
  { id: 'itp', name: 'ITP', zoneId: 'eu-west-1' },
  { id: 'tachyon_credit', name: 'Tachyon Credit', zoneId: 'apac-north-1' },
];
