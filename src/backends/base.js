/**
 * AudioBackend — abstract base class for platform-specific audio capture.
 *
 * Each backend encapsulates the full platform contract:
 *   - How to list audio devices
 *   - How to build the ffmpeg capture plan for mic / system audio
 *   - How to resolve the correct device for a given source
 *   - How to manage native helpers (build, extract, locate)
 *   - How to open OS-level privacy/access settings
 *   - How to cycle/select microphone devices
 *   - How to auto-setup virtual audio devices
 *
 * Concrete backends live in src/backends/<platform>.js and extend this class.
 * The backend factory (src/backends/index.js) selects the right one at runtime.
 */

/**
 * @typedef {Object} CapturePlan
 * @property {string} [command]  - Executable to spawn (defaults to 'ffmpeg')
 * @property {string[]} args     - Argument list for the capture command
 * @property {string} label      - Human-readable description (shown in TUI)
 */

/**
 * @typedef {Object} AudioDevice
 * @property {string} index - Device index or identifier
 * @property {string} name  - Human-readable device name
 */

/**
 * @typedef {'mic'|'system'} AudioSource
 */

export class AudioBackend {
  /** @returns {string} Platform identifier, e.g. 'macos', 'pipewire', 'windows' */
  getPlatformId() {
    throw new NotImplementedError(`${this.constructor.name}.getPlatformId()`);
  }

  /**
   * Runtime check: can this backend function on the current host?
   * Used by the factory to skip backends whose dependencies are missing.
   * @returns {boolean}
   */
  isSupported() {
    throw new NotImplementedError(`${this.constructor.name}.isSupported()`);
  }

  /**
   * List available audio devices on this platform.
   * @param {object} [options]
   * @param {string} [options.ffmpeg] - Path to ffmpeg binary
   * @returns {AudioDevice[]}
   */
  listDevices(options = {}) {
    throw new NotImplementedError(`${this.constructor.name}.listDevices()`);
  }

  /**
   * Build the ffmpeg (or native helper) invocation for the given source.
   * Returns a CapturePlan that the core passes directly to child_process.spawn().
   * @param {AudioSource} source - 'mic' or 'system'
   * @param {object} options - CLI flags / config
   * @param {string} [options.ffmpeg]       - Path to ffmpeg
   * @param {string} [options.device]       - Explicit device override
   * @param {string} [options.sampleRate]   - Sample rate (default 16000)
   * @param {string} [options.channels]     - Channel count (default 1)
   * @param {string} [options.systemBackend] - 'screencapturekit'|'virtual' (macOS)
   * @param {string} [options.inputArgs]    - Raw custom ffmpeg input args
   * @returns {CapturePlan}
   */
  buildCapturePlan(source, options = {}) {
    throw new NotImplementedError(`${this.constructor.name}.buildCapturePlan()`);
  }

  /**
   * Resolve the audio device name/identifier for a given source.
   * @param {AudioSource} source
   * @param {object} options - CLI flags / config
   * @param {string} [options.device] - Explicit device override
   * @returns {string} Device identifier suitable for the capture command
   */
  resolveDevice(source, options = {}) {
    throw new NotImplementedError(`${this.constructor.name}.resolveDevice()`);
  }

  /**
   * Ensure the native system-audio capture helper is available.
   * Returns the helper's binary path, or '' if not applicable/available.
   * @param {object} options
   * @param {string} options.projectRoot - Path to the project root
   * @param {string} options.configDir   - Global config dir (~/.config/groqscribe)
   * @param {boolean} [options.noBuildSystemHelper] - Skip auto-build
   * @param {string} [options.bundledHelperBase64]  - Embedded helper data
   * @param {string} [options.bundledHelperPlatform] - Embedded helper target platform
   * @param {string} [options.bundledHelperArch]    - Embedded helper target arch
   * @returns {string} Absolute path to the helper binary, or ''
   */
  ensureSystemAudioHelper(options = {}) {
    // Default: no native helper. Override in backends that need one (macOS).
    return '';
  }

  /**
   * Open the OS privacy/access settings panel.
   * @param {'microphone'|'screen'|string} errorKind - What permission is missing
   * @returns {{ opened: boolean, message: string }}
   */
  openAccessSettings(errorKind) {
    throw new NotImplementedError(`${this.constructor.name}.openAccessSettings()`);
  }

  /**
   * Get the list of available microphone devices for device cycling.
   * @param {object} [options]
   * @returns {AudioDevice[]}
   */
  getMicDevices(options = {}) {
    // Default: delegate to listDevices(). Override for platform-specific filtering.
    return this.listDevices(options);
  }

  /**
   * Pick a system-audio candidate device from the device list.
   * @param {AudioDevice[]} devices
   * @returns {AudioDevice|null}
   */
  pickSystemAudioDevice(devices) {
    throw new NotImplementedError(`${this.constructor.name}.pickSystemAudioDevice()`);
  }

  /**
   * Pick a microphone device from the device list.
   * @param {AudioDevice[]} devices
   * @returns {AudioDevice|null}
   */
  pickMicrophoneDevice(devices) {
    throw new NotImplementedError(`${this.constructor.name}.pickMicrophoneDevice()`);
  }

  /**
   * Attempt automatic setup of virtual audio routing for system audio capture.
   * Called when no system-audio device was found and auto-setup is enabled.
   * @returns {boolean} true if setup succeeded
   */
  autoSetupAudio() {
    // Default: no auto-setup available. Override in backends that support it.
    return false;
  }

  /**
   * Return the common ffmpeg output arguments for PCM s16le on stdout.
   * @param {object} options
   * @param {string} [options.sampleRate='16000']
   * @param {string} [options.channels='1']
   * @returns {string[]}
   */
  _commonOutput(options = {}) {
    const sampleRate = String(options.sampleRate || '16000');
    const channels = String(options.channels || '1');
    return ['-vn', '-acodec', 'pcm_s16le', '-ar', sampleRate, '-ac', channels, '-f', 's16le', 'pipe:1'];
  }
}

/**
 * Thrown by abstract methods that haven't been overridden yet.
 * Each backend's skeleton methods throw this until the real implementation lands.
 */
export class NotImplementedError extends Error {
  /** @param {string} [message] */
  constructor(message = 'Method not implemented') {
    super(message);
    this.name = 'NotImplementedError';
  }
}
