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
using Microsoft.Extensions.Configuration;

namespace IdentityServer4.MicroService.UI.Controllers
{
    public class HomeController : Controller
    {
        private readonly IHostingEnvironment _hostingEnvironment;

        private readonly IConfiguration _config;

        public HomeController(IHostingEnvironment hostingEnvironment,
            IConfiguration config)
        {
            _hostingEnvironment = hostingEnvironment;

            _config = config;
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            base.OnActionExecuted(context);

            ViewData["apps"] = GetFileString("apps.json");
        }

        string GetFileString(string fileName)
        {
            using (var sr = new StreamReader(_hostingEnvironment.WebRootPath + "/" + fileName))
            {
                return sr.ReadToEnd();
            }
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
            var cb = CommandBuilder();

            cb.AppendLine($"npm i {packageName} --save");

            var result = ExeCommand(cb.ToString());

            var packageJsonStr = GetFileString("package.json");

            var packageJson = JsonConvert.DeserializeObject<JObject>(packageJsonStr);

            if (packageJson["dependencies"][packageName] != null)
            {
                var packageVersion = packageJson["dependencies"][packageName].Value<string>();

                packageVersion = packageVersion.Replace("~", "").Replace("^", "");

                var apps = GetFileString("apps.json");

                var appJson = JsonConvert.DeserializeObject<JObject>(apps);

                var newApp = JObject.FromObject(new {
                    Name = menuName,
                    Icon = appIcon,
                    Description = appDesc,
                    Version = packageVersion
                });

                appJson.Add(packageName, newApp);

                using (var sw = new StreamWriter(_hostingEnvironment.WebRootPath + "/apps.json", false, Encoding.UTF8))
                {
                    sw.Write(appJson.ToString());
                }
            }

            return new JsonResult(new { code = 200, msg = result });
        }

        [HttpPost]
        public JsonResult RemoveApp(string packageName)
        {
            var cb = CommandBuilder();

            cb.AppendLine($"npm uninstall {packageName}");

            ExeCommand(cb.ToString());

            var apps = GetFileString("apps.json");

            var appJson = JsonConvert.DeserializeObject<JObject>(apps);

            if (appJson[packageName] != null &&
                (appJson[packageName]["DefaultApp"] == null ||
                appJson[packageName]["DefaultApp"].Value<bool>() == false))
            {
                appJson.Remove(packageName);

                using (var sw = new StreamWriter(_hostingEnvironment.WebRootPath + "/apps.json", false, Encoding.UTF8))
                {
                    sw.Write(appJson.ToString());
                }
            }

            return new JsonResult(new { code = 200 });
        }

        [HttpPost]
        public JsonResult UpdateApp(string packageName)
        {
            var cb = CommandBuilder();

            cb.AppendLine($"npm uninstall {packageName}");

            cb.AppendLine($"npm install {packageName} --save");

            var result = ExeCommand(cb.ToString());

            var packageJsonStr = GetFileString("package.json");

            var packageJson = JsonConvert.DeserializeObject<JObject>(packageJsonStr);

            if (packageJson["dependencies"][packageName] != null)
            {
                var packageVersion = packageJson["dependencies"][packageName].Value<string>();

                packageVersion = packageVersion.Replace("~", "").Replace("^", "");

                var apps = GetFileString("apps.json");

                var appJson = JsonConvert.DeserializeObject<JObject>(apps);

                appJson[packageName]["Version"] = packageVersion;

                using (var sw = new StreamWriter(_hostingEnvironment.WebRootPath + "/apps.json", false, Encoding.UTF8))
                {
                    sw.Write(appJson.ToString());
                }
            }

            return new JsonResult(new { code = 200, msg = result });
        }

        [HttpGet]
        [ResponseCache(Duration = 10, VaryByQueryKeys = new string[1] { "packageName" })]
        public JsonResult AppVersions(string packageName)
        {
            var cb = CommandBuilder();

            cb.AppendLine($"npm view {packageName} versions");

            var result = ExeCommand(cb.ToString());

            result = result.Substring(result.LastIndexOf('['));

            result = result.Substring(0, result.LastIndexOf(']') + 1);

            result = result.Replace("[", "").Replace("]", "");

            var versions = result.Split(new string[] { "," }, StringSplitOptions.RemoveEmptyEntries);

            for (var i = 0; i < versions.Length; i++)
            {
                versions[i] = versions[i].Replace("'", "").Trim();
            }

            Array.Reverse(versions);

            return new JsonResult(new { code = 200, msg = versions });
        }

        [HttpGet]
        public JsonResult AppSearch(string packageName)
        {
            var result = string.Empty;

            using (var hc = new HttpClient())
            {
                var response = hc.GetAsync("https://www.npmjs.com/search/suggestions?q=" + packageName).Result;

                result = response.Content.ReadAsStringAsync().Result;
            }

            return new JsonResult(new { code = 200, msg = result });
        }

        StringBuilder CommandBuilder()
        {
            var sb = new StringBuilder();

            var AzureNpmPath = _config["AzureNpmPath"];

            if (!string.IsNullOrWhiteSpace(AzureNpmPath))
            {
                sb.AppendLine(@"set path=%path%" + AzureNpmPath);
            }

            sb.AppendLine("cd " + _hostingEnvironment.WebRootPath);

            return sb;
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
