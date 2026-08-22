export const cmsContent = globalThis.__TA_CMS_CONTENT__ || {};

const isObject = (value) => value && typeof value === "object" && !Array.isArray(value);

export function mergeCmsObject(target, source) {
  if (!isObject(source)) return target;
  for (const [key, value] of Object.entries(source)) {
    if (value === undefined) continue;
    if (isObject(value) && isObject(target[key])) mergeCmsObject(target[key], value);
    else target[key] = value;
  }
  return target;
}

export function replaceFromCms(target, source) {
  if (!Array.isArray(source) || source.length === 0) return target;
  target.splice(0, target.length, ...source);
  return target;
}

export function replaceTeamsFromCms(target, source) {
  if (!Array.isArray(source) || source.length === 0) return target;
  const fallback = { ...target };
  for (const key of Object.keys(target)) delete target[key];
  for (const team of source) target[team.year] = team;
  for (const [year, team] of Object.entries(fallback)) {
    if (!target[year]) target[year] = team;
  }
  return target;
}
