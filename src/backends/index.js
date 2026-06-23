/**
 * Audio backend factory and resolver.
 *
 * Selects the appropriate AudioBackend implementation for the current platform
 * and validates that it can run. Used by the core application to obtain
 * a platform-specific backend without coupling to any specific implementation.
 *
 * Usage:
 *   import { resolveBackend } from './backends/index.js';
 *   const backend = resolveBackend();  // throws if no backend works
 *   const plan = backend.buildCapturePlan('mic', { sampleRate: '16000' });
 *
 * Or to get a specific backend (e.g., for testing):
 *   import { getBackend } from './backends/index.js';
 *   const backend = getBackend('pipewire');
 */

import { MacOSAudioBackend } from './macos.js';
import { PipeWireAudioBackend } from './pipewire.js';
import { WindowsAudioBackend } from './windows.js';

/**
 * All available backends, in priority order per platform.
 * On Linux, PipeWire takes priority; future backends (ALSA, PulseAudio-raw)
 * can be inserted here.
 */
const BACKENDS = [
  new MacOSAudioBackend(),
  new PipeWireAudioBackend(),
  new WindowsAudioBackend(),
];

/**
 * Platform → preferred backend mapping.
 * Used by resolveBackend() to pick the right one.
 */
const PLATFORM_PREFERENCE = {
  darwin: ['macos'],
  linux: ['pipewire'],
  win32: ['windows'],
};

/**
 * Get a backend by its platform identifier.
 * @param {string} platformId - One of 'macos', 'pipewire', 'windows'
 * @returns {import('./base.js').AudioBackend}
 * @throws {Error} If the platformId is unknown
 */
export function getBackend(platformId) {
  const backend = BACKENDS.find((b) => b.getPlatformId() === platformId);
  if (!backend) throw new Error(`Unknown audio backend: ${platformId}`);
  return backend;
}

/**
 * Resolve the best available backend for the current host.
 * Walks the platform preference list and returns the first backend
 * that reports isSupported() === true.
 * @returns {import('./base.js').AudioBackend}
 * @throws {Error} If no backend is available for the current platform
 */
export function resolveBackend() {
  const preferences = PLATFORM_PREFERENCE[process.platform];
  if (!preferences) {
    throw new Error(`Unsupported platform: ${process.platform}`);
  }

  for (const id of preferences) {
    const backend = getBackend(id);
    if (backend.isSupported()) return backend;
  }

  throw new Error(
    `No supported audio backend found for ${process.platform}. ` +
    `Tried: ${preferences.join(', ')}`
  );
}

/**
 * List all available backend identifiers.
 * @returns {string[]}
 */
export function listAvailableBackends() {
  return BACKENDS.filter((b) => b.isSupported()).map((b) => b.getPlatformId());
}

export { AudioBackend, NotImplementedError } from './base.js';
export { MacOSAudioBackend } from './macos.js';
export { PipeWireAudioBackend } from './pipewire.js';
export { WindowsAudioBackend } from './windows.js';
