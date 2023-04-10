export const allActivities = [
  { verb: 'bicycle', icon: '🚲', active: true },
  { verb: 'climb', icon: '🧗🏽', active: true },
  { verb: 'golf', icon: '⛳️', active: true },
  { verb: 'hike', icon: '🥾', active: true },
  { verb: 'kayak', icon: '🛶', active: true },
  { verb: 'motorcycle', icon: '🏍', active: true },
  { verb: 'pickleball', icon: '🏓', active: true },
  { verb: 'picnic', icon: '🧺', active: true },
  { verb: 'run', icon: '🏃🏾', active: true },
  { verb: 'skateboard', icon: '🛹', active: true },
  { verb: 'swim', icon: '🏊🏽', active: true },
  { verb: 'tennis', icon: '🎾', active: true },
  { verb: 'walk', icon: '👟', active: true },
];

export function getVerbIcon(verb) {
  return allActivities.findBy((v) => v.verb === verb)?.icon || '';
}

export default function allowedVerbs() {
  return allActivities.filter((v) => v.active).map((v) => v.verb);
}
