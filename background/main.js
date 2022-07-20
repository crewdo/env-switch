var XM_LOCAL_DOMAIN = 'xm.localhost';
var XM_DEV_DOMAIN = 'dev-admin.eber.co';
var XM_LIVE_DOMAIN = 'xm.eber.co';

var APP_LOCAL_DOMAIN = 'yummypin.igift.localhost';
var APP_DEV_DOMAIN = 'yummypin.igift.co';
var APP_LIVE_DOMAIN = 'printskitchen.eber.co';

function openIn(info, target, currentDomain, currentHref) {
    let url;
    let linkToOpen = info.linkUrl || currentHref
    switch (currentDomain) {
        case XM_LOCAL_DOMAIN:
        case XM_DEV_DOMAIN:
        case XM_LIVE_DOMAIN: {
            url = xmGenerateURL(linkToOpen, target)
            break;
        }
        case APP_LOCAL_DOMAIN:
        case APP_DEV_DOMAIN:
        case APP_LIVE_DOMAIN: {
            url = appGenerateURL(linkToOpen, target)
            break;
        }
    }

    chrome.tabs.create({
        url: url.replace('https://', 'http://')
    });
}

function appGenerateURL(linkToOpen, target) {
    var urlToReplace = (new URL(linkToOpen));
    switch (target) {
        case 'LOCAL':
            urlToReplace.hostname = APP_LOCAL_DOMAIN;
            return urlToReplace.toString();
        case 'DEV':
            urlToReplace.hostname = APP_DEV_DOMAIN;
            return urlToReplace.toString();
        case 'LIVE': {
            urlToReplace.hostname = APP_LIVE_DOMAIN;
            return urlToReplace.toString();
        }
    }
}

function xmGenerateURL(linkToOpen, target) {
    var urlToReplace = (new URL(linkToOpen));
    switch (target) {
        case 'LOCAL':
            urlToReplace.hostname = XM_LOCAL_DOMAIN;
            return urlToReplace.toString();
        case 'DEV':
            urlToReplace.hostname = XM_DEV_DOMAIN;
            return urlToReplace.toString();
        case 'LIVE': {
            urlToReplace.hostname = XM_LIVE_DOMAIN;
            return urlToReplace.toString();
        }
    }
}

function bindingContextMenu(url) {

    let parsedUrl = '';

    try {
        parsedUrl = new URL(url);
    } catch (e) {
        return;
    }

    var currentDomain = parsedUrl.hostname;
    if ([XM_LOCAL_DOMAIN, XM_DEV_DOMAIN, XM_LIVE_DOMAIN, APP_LOCAL_DOMAIN, APP_DEV_DOMAIN, APP_LIVE_DOMAIN].indexOf(currentDomain) === -1) return;
    var currentHref = parsedUrl.href;

    if (currentDomain !== XM_LOCAL_DOMAIN && currentDomain !== APP_LOCAL_DOMAIN) {
        chrome.contextMenus.create({
            title: "Open in LOCAL",
            contexts: ["all"],
            onclick: function (info) {
                openIn(info, 'LOCAL', currentDomain, currentHref)
            }
        });

    }
    if (currentDomain !== XM_DEV_DOMAIN && currentDomain !== APP_DEV_DOMAIN) {
        chrome.contextMenus.create({
            title: "Open in DEV",
            contexts: ["all"],
            onclick: function (info) {
                openIn(info, 'DEV', currentDomain, currentHref)
            }
        });
    }

    if (currentDomain !== XM_LIVE_DOMAIN && currentDomain !== APP_LIVE_DOMAIN) {
        chrome.contextMenus.create({
            title: "Open in LIVE",
            contexts: ["all"],
            onclick: function (info) {
                openIn(info, 'LIVE', currentDomain, currentHref)
            }
        });
    }
}


function getCurrentTabUrl(callback) {

    chrome.contextMenus.removeAll();

    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        let tab = tabs[0];
        callback(tab.url);
    });
}

chrome.tabs.onActivated.addListener(function () {
    getCurrentTabUrl(function (url) {
        bindingContextMenu(url);
    });
});

chrome.tabs.onUpdated.addListener(function () {
    getCurrentTabUrl(function (url) {
        bindingContextMenu(url);
    });
});