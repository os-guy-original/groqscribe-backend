/**
 * macOS audio backend for groqscribe.
 *
 * Capture strategies:
 *   - System audio: ScreenCaptureKit native helper (Swift) or virtual device (BlackHole)
 *   - Microphone: AVFoundation via ffmpeg
 *
 * Status: SKELETON — methods throw NotImplementedError until real implementation lands.
 */

import { AudioBackend, NotImplementedError } from './base.js';

export class MacOSAudioBackend extends AudioBackend {
  getPlatformId() {
    return 'macos';
  }

  isSupported() {
    return process.platform === 'darwin';
  }

  /**
   * List AVFoundation audio devices via ffmpeg.
   * @override
   */
  listDevices(options = {}) {
    throw new NotImplementedError('MacOSAudioBackend.listDevices()');
  }

  /**
   * Build capture plan:
   *   - system + screencapturekit → spawn native helper directly
   *   - system + virtual → AVFoundation with BlackHole device
   *   - mic → AVFoundation with resolved device
   * @override
   */
  buildCapturePlan(source, options = {}) {
    throw new NotImplementedError('MacOSAudioBackend.buildCapturePlan()');
  }

  /**
   * Resolve the AVFoundation device for the given source.
   * Uses the :index format expected by ffmpeg's avfoundation input.
   * @override
   */
  resolveDevice(source, options = {}) {
    throw new NotImplementedError('MacOSAudioBackend.resolveDevice()');
  }

  /**
   * Build or extract the ScreenCaptureKit system-audio capture helper.
   * @override
   */
  ensureSystemAudioHelper(options = {}) {
    throw new NotImplementedError('MacOSAudioBackend.ensureSystemAudioHelper()');
  }

  /**
   * Open macOS System Settings → Privacy pane.
   * @override
   */
  openAccessSettings(errorKind) {
    throw new NotImplementedError('MacOSAudioBackend.openAccessSettings()');
  }

  /**
   * Get mic devices, filtering out virtual/loopback devices.
   * @override
   */
  getMicDevices(options = {}) {
    throw new NotImplementedError('MacOSAudioBackend.getMicDevices()');
  }

  /**
   * Pick a virtual/loopback device for system audio capture.
   * @override
   */
  pickSystemAudioDevice(devices) {
    throw new NotImplementedError('MacOSAudioBackend.pickSystemAudioDevice()');
  }

  /**
   * Pick a non-virtual microphone device.
   * @override
   */
  pickMicrophoneDevice(devices) {
    throw new NotImplementedError('MacOSAudioBackend.pickMicrophoneDevice()');
  }

  /**
   * Auto-install BlackHole 2ch via Homebrew for virtual system audio capture.
   * @override
   */
  autoSetupAudio() {
    throw new NotImplementedError('MacOSAudioBackend.autoSetupAudio()');
  }
}
