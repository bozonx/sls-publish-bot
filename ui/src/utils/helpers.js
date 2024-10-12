import yaml from "js-yaml";

export function parseYaml(str) {
  return yaml.load(str);
}

// export function resolveSocialMediaId(sm) {
//   return sm.id || sm.use;
// }

// export function resolveSmTypes(sm) {
//   return sm.types || SOCIAL_MEDIA_PARAMS[sm.use].types;
// }

// export function replaceLineBreak() { }

export function runTemplate(tmpl, data) {
  return useTemplate(tmpl)(data);
}

// export function getItemConf(item) {
//   const parsed = JSON.parse(item.cfg);
//
//   return {
//     ...parsed,
//     yaml: parseYaml(parsed.yaml),
//   };
// }

export function extractTitleFromMd(mdWithoutFrontmatter) {
  const firstTitleMatch = mdWithoutFrontmatter.trim().match(/^\#\s+(.+)$/m);

  return firstTitleMatch ? firstTitleMatch[1].trim() : "";
}

export function isInsideTgBot() {
  return Boolean(window.Telegram?.WebApp.initData);
}

export function makeTgAuthHeaders() {
  if (!isInsideTgBot()) return {};

  return {
    Authorization: `Bearer ${window.Telegram.WebApp.initData}`,
  };
}

export function makeSnName(sn) {
  if (sn.name) {
    return `${sn.name} (${sn.type})`;
  }

  return sn.type;
}

// export function removeFrontmatter(rawMd) {
//   const frontmatterRegex = /^---\n([\s\S]*?)\n---/
//
//   return rawMd.replace(frontmatterRegex, '')
// }
