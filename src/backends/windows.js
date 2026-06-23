/**
 * Windows audio backend for groqscribe.
 *
 * Capture strategies:
 *   - System audio: dshow with Stereo Mix / VB-Cable / virtual audio device
 *   - Microphone:   dshow with Microphone device
 *
 * Status: SKELETON — methods throw NotImplementedError until real implementation lands.
 */

import { AudioBackend, NotImplementedError } from './base.js';

export class WindowsAudioBackend extends AudioBackend {
  getPlatformId() {
    return 'windows';
  }

  isSupported() {
    return process.platform === 'win32';
  }

  /**
   * List DirectShow audio devices via ffmpeg.
   * @override
   */
  listDevices(options = {}) {
    throw new NotImplementedError('WindowsAudioBackend.listDevices()');
  }

  /**
   * Build capture plan using ffmpeg's dshow input:
   *   - system → `-f dshow -i audio=Stereo Mix`
   *   - mic    → `-f dshow -i audio=Microphone`
   * @override
   */
  buildCapturePlan(source, options = {}) {
    throw new NotImplementedError('WindowsAudioBackend.buildCapturePlan()');
  }

  /**
   * Resolve the DirectShow device name for the given source.
   * @override
   */
  resolveDevice(source, options = {}) {
    throw new NotImplementedError('WindowsAudioBackend.resolveDevice()');
  }

  /**
   * Windows does not use a native helper binary.
   * Always returns ''.
   * @override
   */
  ensureSystemAudioHelper() {
    return '';
  }

  /**
   * Open Windows microphone privacy settings.
   * @override
   */
  openAccessSettings(errorKind) {
    throw new NotImplementedError('WindowsAudioBackend.openAccessSettings()');
  }

  /**
   * Get microphone devices via dshow.
   * @override
   */
  getMicDevices(options = {}) {
    throw new NotImplementedError('WindowsAudioBackend.getMicDevices()');
  }

  /**
   * Pick a virtual/loopback device for system audio capture.
   * @override
   */
  pickSystemAudioDevice(devices) {
    throw new NotImplementedError('WindowsAudioBackend.pickSystemAudioDevice()');
  }

  /**
   * Pick a microphone device from dshow list.
   * @override
   */
  pickMicrophoneDevice(devices) {
    throw new NotImplementedError('WindowsAudioBackend.pickMicrophoneDevice()');
  }

  /**
   * No auto-setup for Windows virtual audio devices.
   * @override
   */
  autoSetupAudio() {
    return false;
  }
}
