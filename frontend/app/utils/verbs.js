export const verb_icons = {
  run: '🏃🏽',
  hike: '🥾',
  bicycle: '🚲',
  swim: '🏊🏽',
  kayak: '🛶',
  climb: '🧗🏽',
  motorcycle: '🏍',
  sunbathe: '👙',
};

export default function allowedVerbs() {
  return Object.keys(verb_icons);
}
