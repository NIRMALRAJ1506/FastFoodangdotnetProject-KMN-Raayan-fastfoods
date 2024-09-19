using System;

namespace FastFoodApi.Models
{
    public class RegisterModel
    {
        public string Name { get; set; }
        public DateTime Dob { get; set; }
        public string ContactNumber { get; set; }
        public string address { get; set; }
        public string Email { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
        public string Role { get; set; } // User or Admin
    }
}
