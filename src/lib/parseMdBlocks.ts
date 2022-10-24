import {MdBlock} from 'notion-to-md/build/types';
import Sections from '../types/Sections';
import {PUBLICATION_TYPES} from '../types/consts';


export function parseSections(properties: Record<string, any>, mdBlocks: MdBlock[]): Sections {
  return {
    Type: properties.Type?.select?.name,
    Header: properties.Header?.title[0]?.text?.content,
    MainImageDescr: properties.MainImageDescr.rich_text[0].text.content,
    TgTags: properties.TgTags.multi_select.map((item: {name: string}) => item.name),
    InstaPostTags: properties.InstaPostTags.multi_select.map((item: {name: string}) => item.name),
    // TODO: parse to MD
    PostText: properties.PostText.rich_text,
    ArticleText: mdBlocks,
    // TODO: add MainImage
  };
}

export function checkSection(sections: Sections) {
  if (!sections.Type) throw new Error(`No type`);
  if (!sections.Header) throw new Error(`No header`);

  if (sections.Type === PUBLICATION_TYPES.Article) {
    if (!sections.ArticleText?.length) throw new Error(`No article text`);
    // TODO: check image
    // TODO: check image descr
  }
  else if (sections.Type === PUBLICATION_TYPES.Post1000) {
    if (!sections.PostText?.length) throw new Error(`No article text`);
  }
  else if (sections.Type === PUBLICATION_TYPES.Story) {
    // TODO: check image
  }

}

export function makeSectionsInfo(sections: Sections): string {
  return ''
    + `Type: ${sections.Type}\n`
    + `Header: ${sections.Header}`
    + `MainImageDescr: ${sections.MainImageDescr}`
    + `TgTags: ${makeTags(sections.TgTags)}`
    + `InstaPostTags: ${makeTags(sections.InstaPostTags)}`
    + `ArticleText block count: ${sections.ArticleText?.length}`;
  // TODO: add PostText
  // TODO: add MainImage
}

export function makeTags(tags: string[] = []): string {
  return tags.map((item: string) => `#${item}`).join(' ');
}

export function makePostForTg(): string {
  return '';
}

export function makePostForZen() {

}

export function makePostForInsta() {

}
