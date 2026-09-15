const { withAndroidManifest } = require('expo/config-plugins');

function asArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

/** Let Tonight ask Android whether Uber Eats is installed, then open it. */
function withUberEatsQueries(config) {
  return withAndroidManifest(config, (config) => {
    const manifest = config.modResults.manifest;
    const queries = asArray(manifest.queries);
    if (!JSON.stringify(queries).includes('com.ubercab.eats')) {
      queries.push({
        package: [{ $: { 'android:name': 'com.ubercab.eats' } }],
        intent: [
          {
            action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
            data: [{ $: { 'android:scheme': 'ubereats' } }],
          },
          {
            action: [{ $: { 'android:name': 'android.intent.action.VIEW' } }],
            data: [{ $: { 'android:scheme': 'https', 'android:host': 'www.ubereats.com' } }],
          },
        ],
      });
    }
    manifest.queries = queries;
    return config;
  });
}

module.exports = withUberEatsQueries;
