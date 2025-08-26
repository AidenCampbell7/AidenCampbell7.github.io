// Music App Demo logic
// This script simulates a playlist where clicking a play button
// starts a faux playback and updates a progress bar. No audio is
// streamed—this is purely for UI demonstration purposes.

document.addEventListener('DOMContentLoaded', () => {
  const tracks = [
    { title: 'Inspiring Journey', duration: 30 },
    { title: 'Calm Tech Vibes', duration: 30 },
    { title: 'Future Groove', duration: 30 }
  ];
  const trackListEl = document.getElementById('trackList');
  const nowPlayingEl = document.getElementById('nowPlaying');
  const progressEl = document.getElementById('progress');
  let playbackTimer = null;

  function renderTracks() {
    tracks.forEach((track, index) => {
      const li = document.createElement('li');
      const titleSpan = document.createElement('span');
      titleSpan.textContent = track.title;
      const button = document.createElement('button');
      button.textContent = 'Play';
      button.dataset.index = index;
      li.appendChild(titleSpan);
      li.appendChild(button);
      trackListEl.appendChild(li);
    });
  }

  function playTrack(index) {
    // Stop any existing playback
    if (playbackTimer) {
      clearInterval(playbackTimer);
    }
    const track = tracks[index];
    nowPlayingEl.textContent = `Now playing: ${track.title}`;
    let elapsed = 0;
    progressEl.style.width = '0%';
    playbackTimer = setInterval(() => {
      elapsed++;
      const percent = (elapsed / track.duration) * 100;
      progressEl.style.width = Math.min(percent, 100) + '%';
      if (elapsed >= track.duration) {
        clearInterval(playbackTimer);
        nowPlayingEl.textContent = `Finished: ${track.title}. Select another track.`;
      }
    }, 1000);
  }

  // Handle click on play buttons via event delegation
  document.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON' && e.target.dataset.index) {
      playTrack(parseInt(e.target.dataset.index, 10));
    }
  });

  renderTracks();
});