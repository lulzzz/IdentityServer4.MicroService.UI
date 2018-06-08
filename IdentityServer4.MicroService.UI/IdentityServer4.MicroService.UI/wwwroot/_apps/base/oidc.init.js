Oidc.Log.logger = console;
Oidc.Log.level = Oidc.Log.WARN;
var siteurl = location.protocol + "//" + location.host;
var settings = {
    authority: 'https://ids.jixiucloud.cn',//'https://localhost:44309',
    client_id: 'adminportal',
    redirect_uri: siteurl + '/callback.html',
    post_logout_redirect_uri: siteurl + '/logout.html',
    response_type: 'id_token token',
    scope: 'openid profile ids4.ms.all',
    silent_redirect_uri: siteurl + '/silent_callback.html',
    automaticSilentRenew: true,
    //silentRequestTimeout:10000,
    filterProtocolClaims: true,
    loadUserInfo: true
};
window.oidc = new Oidc.UserManager(settings);