using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace FastFoodApi.Models
{
    public class OrderModel
    {
        public int Id { get; set; }
        public string OrderNumber { get; set; }
        public double TotalPrice { get; set; }
        public DateTime OrderTime { get; set; }
        public string Status { get; set; }

        // Foreign key for AppUser
        public int UserId { get; set; }
        [ForeignKey("UserId")]
        public AppUser User { get; set; }

        // Many-to-many relationship with FoodItem
        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
