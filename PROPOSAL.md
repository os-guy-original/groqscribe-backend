# Proposal: extract audio capture into swappable backends

## The problem

`buildCapturePlan()` in `cli/main.js` is a 35-line wall of `if (process.platform === ...)` that handles macOS, Linux, and Windows all at once. It's tangled with helpers like `resolveMacAudioDevice`, `getMacAudioDevices`, `maybeAutoInstallBlackHole` — all macOS-specific, all mixed in with platform-neutral logic.

Adding proper Linux support (PipeWire) the current way means piling more code into that function and its helpers. It's not a great spot to be in.

## What I did

I extracted the platform logic into a proper abstraction. Reference implementation in `src/backends/`:

```
AudioBackend (interface)
├── MacOSAudioBackend    → ScreenCaptureKit + AVFoundation
├── PipeWireAudioBackend → PipeWire via PulseAudio compat
└── WindowsAudioBackend  → dshow (skeleton)
```

Core usage is dead simple:

```js
const backend = resolveBackend();
const plan = backend.buildCapturePlan('system', options);
// → { command: 'ffmpeg', args: [...], label: 'system / @DEFAULT_MONITOR@' }
```

Same `{ command, args, label }` shape the spawn logic already expects. No breaking changes.

## Linux PipeWire

Most distros now ship PipeWire by default (Fedora 34+, Ubuntu 22.04+). Good thing is PipeWire-Pulse makes this seamless — existing PulseAudio ffmpeg commands just work:

- System: `ffmpeg -f pulse -i @DEFAULT_MONITOR@ ...` — captures whatever's playing
- Mic: `ffmpeg -f pulse -i default ...`

`pactl list short sources` gives us device listing. Monitor sources have predictable naming, so device cycling is straightforward.

## What I'm asking

- Does this structure look right before I implement PipeWire?
- After that: refactor MacOS into `MacOSAudioBackend`, then wire up `resolveBackend()` in main.js
