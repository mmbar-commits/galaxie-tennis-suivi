export interface PhoneCountry {
  iso: string;
  flag: string;
  name: string;
  dialCode: string;
  placeholder: string;
}

export const PHONE_COUNTRIES: PhoneCountry[] = [
  { iso: 'FR', flag: '🇫🇷', name: 'France', dialCode: '+33', placeholder: '06 12 34 56 78' },
  { iso: 'BE', flag: '🇧🇪', name: 'Belgique', dialCode: '+32', placeholder: '0470 12 34 56' },
  { iso: 'CH', flag: '🇨🇭', name: 'Suisse', dialCode: '+41', placeholder: '079 123 45 67' },
  { iso: 'LU', flag: '🇱🇺', name: 'Luxembourg', dialCode: '+352', placeholder: '621 123 456' },
  { iso: 'MC', flag: '🇲🇨', name: 'Monaco', dialCode: '+377', placeholder: '06 12 34 56 78' },
  { iso: 'CA', flag: '🇨🇦', name: 'Canada / États-Unis', dialCode: '+1', placeholder: '514 555 0199' },
  { iso: 'GB', flag: '🇬🇧', name: 'Royaume-Uni', dialCode: '+44', placeholder: '07700 900123' },
  { iso: 'ES', flag: '🇪🇸', name: 'Espagne', dialCode: '+34', placeholder: '612 34 56 78' },
  { iso: 'IT', flag: '🇮🇹', name: 'Italie', dialCode: '+39', placeholder: '347 123 4567' },
  { iso: 'DE', flag: '🇩🇪', name: 'Allemagne', dialCode: '+49', placeholder: '0151 23456789' },
  { iso: 'PT', flag: '🇵🇹', name: 'Portugal', dialCode: '+351', placeholder: '912 345 678' },
  { iso: 'MA', flag: '🇲🇦', name: 'Maroc', dialCode: '+212', placeholder: '06 12 34 56 78' },
  { iso: 'TN', flag: '🇹🇳', name: 'Tunisie', dialCode: '+216', placeholder: '20 123 456' },
  { iso: 'DZ', flag: '🇩🇿', name: 'Algérie', dialCode: '+213', placeholder: '05 51 23 45 67' },
];

export function normalizePhoneE164(dialCode: string, rawPhone: string): string {
  const cleanDial = dialCode.startsWith('+') ? dialCode : `+${dialCode.replace(/\D/g, '')}`;
  let digits = rawPhone.replace(/\D/g, '');
  // Strip national trunk leading 0 for European / Maghreb numbers when building E.164
  if (digits.startsWith('0') && cleanDial !== '+39') {
    digits = digits.slice(1);
  }
  return `${cleanDial}${digits}`;
}

export function isValidPhoneInput(rawPhone: string): boolean {
  const digits = rawPhone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 15;
}

export function formatPhoneDisplay(dialCode?: string, rawPhone?: string): string {
  if (!rawPhone?.trim()) return '';
  return `${dialCode || '+33'} ${rawPhone.trim()}`;
}
