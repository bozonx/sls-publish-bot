---
title: Post 1
urlName: post-1
type: article
descr: some little description
timeCodes: |
  00:00 Начало

#images:
#  - ./img.avif
sns:
  - telegram
  - dzen
  - youtube
  - spotifyForPodcasters
  - mave
  - site
common:
  template: ''
  contentLinks: |
    * [some link](https://ya.ru)
  tags:
    - tag1
    - tag2
  postFooter: common footer
  pubDateTime: 2023-11-10T13:00Z
tg:
  preview: true
  urlButton: https://ya.ru
  autoRemove: 2023-11-14
  footer: 'custom fuuter string\n${TAGS}'
  pubDateTime: 2023-11-10T13:00Z
youtube:
  template: '${DESCR}\n\n${TIME_CODES}\n\n${LINKS}\n${FOOTER}\n\n${TAGS}'
  contentLinks: |
    * [some link](https://ya.ru)
  tags:
    - '!COMON!'
    - someyoutubetag
  footer: 'yt footer'
  pubDateTime: 2023-11-10T13:00Z
---

# md header

some md file
