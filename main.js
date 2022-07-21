let envMappings = [
    {
        platform: 'xm',
        urls: [
            // {
            //     value: 'xm.localhost', env: 'local'
            // },
            {
                value: 'dev-admin.eber.co', env: 'dev'
            },
            {
                value: 'dev-admin-new.eber.co', env: 'dev_new'
            },
            {
                value: 'xm.eber.co', env: 'live'
            }
        ]
    },
    {
        platform: 'app',
        urls: [
            // {
            //     value: 'yummypin.igift.localhost', env: 'local'
            // },
            {
                value: 'yummypin.igift.co', env: 'dev'
            },
            {
                value: 'yummypin.eber.co', env: 'dev_new'
            },
            {
                value: 'printskitchen.eber.co', env: 'live'
            }
        ]
    }
];

function createContextMenus(url) {

    let parsedUrl = '';

    try {
        parsedUrl = new URL(url);
    } catch (e) {
        return;
    }

    let currentHostName = parsedUrl.hostname;
    let currentHref = parsedUrl.href;
    let currentEnv = '';
    let currentPlatform = '';

    let currentMapped = envMappings.filter(function (e) {
        return e.urls.some(function (t) {
            if (t.value === currentHostName) {
                currentEnv = t.env;
                return true;
            }
        });
    });

    if (currentMapped.length > 0) {
        currentPlatform = currentMapped[0].platform;
    } else {
        return;
    }

    currentMapped[0].urls.map(function (e) {
        if(e.value !== currentHostName) {

            let intendedUrl = generateIntendedUrl(currentHref, e.value);

            chrome.contextMenus.create({
                title: "Open in " + currentPlatform.toUpperCase() + " " + e.env.toUpperCase(),
                contexts: ["all"],
                onclick: function () {
                    openTab(intendedUrl);
                }
            });
        }
    })
}

function generateIntendedUrl(currentHref, newHost)
{
    let parsedUrl = '';

    try {
        parsedUrl = new URL(currentHref);
    } catch (e) {
        return;
    }

    parsedUrl.hostname = newHost;

    return parsedUrl.toString();
}

function openTab(intendedUrl) {
    chrome.tabs.create({
        url: intendedUrl.replace('https://', 'http://')
    });
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
        createContextMenus(url);
    });
});

chrome.tabs.onUpdated.addListener(function () {
    getCurrentTabUrl(function (url) {
        createContextMenus(url);
    });
});