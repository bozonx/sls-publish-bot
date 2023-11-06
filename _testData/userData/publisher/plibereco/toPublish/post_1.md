---
title: Post 1
urlName: post-1
type: article
descr: some little description
timeCodes: |
  00:00 Начало

#images:
#  - ./img.avif
common:
  postTemplate: ''
  articleTemplate: ''
  contentLinks: |
    * [some link](https://ya.ru)
  tags:
    - tag1
    - tag2
  postFooter: common post footer
  articleFooter: common article footer
  pubDateTime: 2023-11-10T13:00Z
telegram:
  preview: true
  urlButton: https://ya.ru
  autoRemove: 2023-11-14

  tags:
    - '!COMON!'
    - somethtag
  postTemplate: '${DESCR}\n\n${TIME_CODES}\n\n${LINKS}\n${FOOTER}\n\n${TAGS}'
  articleTemplate: '${DESCR}\n\n${TIME_CODES}\n\n${LINKS}\n${FOOTER}\n\n${TAGS}'
  contentLinks: |
    * [some link](https://ya.ru)
  postFooter: 'post footer\n${TAGS}'
  articleFooter: 'article footer\n${TAGS}'
  pubDateTime: 2023-11-10T13:00Z
youtube:
  template: '${DESCR}\n\n${TIME_CODES}\n\n${LINKS}\n${FOOTER}\n\n${TAGS}'
  contentLinks: |
    * [some link](https://ya.ru)
  tags:
    - '!COMON!'
    - someyoutubetag
  postFooter: 'yt footer'
  pubDateTime: 2023-11-10T13:00Z
podcast:
  template: '<p>${DESCR}</p><p><br /></p><p>${TIME_CODES}</p><p><br /></p><p>${LINKS}${FOOTER}</p><p><br /></p><p>${TAGS}</p>'
  contentLinks: |
    * [some link](https://ya.ru)
  tags:
    - '!COMON!'
    - somepodcasttag
  footer: 'podcast footer'
  pubDateTime: 2023-11-10T13:00Z
dzen:
  template: '${CONTENT}\n\n${FOOTER}'
  footer: 'dzen footer'
  pubDateTime: 2023-11-10T13:00Z
---

# md header

some md file
