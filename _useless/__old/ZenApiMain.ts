import axios from 'axios';

export default class ZenApiMain {
  constructor() {
  }

  async test() {
    const result = await axios.post('', {

    });

    // https://dzen.ru/editor-api/v2/update-publication-content-and-publish?publisherId=634a3f1afdba2914ab29b55a&clientRid=268eaec0a9cca2&clid=320
    // post

    /*
Accept: application/json
Accept-Encoding: gzip, deflate, br
Accept-Language: en-US,en;q=0.9
Connection: keep-alive
Content-Length: 4942
Content-Type: application/json
Cookie: sso_checked=1; yandexuid=7588708171661585443; sso_status=sso.passport.yandex.ru:synchronized; _yasc=LHvtVn14KyxQu7oxPc5X899MPZfNoSTeDG1aQAUzNS5C1kIwwI0nzZp+ORwA; Session_id=3:1667066041.5.0.1667066041014:6UqMlQ:18E.1.2:1|1700503735.0.2|64:10004840.567670.2GVLQyQWakikE0Fnqwweipa_z-Q; yandex_login=svobzhi; ys=c_chck.1297142282#udn.cDpzdm9iemhp; mda2_beacon=1667066041022; gdpr=0; _ym_uid=1667066046889914075; _ym_d=1667066046; tmr_lvid=2d8ebfd53c984207f0c42980a4d4511f; tmr_lvidTS=1667066045723; vid=4a01d744e2211ab4; _ym_isad=2; tmr_detect=0%7C1667066048168; tmr_reqNum=4; editor-mention-times-shown=1
Host: dzen.ru
Origin: https://dzen.ru
Referer: https://dzen.ru/profile/editor/svobzhi?briefEditorPublicationId=635d68dd820b6c25f64a731d
sec-ch-ua: " Not A;Brand";v="99", "Chromium";v="104"
sec-ch-ua-mobile: ?0
sec-ch-ua-platform: "Linux"
Sec-Fetch-Dest: empty
Sec-Fetch-Mode: cors
Sec-Fetch-Site: same-origin
User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/104.0.5112.79 Safari/537.36
X-Csrf-Token: 3bf1fd47ec3be42ad72765397bea052709e15756:1667066076087
X-FP-Token: 18424e188fe:141749c08906bf41:655ba0b7:d0609568bed1e097fd8aeff7c95016513cac424b
     */

/*
{"id":"635d68dd820b6c25f64a731d","preview":{"title":"","snippet":"","galleryPreviewImages":[],"totalSlidesCount":0},"snippetFrozen":true,"hasNativeAds":false,"delayedPublicationFlagState":"on","requestedPublishTime":"2022-10-29T20:00:00.000Z","visibleComments":"subscribe-visible","visibilityType":"all","articleContent":{"contentState":"{\"gallery\":{\"ratio\":\"ratio-4x3\",\"baseRatio\":\"ratio-4x3\",\"items\":[]},\"content\":\"{\\\"blocks\\\":[{\\\"data\\\":{},\\\"depth\\\":0,\\\"key\\\":\\\"4hvtp\\\",\\\"type\\\":\\\"unstyled\\\",\\\"text\\\":\\\"аааа\\\",\\\"entityRanges\\\":[],\\\"inlineStyleRanges\\\":[]},{\\\"data\\\":{},\\\"depth\\\":0,\\\"key\\\":\\\"bo2j9\\\",\\\"type\\\":\\\"unstyled\\\",\\\"text\\\":\\\"\\\",\\\"entityRanges\\\":[],\\\"inlineStyleRanges\\\":[]},{\\\"data\\\":{},\\\"depth\\\":0,\\\"key\\\":\\\"5h7jh\\\",\\\"type\\\":\\\"unstyled\\\",\\\"text\\\":\\\"пппп\\\",\\\"entityRanges\\\":[],\\\"inlineStyleRanges\\\":[]}],\\\"entityMap\\\":{}}\"}"},"darkPost":false,"tagsInput":{"tags":[],"detectedTagsShown":false,"embeddedTags":[]},"fp":"{\"f\":\"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;1\",\"pgrdt\":\"YPJkTMEV0f+DsKCLXPEqyRvk3V4=;2\",\"pgrd\":\"1FMmf61NIO4fyd728QUbkgu6tiFsRXUJQJ3BfHwbE0yv9EPx5lGoDcSEoUPPdtcTjbkVFeWWbQMVUZ89fU15akkejRTPCwjFTEGrixy7dawRKpt2R66cVba/9cCE9om2E8IemZa6/W0ULH9111QJRs0q09HuVbIfqkN9wwsG2YcSaJEBuleNSf6kqT4iF4tEfVRWFLGVu6gp2gj0cblAzKs2mzk=\"}"}
 */

    console.log(result)
  }
}