// Read-only connectivity check. Does not create users, send email, or query profiles.
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const { parseEnv } = require('node:util');
const root = path.resolve(__dirname, '..');
const envFile = path.join(root, '.env.local');
const local = fs.existsSync(envFile) ? parseEnv(fs.readFileSync(envFile, 'utf8')) : {};
const configModule = {};
new Function('exports', ts.transpileModule(fs.readFileSync(path.join(root, 'lib/supabaseConfig.ts'), 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(configModule);

async function main() {
  const config = configModule.validateSupabaseConfiguration(
    process.env.EXPO_PUBLIC_SUPABASE_URL ?? local.EXPO_PUBLIC_SUPABASE_URL,
    process.env.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? local.EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
  const response = await fetch(`${config.url}/auth/v1/settings`, {
    headers: { apikey: config.publishableKey }, signal: AbortSignal.timeout(15000), redirect: 'error',
  });
  if (!response.ok) throw new Error(`Supabase connection check failed (HTTP ${response.status}).`);
  const settings = await response.json();
  console.log('PASS: Supabase Auth accepted the configured public key. No data was written.');
  console.log(`Email login: ${settings.external?.email === true ? 'enabled' : 'not enabled'}`);
  console.log(`Email confirmation required: ${settings.mailer_autoconfirm === false ? 'yes' : 'verify in dashboard'}`);
  console.log(`Public signup: ${settings.disable_signup === true ? 'disabled' : 'enabled; keep closed during private setup'}`);
}
main().catch(error => {
  // Do not dump request headers, URLs containing credentials, or response bodies.
  const message = error instanceof Error && /^(Set EXPO_PUBLIC_|Supabase connection check failed)/.test(error.message)
    ? error.message : 'Could not verify Supabase. Check connectivity and the project status, then retry.';
  console.error(message);
  process.exitCode = 1;
});
