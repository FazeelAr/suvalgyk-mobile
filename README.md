# Suvalgyk Mobile

Clean Expo SDK 54-compatible mobile app for remote device testing through Expo Go.

## Requirements

- Node.js 18+ recommended
- Expo Go installed on your phone for remote testing

## Install

```bash
npm install
```

## Run locally

```bash
npm run start
```

## Run with tunnel mode

Preferred:

```bash
npm run tunnel
```

Windows fallback if npm shim behavior is inconsistent:

```bash
npm run tunnel:direct
```

## What it does

- Shows the text: `Hello this is my first app`
- Shows a `Show Greeting` button
- Opens a popup alert when the button is pressed

## Notes

- The app is pinned to an Expo SDK 54-compatible dependency set.
- `@expo/ngrok` is included for tunnel testing.
- If Expo asks for a QR connection, use Expo Go on the remote device and scan the tunnel QR code.
