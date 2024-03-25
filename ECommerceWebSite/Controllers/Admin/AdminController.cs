using ECommerceWebSite.Areas.Identity.Data;
using ECommerceWebSite.Data;
using ECommerceWebSite.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ECommerceWebSite.Controllers.Admin
{
	[Area("Admin")] 
	[Authorize(Roles = "Admin")]
	public class AdminController : Controller
	{
		private readonly ILogger<AdminController> _logger;
		private readonly UserManager<ApplicationUser> _userManager;
		private readonly RoleManager<IdentityRole> _roleManager;

		public AdminController(ILogger<AdminController> logger, UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
		{
			_logger = logger;
			_userManager = userManager;
			_roleManager = roleManager;
		}

		[HttpGet]
		public async Task<IActionResult> UsersList()
		{
			var users = _userManager.Users.ToList();
			var usersView = new List<UserExtendedModel>();

			foreach (var user in users)
			{
				var model = new UserExtendedModel
				{
					Id = user.Id,
					FirstName = user.FirstName,
					LastName = user.LastName,
					Email = user.Email,
					Roles = (List<string>)await _userManager.GetRolesAsync(user)
				};

				if (model.Roles.Count == 0)
				{
					await _userManager.AddToRoleAsync(user, "User");
				}

				usersView.Add(model);
			}

			return View("~/Views/Home/User/UsersList.cshtml", usersView);
		}

		[HttpGet]
		public IActionResult CreateUser()
		{
			return View();
		}

		[HttpPost]
		public async Task<IActionResult> CreateUser(UserExtendedModel model)
		{
			if (ModelState.IsValid)
			{
				var user = new ApplicationUser
				{
					FirstName = model.FirstName,
					LastName = model.LastName,
					UserName = model.Email,
					Email = model.Email
				};

				var result = await _userManager.CreateAsync(user, model.Password);

				if (result.Succeeded)
				{
					if (model.IsAdmin)
					{
						await _userManager.RemoveFromRolesAsync(user, await _userManager.GetRolesAsync(user));
						await _userManager.AddToRoleAsync(user, "Admin");
					}
					else
					{
						await _userManager.RemoveFromRolesAsync(user, await _userManager.GetRolesAsync(user));
						await _userManager.AddToRoleAsync(user, "User");
					}

					TempData["successMessage"] = "User created successfully!";
					return RedirectToAction("UsersList");
				}

				foreach (var error in result.Errors)
				{
					ModelState.AddModelError("", error.Description);
				}

				TempData["errorMessage"] = "Error on creating user";
			}

			return View("~/Views/Home/User/UserCreate.cshtml", model);
		}

		[HttpGet]
		public async Task<IActionResult> DeleteUser(string id)
		{
			var user = await _userManager.FindByIdAsync(id);

			if (user == null)
			{
				TempData["errorMessage"] = $"User with Id = {id} cannot be found";
				return RedirectToAction("UsersList");
			}

			var result = await _userManager.DeleteAsync(user);

			if (result.Succeeded)
			{
				TempData["successMessage"] = "User deleted successfully!";
			}
			else
			{
				foreach (var error in result.Errors)
				{
					ModelState.AddModelError("", error.Description);
				}

				TempData["errorMessage"] = "Error on deleting user";
			}

			return RedirectToAction("UsersList");
		}

		[HttpGet]
		public async Task<IActionResult> EditUser(string id)
		{
			var user = await _userManager.FindByIdAsync(id);

			if (user == null)
			{
				TempData["errorMessage"] = $"User with Id = {id} cannot be found";
				return RedirectToAction("UsersList");
			}

			var userClaims = await _userManager.GetClaimsAsync(user);
			var userRoles = await _userManager.GetRolesAsync(user);

			var model = new UserExtendedModel
			{
				Id = user.Id,
				FirstName = user.FirstName,
				LastName = user.LastName,
				Email = user.Email,
				Claims = userClaims.Select(x => x.Value).ToList(),
				Roles = (List<string>)userRoles
			};

			return View("~/Views/Home/User/EditUser.cshtml", model);
		}

		[HttpPost]
		public async Task<IActionResult> EditUser(UserExtendedModel model)
		{
			var user = await _userManager.FindByIdAsync(model.Id);

			if (user == null)
			{
				TempData["errorMessage"] = $"User with Id = {model.Id} cannot be found";
				return RedirectToAction("UsersList");
			}

			user.Email = model.Email;
			user.FirstName = model.FirstName;
			user.LastName = model.LastName;

			var result = await _userManager.UpdateAsync(user);

			if (result.Succeeded)
			{
				TempData["successMessage"] = "User edited successfully!";
				return RedirectToAction("UsersList");
			}

			foreach (var error in result.Errors)
			{
				ModelState.AddModelError("", error.Description);
			}

			TempData["errorMessage"] = "Error on editing user";
			return View("~/Views/Home/User/EditUser.cshtml", model);
		}
	}
}
