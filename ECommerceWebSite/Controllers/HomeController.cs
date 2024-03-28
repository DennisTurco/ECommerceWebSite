using ECommerceWebSite.Areas.Identity.Data;
using ECommerceWebSite.Data;
using ECommerceWebSite.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace ECommerceWebSite.Controllers
{
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public HomeController(ILogger<HomeController> logger, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _logger = logger;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Subscription()
        {
            return View();
        }

        public IActionResult Category()
        {
            return View();
        }

        public IActionResult Customization()
        {
            return View();
        }


        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }
    }
}
