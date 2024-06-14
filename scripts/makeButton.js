function getJson(url, callback) {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', url,false);
    xhr.responseType = 'json';
    xhr.onload = function() {
        let status = xhr.status;
        if (status === 200) {
            callback(null,xhr.response);
        }
        else {
            callback(ststus, xhr.response);
        }
    };
    xhr.send();
}

function makeButton(injectionPoint, channelIdStr) {
    const channelIdStr_rev = channelIdStr.slice(0,24).replace("UC","UU");
    const playlistURL = `https://youtube.com/playlist?list=${channelIdStr_rev}&playnext=1&index=1`;
    const buttonHtml = `<a id="playAllBtn" class="yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m" aria-label="채널 동영상 모두 재생" title="" href="${playlistURL}" rel="nofollow" target="" force-new-state="true" style=""><div class="yt-spec-button-shape-next__button-text-content"><span class="yt-core-attributed-string yt-core-attributed-string--white-space-no-wrap" role="text">채널 동영상 모두 재생</span></div><yt-touch-feedback-shape style="border-radius: inherit;"><div class="yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response" aria-hidden="true"><div class="yt-spec-touch-feedback-shape__stroke" style=""></div><div class="yt-spec-touch-feedback-shape__fill" style=""></div></div></yt-touch-feedback-shape></a>`;
    injectionPoint.outerHTML = `<yt-tab-shape class="yt-tab-shape-wiz" role="tab" tabindex="0"><div>${buttonHtml}</div></yt-tab-shape>${injectionPoint.outerHTML}`;
}

console.log(`모두재생버튼 작동: ${location.href}`);
var makeButtonRoutine = setInterval(() => {
    console.log('작동시작');
    var matches = /^https?:\/\/(www\.)?youtube\.com\/\@/;
    if (matches.test(location.href)) {
        if (document.getElementById('playAllBtn') == null) {
            console.log('버튼생성');
            let injectionPointNode = document.getElementsByClassName('yt-tab-shape-wiz__tab--last-tab');
            if (injectionPointNode != undefined) {
                let injectionPoint = injectionPointNode[0];
                let contentInnerHTML = document.body.innerHTML;
                const delimeters = ['channel_id=']
                for (const delimeter of delimeters) {
                    let found = contentInnerHTML.split(delimeter)[1]
                    if (found != undefined) {
                        makeButton(injectionPoint,found);
                        return;
                    }
                    else {
                        // channel id not found in the document then use API call
                        const channelHandle = location.href.split('@|\?')[1];
                        const eliKey = 'AIzaSyCBiI-dINc8jDhwxuUKrs9u99V025vTdGQ';
                        const queryStr = `https://youtube.googleapis.com/youtube/v3/search?part=id&maxResults=10&q=${channelHandle}&type=channel&maxResults=1&key=${eliKey}`;
                        getJson(queryStr, (err, jsonData) => {
                            if (err !== null) {
                                console.log(`PlayAllbutton API Error: ${err}`);
                                return;
                            }
                            else {
                                const channelIdStr = jsonData.items[0].id.channelId;
                                makeButton(injectionPoint,channelIdStr);
                                return;
                            }
                        });
                    }
                }
            }
        }
        else {
            console.log('버튼생성완료');
            clearInterval(makeButtonRoutine);
        }
    }
    else {
        console.log(location.href);
    }
}, 1500);