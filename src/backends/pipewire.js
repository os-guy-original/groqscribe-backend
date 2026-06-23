/**
 * Linux PipeWire audio backend for groqscribe.
 *
 * PipeWire is the modern Linux audio/video stream manager that replaces
 * both PulseAudio and JACK. Most modern desktop Linux distributions
 * (Fedora 34+, Ubuntu 22.04+, Arch) ship PipeWire as the default audio server,
 * with a PulseAudio-compatible layer (PipeWire-Pulse) and a JACK-compatible
 * layer (PipeWire-JACK).
 *
 * Capture strategies:
 *   - System audio: PipeWire monitor source via ffmpeg's pulse/libpulse input
 *     (PipeWire-Pulse provides PulseAudio compatibility). The monitor source
 *     captures the mixed output of all audio sinks.
 *   - Microphone: PipeWire source device via ffmpeg's pulse/libpulse input
 *
 * Device names follow PulseAudio conventions since PipeWire-Pulse translates
 * them transparently:
 *   - System:  `@DEFAULT_MONITOR@`  (default sink's monitor)
 *   - Mic:     `default`            (default source) or explicit source name
 *
 * External CLI tools for device enumeration:
 *   - `pactl list short sources`   — list PulseAudio-compatible sources
 *   - `wpctl status`               — WirePlumber (PipeWire session manager) status
 *   - `pw-cli list-objects`        — low-level PipeWire object listing
 *
 * Status: SKELETON — methods throw NotImplementedError until real implementation lands.
 *
 * Future considerations:
 *   - Direct PipeWire native API via Node FFI (optional, for zero-copy capture)
 *   - WirePlumber API for policy-based device selection
 *   - wpctl-based device enumeration (cleaner output than pactl)
 */

import { AudioBackend, NotImplementedError } from './base.js';

export class PipeWireAudioBackend extends AudioBackend {
  getPlatformId() {
    return 'pipewire';
  }

  /**
   * Check if PipeWire is available on this Linux host.
   * Looks for pipewire/pipewire-pulse processes or socket.
   * @override
   */
  isSupported() {
    throw new NotImplementedError('PipeWireAudioBackend.isSupported()');
  }

  /**
   * List PipeWire source devices using pactl (PulseAudio-compat API).
   * Returns both capture sources and monitor sources.
   * @override
   */
  listDevices(options = {}) {
    throw new NotImplementedError('PipeWireAudioBackend.listDevices()');
  }

  /**
   * Build capture plan using ffmpeg's pulse input:
   *   - system → `-f pulse -i @DEFAULT_MONITOR@`
   *   - mic    → `-f pulse -i default` (or explicit source name)
   * @override
   */
  buildCapturePlan(source, options = {}) {
    throw new NotImplementedError('PipeWireAudioBackend.buildCapturePlan()');
  }

  /**
   * Resolve the PipeWire source device name.
   *   - system → `@DEFAULT_MONITOR@` (or explicit monitor name)
   *   - mic    → `default` (or explicit source name)
   * @override
   */
  resolveDevice(source, options = {}) {
    throw new NotImplementedError('PipeWireAudioBackend.resolveDevice()');
  }

  /**
   * PipeWire does not use a native helper binary.
   * Always returns ''.
   * @override
   */
  ensureSystemAudioHelper() {
    return '';
  }

  /**
   * Linux has no equivalent of macOS System Settings → Privacy.
   * PipeWire access control is handled via the session manager / PolicyKit.
   * @override
   */
  openAccessSettings(errorKind) {
    throw new NotImplementedError('PipeWireAudioBackend.openAccessSettings()');
  }

  /**
   * Get microphone devices from PipeWire source list.
   * @override
   */
  getMicDevices(options = {}) {
    throw new NotImplementedError('PipeWireAudioBackend.getMicDevices()');
  }

  /**
   * Pick a monitor source for system audio capture.
   * Monitor sources in PipeWire correspond to audio sink outputs.
   * @override
   */
  pickSystemAudioDevice(devices) {
    throw new NotImplementedError('PipeWireAudioBackend.pickSystemAudioDevice()');
  }

  /**
   * Pick a non-monitor source (microphone).
   * @override
   */
  pickMicrophoneDevice(devices) {
    throw new NotImplementedError('PipeWireAudioBackend.pickMicrophoneDevice()');
  }

  /**
   * No auto-setup for PipeWire — it should be pre-installed on modern distros.
   * @override
   */
  autoSetupAudio() {
    return false;
  }
}
