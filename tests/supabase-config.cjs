const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const exported = {};
new Function('exports', ts.transpileModule(fs.readFileSync('lib/supabaseConfig.ts', 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(exported);
const { validateSupabaseConfiguration: validate } = exported;
const url = 'https://abcdefghijklmnopqrst.supabase.co';
const key = 'sb_publishable_test-only';
assert.deepEqual(validate(url + '/', key), { url, publishableKey: key });
for (const invalid of [undefined, '', 'http://abcdefghijklmnopqrst.supabase.co', url + '.example.com', url + '/path', url + '?key=secret', 'https://user:password@abcdefghijklmnopqrst.supabase.co']) assert.throws(() => validate(invalid, key));
for (const invalid of [undefined, '', 'sb_secret_test-value', 'eyJlegacy-token', 'sb_publishable_replace_me', key + '\n']) {
  assert.throws(() => validate(url, invalid), error => !invalid || !error.message.includes(invalid));
}
let count = 0, options;
const client = {};
const moduleExports = {};
const source = fs.readFileSync('lib/supabase.ts', 'utf8');
new Function('require', 'exports', 'process', ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText)(name => {
  if (name === 'react-native-url-polyfill/auto') return {};
  if (name === './supabaseConfig') return exported;
  if (name === '@supabase/supabase-js') return { createClient(u, k, o) { count++; assert.equal(u, url); assert.equal(k, key); options = o; return client; } };
  throw new Error(`Unexpected dependency: ${name}`);
}, moduleExports, { env: { EXPO_PUBLIC_SUPABASE_URL: url, EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY: key } });
assert.equal(count, 0, 'Importing the foundation must not initiate authentication');
assert.equal(moduleExports.getSupabase(), client);
assert.equal(moduleExports.getSupabase(), client);
assert.equal(count, 1);
assert.equal(options.auth.persistSession, false);
assert.equal(options.auth.detectSessionInUrl, false);
assert.equal(options.auth.flowType, 'pkce');
assert(!source.includes('signUp('));
console.log('PASS: public-only Supabase configuration, unsafe URL/key rejection, redacted errors, lazy singleton and memory-only session configuration');
