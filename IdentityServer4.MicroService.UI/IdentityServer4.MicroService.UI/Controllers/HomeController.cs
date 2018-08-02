using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using IdentityServer4.MicroService.UI.Models;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace IdentityServer4.MicroService.UI.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult About()
        {
            ViewData["Message"] = "Your application description page.";

            return View();
        }

        public IActionResult Contact()
        {
            ViewData["Message"] = "Your contact page.";

            return View();
        }

        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        [HttpGet]
        public async Task<JsonResult> GithubToken(string code)
        {
            var data = new Dictionary<string, string>() {
                { "client_id","Iv1.03f5f066b1789e5e"},
                { "client_secret","8f65f704e444d5f3994a10967918f47502b06c89"},
                { "code",code},
            };

            var body = new FormUrlEncodedContent(data);

            using (var hc = new HttpClient())
            {
                var postResult = await hc.PostAsync("https://github.com/login/oauth/access_token", body);

                if (postResult.IsSuccessStatusCode)
                {
                    var result = await postResult.Content.ReadAsStringAsync();

                    return new JsonResult(result);
                }

                return new JsonResult(postResult.ReasonPhrase);
            }
        }
    }
}
