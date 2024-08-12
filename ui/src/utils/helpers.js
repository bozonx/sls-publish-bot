import yaml from "js-yaml";
// import { SOCIAL_MEDIA_PARAMS } from "./constants.js";

export function parseYaml(str) {
  return yaml.load(str);
}

export function resolveSocialMediaId(sm) {
  return sm.id || sm.use;
}

export function resolveSmTypes(sm) {
  return sm.types || SOCIAL_MEDIA_PARAMS[sm.use].types;
}

export function getBlogConf(blogId) {
  const userConfig = useState("userConfig");

  return userConfig.value.blogs.find((item) => item.id === blogId);
}
