/**
 * URL Classifier Utility
 *
 * Classifies URLs as internal (within the Audira Route dashboard)
 * or external (should open in the user's default browser).
 *
 * Internal URLs match: http://localhost:20128/*
 * All other URLs are classified as external.
 */

const INTERNAL_HOST = 'localhost';
const INTERNAL_PORT = '20128';
const INTERNAL_PROTOCOL = 'http:';

/**
 * Determines whether a URL is internal to the Audira Route application.
 *
 * A URL is internal if and only if:
 * - Protocol is http:
 * - Hostname is localhost
 * - Port is 20128
 *
 * Malformed URLs are treated as external.
 *
 * @param {string} url - The URL string to classify
 * @returns {boolean} true if the URL is internal, false otherwise
 */
function isInternalUrl(url) {
  try {
    const parsed = new URL(url);
    return (
      parsed.protocol === INTERNAL_PROTOCOL &&
      (parsed.hostname === INTERNAL_HOST || parsed.hostname === '127.0.0.1') &&
      parsed.port === INTERNAL_PORT
    );
  } catch {
    // Malformed URLs are treated as external
    return false;
  }
}

module.exports = { isInternalUrl };
