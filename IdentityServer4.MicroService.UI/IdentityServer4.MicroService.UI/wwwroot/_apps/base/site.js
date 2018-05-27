// Write your JavaScript code.
if (window.oidc) {
    oidc.getUser().then(user => {
        if (user == null) {
            location.href = '/login.html';
        }
        else {
            window.user = user;
            window.startSignoutMainWindow = () =>
            {
                oidc.signoutRedirect().then(resp =>
                {
                    console.log("signed out", resp);
                }).catch(err => console.error(err));
            };
            oidc.events.addAccessTokenExpiring(() => {
                alert("token expiring");
                // 加入UI提示
            });
            oidc.events.addAccessTokenExpired(() => {
                alert("token expired");
            });
            oidc.events.addSilentRenewError(e => {
                alert("silent renew error"+ e.message);
            });
            oidc.events.addUserLoaded(user => {
                console.log("user loaded", user);

                odic.getUser().then(() => {
                    console.log("getUser loaded user after userLoaded event fired");
                });
            });
            oidc.events.addUserUnloaded(e => {
                alert("user unloaded");
            });
        }

    }).catch(err => {
        location.href = '/login.html';
    });
}

var leftdrawer = new mdui.Drawer('#leftDrawer');
var inst = new mdui.Menu('#more_vert', '#more_vert_items');
var appLoadingBar = document.getElementById('appLoadingBar');
var appIframe = $('#appIframe');

function openApp(appName) {
    appLoadingBarToggle('show');
    if (appName.indexOf('http') <= -1) {
        appIframe.attr('src', appStore + appName);
    }
    else {
        appIframe.attr('src', appName);
    }
}

function appLoadingBarToggle(action) {
    switch (action) {
        case 'show':
            appLoadingBar.style.display = '';
            break;
        case 'hide':
            appLoadingBar.style.display = 'none';
            if (leftdrawer.getState() != 'closed') {
                leftdrawer.close();
            }
            break;
    }
}

function refreshApp() {
    iframe.iFrameResizer.sendMessage({ eventType: 'refresh' });
}

iFrameResize({
    log: false,
    checkOrigin: false,
    initCallback: function (iframe)
    {
        window.iframe = iframe;
    },
    messageCallback: function (event)
    {
        switch (event.message)
        {
            case 'appLoaded':
                appLoadingBarToggle('hide');
                iframe.iFrameResizer.sendMessage(
                    {
                        eventType: 'appLoaded_callback',
                        user: window.user,
                        windowOuterHeight: window.outerHeight
                    });
                break;
        }
    }
}, '#appIframe');