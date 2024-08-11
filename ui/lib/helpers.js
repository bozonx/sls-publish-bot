import yaml from "js-yaml";

export function parseYaml(str) {
  return yaml.load(str);
}

export function resolveSocialMediaId(sm) {
  return sm.id || sm.use;
}
