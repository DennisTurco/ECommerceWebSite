using ECommerceWebSite.Areas.Identity.Data;
using ECommerceWebSite.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ECommerceWebSite
{
	public class Program
	{
		public static async Task Main(string[] args)
		{
			var builder = WebApplication.CreateBuilder(args);
			var connectionString = builder.Configuration.GetConnectionString("ApplicationDBContextConnectionLaptop") ?? throw new InvalidOperationException("Connection string 'ApplicationDBContextConnection' not found.");

			builder.Services.AddDistributedMemoryCache();
			builder.Services.AddSession(options =>
			{
				options.IdleTimeout = TimeSpan.FromSeconds(10);
				options.Cookie.HttpOnly = true;
				options.Cookie.IsEssential = true;
			});

			builder.Services.AddDbContext<ApplicationDbContext>(options => options.UseSqlServer(connectionString));
			builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = false) // false = no confirmation required
				.AddRoles<IdentityRole>()
				.AddEntityFrameworkStores<ApplicationDbContext>();


			// External login systems (https://learn.microsoft.com/en-us/aspnet/core/security/authentication/social/?view=aspnetcore-8.0&tabs=visual-studio)
			/*
			builder.Services.AddAuthentication()
			   .AddGoogle(options =>
			   {
				   IConfigurationSection googleAuthNSection =
				   config.GetSection("Authentication:Google");
				   options.ClientId = googleAuthNSection["ClientId"];
				   options.ClientSecret = googleAuthNSection["ClientSecret"];
			   })
			   .AddFacebook(options =>
			   {
				   IConfigurationSection FBAuthNSection =
				   config.GetSection("Authentication:FB");
				   options.ClientId = FBAuthNSection["ClientId"];
				   options.ClientSecret = FBAuthNSection["ClientSecret"];
			   })
			   .AddMicrosoftAccount(microsoftOptions =>
			   {
				   microsoftOptions.ClientId = config["Authentication:Microsoft:ClientId"];
				   microsoftOptions.ClientSecret = config["Authentication:Microsoft:ClientSecret"];
			   })
			   .AddTwitter(twitterOptions =>
			   {
				   twitterOptions.ConsumerKey = config["Authentication:Twitter:ConsumerAPIKey"];
				   twitterOptions.ConsumerSecret = config["Authentication:Twitter:ConsumerSecret"];
				   twitterOptions.RetrieveUserDetails = true;
			   });
			*/

			// Add services to the container.
			builder.Services.AddControllersWithViews();

			var app = builder.Build();

			// Configure the HTTP request pipeline.
			if (!app.Environment.IsDevelopment())
			{
				app.UseExceptionHandler("/Home/Error");
				// The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
				app.UseHsts();
			}

			app.UseHttpsRedirection();
			app.UseStaticFiles();
			app.UseRouting();
			app.UseAuthentication();
			app.UseAuthorization();
			app.UseSession();
			app.MapControllerRoute(
				name: "default",
				pattern: "{controller=Home}/{action=Index}/{id?}");
			app.MapRazorPages();

			// create as default 2 roles: Admin and User
			using (var scope = app.Services.CreateScope())
			{
				var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
				var roles = new[] { "Admin", "SimpleUser" };

				foreach (var role in roles)
				{
					// mi permette di creare i Ruoli all'interno del database se non gia' presenti
					if (!await roleManager.RoleExistsAsync(role)) await roleManager.CreateAsync(new IdentityRole(role));
				}
			}

			// create ad default a admin account
			/*using (var scope = app.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();

                string email = "admin@admin.com";
                string password = "asdasd123A?";

                if (await userManager.FindByEmailAsync(email) == null)
                {
                    var user = new IdentityUser();
                    user.UserName = email;
                    user.Email = email;

                    await userManager.CreateAsync(user, password);

                    await userManager.AddToRoleAsync(user, "Admin");
                }
            }*/

			app.Run();
		}
	}
}


