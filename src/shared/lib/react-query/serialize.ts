/**
 * Safely serialize data for embedding in HTML
 * Escapes characters that could break out of script tags or cause XSS
 *
 * @param data - Data to serialize (typically dehydrated React Query state)
 * @returns Safe JSON string that can be embedded in HTML
 */
export function safeSerialize(data: unknown): string {
  const json = JSON.stringify(data);

  // Escape characters that could break out of script tags or cause XSS
  return json
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/\//g, "\\u002f")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

/**
 * Deserialize data that was serialized with safeSerialize
 *
 * @param serialized - Serialized string
 * @returns Parsed data
 */
export function safeDeserialize<T = unknown>(serialized: string): T {
  return JSON.parse(serialized);
}
