# Setlist

Starting pitches and a metronome for an a cappella choir, built to run on stage during a concert.

**Live app:** https://dffmonolith.github.io/setlist/

- Gives the group its starting pitches for each song from an embedded piano sample library, so once it's loaded it works with no internet connection.
- Steps through the concert's running order with one tap.
- Keeps several named setlists, one per concert. Pick one at the top of the screen; the newest concert built into the file becomes the current one when it first arrives.
- Each setlist (titles, keys, starting pitches, tempo) is plain delimited text. You can edit it in place or paste in a whole new one.
- Rehearsal Mode shows a three-octave piano keyboard for each song: the key's notes are bright and named, the tonic is outlined, dots mark the starting pitches, and every key plays, accidentals included.
- Metronome (visual or audible) with large tap targets for adjusting tempo mid-performance.

Single self-contained HTML file in vanilla JS and the Web Audio API, with no build step and no dependencies.

## Install on iPhone / iPad (works offline)

1. Open the live app in Safari while online.
2. Tap Share → **Add to Home Screen**.
3. Launch it from the home-screen icon once while still online. When "✓ offline ready" appears next to the version number, it's fully cached and will run with no connection.

On iOS 16.4+ the pitches play even with the Ring/Silent switch on.

Note: on iOS the home-screen app keeps its own storage, separate from Safari, so a setlist edited in Safari won't appear in the installed app (and vice versa). Copy it across with Edit Setlist → Paste/Copy Text.

You can still save `setlist.html` and open it directly as a file; it just won't get the home-screen install or auto-updates that way.

## Releasing a new version

Bump `CACHE_VERSION` in `sw.js` (and the version tag in `setlist.html`). To ship a new concert, add an entry with a new `id` to `BUILTIN_SETLISTS` in `setlist.html` (mark it `isDefault: true` to make it current when it arrives); changing an existing entry won't reach devices that already have it. Installed copies download the new version in the background and show an **update ready ↻** button; nothing switches over until someone taps it or fully closes and reopens the app, so an update never lands mid-concert.
