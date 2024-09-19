using System;
using System.Collections.Generic;

namespace FastFoodApi.Models
{
    public class AppUser
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public DateTime Dob { get; set; }
        public string ContactNo { get; set; }
        public string address { get; set; }
        public string? Email { get; set; }
        public string? Username { get; set; }
        public string? Password { get; set; }
        public string? Role { get; set; }

        // Navigation property
        public ICollection<OrderModel> Orders { get; set; } = new List<OrderModel>();
    }
}
