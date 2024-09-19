using System.Collections.Generic;

namespace FastFoodApi.Models
{
    public class FoodItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public double Price { get; set; }
        public string ImgUrl { get; set; }
        public string FoodType { get; set; }

        // Navigation property
       public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
    }
}
