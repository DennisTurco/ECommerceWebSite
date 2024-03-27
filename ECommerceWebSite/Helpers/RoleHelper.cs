using ECommerceWebSite.Areas.Identity.Data;
using Microsoft.AspNetCore.Identity;
using System;

public class RoleHelper
{
	private readonly UserManager<ApplicationUser> _userManager;
	private readonly RoleManager<IdentityRole> _roleManager;

	public RoleHelper(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
	{
		_userManager = userManager;
		_roleManager = roleManager;
	}

	/*
	 * This function must be called from a Task<IActionResult> function.
	 * I suggets to include everything inside a try catch block. 
	 * example of a possible call:
	 * try
     * {
	 *		RoleHelper helper = new RoleHelper(_userManager, _roleManager);
	 *		await helper.AssignUserToRole("a7eddd16-d58c-4527-921e-7af1f500a1a7", "Admin");
	 * } catch (Exception ) { }
	*/ 
	public async Task AssignUserToRole(string userId, string roleName)
	{
		// check if the role exists, otherwise return
		if (_roleManager.FindByNameAsync(roleName) == null)
		{
			return;
		}

		// obtain the user
		var user = await _userManager.FindByIdAsync(userId);

		// assign user to the rule
		if (user != null && !await _userManager.IsInRoleAsync(user, roleName))
		{
			await _userManager.AddToRoleAsync(user, roleName);
		}
	}
}
