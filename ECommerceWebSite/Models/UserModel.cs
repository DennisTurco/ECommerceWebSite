using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ECommerceWebSite.Models
{
    // Do not use "[Required]" or "[Key]" because this does not rappresent directly the user model.

    public class UserModel
    {
        public string? Id { get; set; }

        [MaxLength(50, ErrorMessage = "Name cannot exceded 50 characters")]
        [MinLength(1, ErrorMessage = "FirstName is missing")]
        [DisplayName("Firstname")]
        public string? FirstName { get; set; }

        [MaxLength(50, ErrorMessage = "Surname cannot exceded 50 characters")]
        [MinLength(1, ErrorMessage = "LastName is missing")]
        [DisplayName("Lastname")]
        public string? LastName { get; set; }

        [EmailAddress]
        [MinLength(1, ErrorMessage = "Email is missing")]
        [DisplayName("Email")]
        public string? Email { get; set; }

        [DataType(DataType.Password)]
        [MinLength(1, ErrorMessage = "Pasword is missing")]
        [DisplayName("Password")]
        public string? Password { get; set; }

        [DataType(DataType.Password)]
        [Compare("Password", ErrorMessage = "Password doesn't match")]
        [MinLength(1, ErrorMessage = "Pasword is missing")]
        [DisplayName("Confirm Password")]
        public string? ConfirmPassword { get; set; }

        [DisplayName("Admin")]
        public bool IsAdmin { get; set; }

        [NotMapped]
        [DisplayName("Full Name")]
        public string? FullName
        {
            get { return FirstName + " " + LastName; }
        }
    }
}