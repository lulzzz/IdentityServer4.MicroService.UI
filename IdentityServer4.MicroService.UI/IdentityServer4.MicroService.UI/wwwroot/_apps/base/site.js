// Write your JavaScript code.
if (window.oidc) {

    oidc.getUser().then(user => {
        window.user = user;

        if (user == null)
        {
            location.href = '/login.html';
        }
        else {

            var tokenInfo = jwt_decode(user.access_token);

            document.title = tokenInfo.client_tenant.name + ' - ' + document.title;

            $('.mdui-typo-headline').text(tokenInfo.client_tenant.name);

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

            var dev = queryString('dev');

            if (dev)
            {
                appIframe.attr('src', dev + '?user=' + JSON.stringify(user));
            }
        }

    }).catch(err => {
        console.error(err);
        //location.href = '/login.html';
    });
}


function startSignoutMainWindow()
{
    oidc.signoutRedirect().then(resp =>
    {
        console.log("signed out", resp);
    }).catch(err => console.error(err));
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
            case 'app_loaded':
                appLoadingBarToggle('hide');
                iframe.iFrameResizer.sendMessage(
                    {
                        eventType: 'app_loaded_callback',
                        user: window.user,
                        //sdkBasepath: oidc.settings._authority,
                        //windowOuterHeight: window.outerHeight
                    });
                break;
        }
    }
}, '#appIframe');

function queryString(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1]);
}