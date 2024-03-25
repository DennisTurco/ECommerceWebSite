using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace ECommerceWebSite.Services
{
	public class ConnectionService
	{
		private readonly SqlConnection _connection = new SqlConnection();
		private readonly SqlCommand _command = new SqlCommand();

		public static IConfiguration? Configuration { get; set; }

		public string GetconnectionString()
		{
			var builder = new ConfigurationBuilder().SetBasePath(Directory.GetCurrentDirectory()).AddJsonFile("appsettings.json");

			Configuration = builder.Build();
			

			var con = Configuration.GetConnectionString("ApplicationDBContextConnection");
			return con == null ? throw new NullReferenceException("ApplicationDBContextConnection is null") : con;
		}


		public SqlConnection GetConnection()
		{
			return _connection;
		}

		public SqlCommand GetCommand()
		{
			return _command;
		}

	}
}