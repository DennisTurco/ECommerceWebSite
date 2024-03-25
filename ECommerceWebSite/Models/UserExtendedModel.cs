using Microsoft.AspNetCore.Authorization.Infrastructure;

namespace ECommerceWebSite.Models
{
    public class UserExtendedModel : UserModel
    {
        public UserExtendedModel()
        {
            Claims = new List<string>();
            Roles = new List<string>();
        }
        public List<string> Claims { get; set; }
        public List<string> Roles { get; set; }
    }
}