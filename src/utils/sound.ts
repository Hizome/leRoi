type MoveSoundName = "move" | "capture";

const soundBasePath = "/assets/sound";
const throttleMs = 100;
const volume = 0.7;
const sounds = new Map<MoveSoundName, HTMLAudioElement>();
let lastMoveSoundAt = 0;

function soundSources(name: MoveSoundName) {
  return [
    `${soundBasePath}/ogg/system/shogi/${name}.ogg`,
    `${soundBasePath}/mp3/system/shogi/${name}.mp3`,
  ];
}

function loadMoveSound(name: MoveSoundName) {
  const cached = sounds.get(name);
  if (cached) return cached;

  const audio = new Audio();
  audio.preload = "auto";
  audio.volume = volume;
  audio.src = soundSources(name)[0];

  sounds.set(name, audio);
  return audio;
}

export function preloadShogiMoveSounds() {
  loadMoveSound("move");
  loadMoveSound("capture");
}

export function playShogiMoveSound(capture = false) {
  const now = window.performance.now();
  if (now - lastMoveSoundAt < throttleMs) return;
  lastMoveSoundAt = now;

  const sound = loadMoveSound(capture ? "capture" : "move");
  sound.currentTime = 0;
  void sound.play().catch(() => {
    const fallback = new Audio(soundSources(capture ? "capture" : "move")[1]);
    fallback.volume = volume;
    void fallback.play().catch(() => undefined);
  });
}
