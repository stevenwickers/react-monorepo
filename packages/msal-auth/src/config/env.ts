/**
 * Normalized MSAL configuration values sourced from environment variables.
 */
export type MsalValues = {
  CLIENT_ID: string;
  AUTHORITY: string;
  REDIRECT_URI: string;
  LOGOUT_REDIRECT_URI: string;
  AZURE_SCOPES: string; // keep as string; we also expose a parsed getter below
};

/**
 * Represents any object that can provide string-like environment values.
 */
export type EnvSource = Record<string, string | boolean | undefined>;

// Order matters: longest/specific suffixes first.
const SUFFIX_MAP = [
  ["POST_LOGOUT_REDIRECT_URI", "LOGOUT_REDIRECT_URI"],
  ["REDIRECT_URI", "REDIRECT_URI"],
  ["CLIENT_ID", "CLIENT_ID"],
  ["AUTHORITY", "AUTHORITY"],
  ["AZURE_SCOPES", "AZURE_SCOPES"],
] as const satisfies ReadonlyArray<readonly [string, keyof MsalValues]>;

const DEFAULTS: MsalValues = {
  CLIENT_ID: "",
  AUTHORITY: "",
  REDIRECT_URI: "",
  LOGOUT_REDIRECT_URI: "",
  AZURE_SCOPES: "",
};

const normalizeKey = (k: string) => k.toUpperCase().trim();

/**
 * Resolve MSAL environment values from a supplied override or runtime globals.
 *
 * @param override - Explicit environment source to prefer over globals.
 * @returns A merged environment record.
 */
const resolveEnvSource = (override?: EnvSource): EnvSource => {
  if (override) return override;

  const resolved: EnvSource = {};

  try {
    const metaEnv = (import.meta as unknown as { env?: EnvSource })?.env;
    if (metaEnv) Object.assign(resolved, metaEnv);
  } catch (error) {
    console.warn("MSAL env: Unable to access import.meta.env", error);
  }

  const globalProcess = (
    globalThis as { process?: { env?: Record<string, unknown> } }
  ).process;
  if (globalProcess?.env) {
    Object.assign(resolved, globalProcess.env as EnvSource);
  }

  return resolved;
};

/**
 * Find the first suffix match for a given key and map it to an MSAL field.
 *
 * @param key - Raw environment key to inspect.
 * @returns The matching `MsalValues` field or `null` if none match.
 */
const resolveField = (key: string): keyof MsalValues | null => {
  const k = normalizeKey(key);
  const hit = SUFFIX_MAP.find(([suffix]) => k.endsWith(suffix));
  return hit ? hit[1] : null;
};

const FALLBACK_PREFIXES = ["MSAL_", "REACT_APP_", "NEXT_PUBLIC_", ""] as const;

/**
 * Extract MSAL-specific values from the given environment source.
 *
 * @param envSource - Optional override environment; defaults to runtime globals.
 * @param prefix - Primary prefix to inspect before fallbacks; defaults to `VITE_`.
 * @returns A normalized set of MSAL configuration values.
 */
export const getMSALEnv = (
  envSource?: EnvSource,
  prefix = "VITE_",
): MsalValues => {
  const src = resolveEnvSource(envSource);
  const values: MsalValues = { ...DEFAULTS };
  const primaryPrefix = normalizeKey(prefix);
  const fallbackPrefixes = [
    primaryPrefix,
    ...FALLBACK_PREFIXES.map(normalizeKey),
  ].filter((pfx, idx, arr) => arr.indexOf(pfx) === idx);

  for (const [rawKey, rawVal] of Object.entries(src)) {
    const key = normalizeKey(rawKey);
    const field = resolveField(key);
    if (!field) continue;

    for (const pfx of fallbackPrefixes) {
      const matchesPrefix = pfx ? key.startsWith(pfx) : true;
      if (!matchesPrefix) continue;
      if (values[field]) break;
      const valueString = typeof rawVal === "string" ? rawVal : "";
      if (valueString) {
        values[field] = valueString;
      }
    }
  }

  return values;
};

// Test exports for unit tests
export const __test = {
  resolveField, // (key: string) => keyof MsalValues | null
  getMSALEnv, // (envSource?: EnvSource, prefix?: string) => MsalValues
  SUFFIX_MAP, // optional: verify precedence ordering
};
