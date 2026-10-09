# Setlist

Starting pitches and a metronome for an a cappella choir, built to run on stage during a concert.

**Live app:** https://dffmonolith.github.io/setlist/

- Gives the group its starting pitches for each song from an embedded piano sample library, so once it's loaded it works with no internet connection.
- Steps through the concert's running order with one tap.
- The setlist (titles, keys, starting pitches, tempo) is plain delimited text. You can edit it in place or paste in a whole new one.
- Rehearsal Mode lays out the full diatonic scale for a song's key.
- Metronome (visual or audible) with large tap targets for adjusting tempo mid-performance.

Single self-contained HTML file in vanilla JS and the Web Audio API, with no build step and no dependencies. To use it offline, save `setlist.html` and open it in a browser.

More about the project: https://freezes.com/projects/setlist/
