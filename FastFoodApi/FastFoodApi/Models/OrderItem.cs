using FastFoodApi.Models;


public class OrderItem
{
    public int OrderId { get; set; }
    public OrderModel Order { get; set; }

    public int FoodItemId { get; set; }
    public FoodItem FoodItem { get; set; }

   
}
