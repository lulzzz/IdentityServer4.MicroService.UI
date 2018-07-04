var _authority = localStorage.getItem("oidc_authority");
var _client_id = localStorage.getItem("oidc_client_id");

if ((_authority == null || _client_id == null) && location.pathname !='/start.html')
{
    location.href = '/start.html';
}
else {

    Oidc.Log.logger = console;
    Oidc.Log.level = Oidc.Log.WARN;
    var siteurl = location.protocol + "//" + location.host;

    var settings = {
        authority: _authority,
        client_id: _client_id,
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
}