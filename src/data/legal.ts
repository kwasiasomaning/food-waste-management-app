export const PRIVACY_VERSION = '1.2';
export const TERMS_VERSION = '1.2';
export const LEGAL_UPDATED = '15 September 2026';
export const PRIVACY_CONTACT = 'kwasi@oakagility.coach';
export const APP_NAME = 'Tonight';

export type LegalSection = { heading: string; body: string };

export const PRIVACY_SECTIONS: LegalSection[] = [
  {
    heading: 'Who we are',
    body: `${APP_NAME} is a household dinner app that helps you cook food you already have before it is wasted. For GDPR, the controller of your personal data is the publisher of ${APP_NAME}. Questions: ${PRIVACY_CONTACT}.`,
  },
  {
    heading: 'What we collect',
    body: 'We collect only what the app needs: your email and password (stored as a salted hash, never in plain text), your name, the country and currency you choose, household size and diet, pantry items, cooked and binned records, the shop list, and the consents you give. We do not ask for your phone number, payment card, GPS or other precise location, contacts, or government ID. We do not run advertising SDKs or sell your data.',
  },
  {
    heading: 'Where it is stored',
    body: `Your account and kitchen stay on this device. ${APP_NAME} does not currently upload your pantry, meals, or email to our servers. If we later offer optional cloud sync or a hosted account, we will ask for a fresh, specific consent and update this policy before any upload.`,
  },
  {
    heading: 'Why we use it (legal bases)',
    body: 'Creating and signing in to your account is a contract: we need your email and password to identify you on this device. Kitchen data is processed to provide the service you asked for. Consent covers your agreement to this policy and the age confirmation. We do not use your data for marketing unless you later opt in to a separate, unticked choice. We do not profile you for advertising.',
  },
  {
    heading: 'Children',
    body: 'You must meet the minimum age in your country to create an account: 16 in the UK, EU, and EEA; 13 in most other countries. We do not knowingly create accounts for children below that age. If you believe a child has registered, email us and we will delete the account.',
  },
  {
    heading: 'How long we keep it',
    body: 'We keep your account and kitchen on this device until you delete the account, reset the kitchen, or remove the app. Deleting the account erases the stored profile, consents, and kitchen data for that account on this device.',
  },
  {
    heading: 'Who we share it with',
    body: `We do not sell personal data. We do not share your kitchen or email with advertisers. This version of ${APP_NAME} does not send your pantry, shop list, or address to a grocery delivery partner. The operating system and app stores may process diagnostic information under their own policies if you send them a crash report. Camera and photo access, if you use them, stay on device to identify food you already have.`,
  },
  {
    heading: 'International users',
    body: `${APP_NAME} is offered worldwide. Because data stays on your device, we do not transfer your account to another country. If you travel or change devices, your data does not follow you unless you export it and import it yourself.`,
  },
  {
    heading: 'Your rights',
    body: 'If UK GDPR or EU GDPR applies, you can access your data, correct it, delete it, export it, restrict or object to processing, and withdraw consent. In the app: download your data, edit household details, sign out, or delete your account. You can also email us. Withdrawal does not affect processing already done. You may complain to your supervisory authority (in the UK, the ICO; in the EU, your national data protection authority).',
  },
  {
    heading: 'Automated decisions',
    body: 'Dinner suggestions are ranked from the food you logged and what expires first. That is not legal or similarly significant automated decision-making under GDPR Article 22.',
  },
  {
    heading: 'Security',
    body: 'Passwords are salted and hashed on your device. No security is perfect. Use a unique password. If you forget it, this on-device account cannot send a reset email; you may export data while signed in, or erase local Tonight data from the sign-in screen.',
  },
  {
    heading: 'Changes',
    body: `This policy is version ${PRIVACY_VERSION}, updated ${LEGAL_UPDATED}. If we change it in a material way, we will ask you to read and accept the new version before you continue.`,
  },
];

export const TERMS_SECTIONS: LegalSection[] = [
  {
    heading: 'The app',
    body: `${APP_NAME} suggests dinners from food you log. It is a household tool, not medical, nutritional, or legal advice. You are responsible for food safety, allergies, and whether a recipe is right for you.`,
  },
  {
    heading: 'Your account',
    body: 'You must be old enough to register in your country, give accurate details, and keep your password to yourself. One person per account. You may delete the account at any time in Settings.',
  },
  {
    heading: 'Your content',
    body: 'Pantry items and notes you add stay yours. You grant us a limited permission to store and display them on this device so the app can work. We do not claim ownership of your kitchen list.',
  },
  {
    heading: 'Acceptable use',
    body: 'Do not misuse the app, attempt to break security, or use it to harm others. We may refuse or delete an account that is abusive or created for a child below the minimum age.',
  },
  {
    heading: 'Stores and availability',
    body: `${APP_NAME} may be offered on the App Store and Google Play worldwide. Store rules, local law, and these terms all apply. Some features (camera, photos) need your permission and can be refused.`,
  },
  {
    heading: 'No warranty',
    body: `The app is provided as is. We do not promise it will prevent food waste, save a specific amount of money, or be error-free. To the fullest extent local law allows, we are not liable for lost food, lost data, or indirect losses. Nothing here limits liability that cannot be limited by law.`,
  },
  {
    heading: 'Changes and contact',
    body: `These terms are version ${TERMS_VERSION}, updated ${LEGAL_UPDATED}. Questions: ${PRIVACY_CONTACT}.`,
  },
];

const AGE_16_COUNTRIES = new Set([
  'AT',
  'BE',
  'BG',
  'HR',
  'CY',
  'CZ',
  'DK',
  'EE',
  'FI',
  'FR',
  'DE',
  'GR',
  'HU',
  'IE',
  'IT',
  'LV',
  'LT',
  'LU',
  'MT',
  'NL',
  'PL',
  'PT',
  'RO',
  'SK',
  'SI',
  'ES',
  'SE',
  'IS',
  'LI',
  'NO',
  'GB',
]);

export function minimumAgeForCountry(country: string): number {
  return AGE_16_COUNTRIES.has(country) ? 16 : 13;
}
