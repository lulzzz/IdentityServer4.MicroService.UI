using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using IdentityServer4.MicroService.UI.Models;
using System.Net.Http;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using Microsoft.AspNetCore.Mvc.Filters;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Text;
using System;

namespace IdentityServer4.MicroService.UI.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        public HomeController(IHostingEnvironment hostingEnvironment)
        {
            _hostingEnvironment = hostingEnvironment;
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            base.OnActionExecuted(context);

            ViewData["apps"] = GetAppJsonString();
        }

        string GetAppJsonString()
        {
            var webRootPath = _hostingEnvironment.WebRootPath;

            var apps = string.Empty;

            using (var sr = new StreamReader(webRootPath + "/apps.json"))
            {
                apps = sr.ReadToEnd();
            }

            return apps;
        }

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

        [HttpPost]
        public JsonResult RegisterApp(string packageName,string menuName,string appIcon,string appDesc)
        {
            var webRootPath = _hostingEnvironment.WebRootPath;

            var apps = GetAppJsonString();

            var appJson = JsonConvert.DeserializeObject<JObject>(apps);

            var newApp = JObject.FromObject(new { Name = menuName, Icon = appIcon, Description = appDesc });

            appJson.Add(packageName, newApp);
            
            using (var sw = new StreamWriter(webRootPath + "/apps.json", false, Encoding.UTF8))
            {
                sw.Write(appJson.ToString());
            }

            var sb = new StringBuilder();
            sb.AppendLine("cd "+webRootPath);
            sb.AppendLine("npm i " + packageName);

            var result = ExeCommand(sb.ToString());

            return new JsonResult(new { code = 200, msg = result });
        }

        [HttpPost]
        public JsonResult RemoveApp(string packageName)
        {
            var webRootPath = _hostingEnvironment.WebRootPath;

            var apps = GetAppJsonString();

            var appJson = JsonConvert.DeserializeObject<JObject>(apps);

            if (appJson[packageName] != null &&
                (appJson[packageName]["DefaultApp"] == null ||
                appJson[packageName]["DefaultApp"].Value<bool>() == false))
            {
                appJson.Remove(packageName);

                using (var sw = new StreamWriter(webRootPath + "/apps.json", false, Encoding.UTF8))
                {
                    sw.Write(appJson.ToString());
                }
            }

            return new JsonResult(new { code = 200 });
        }

        public string ExeCommand(string commandText)
        {
            var p = new Process();
            p.StartInfo.FileName = "cmd.exe";
            p.StartInfo.UseShellExecute = false;
            p.StartInfo.RedirectStandardInput = true;
            p.StartInfo.RedirectStandardOutput = true;
            p.StartInfo.RedirectStandardError = true;
            p.StartInfo.CreateNoWindow = true;
            string strOutput = null;
            try
            {
                p.Start();
                p.StandardInput.WriteLine(commandText);
                p.StandardInput.WriteLine("exit");
                strOutput = p.StandardOutput.ReadToEnd();
                p.WaitForExit();
                p.Close();
            }
            catch (Exception e)
            {
                strOutput = e.Message;
            }
            return strOutput;
        }
    }
}
