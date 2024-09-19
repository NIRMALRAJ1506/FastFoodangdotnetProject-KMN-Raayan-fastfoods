// Models/OrderCreateModel.cs
public class OrderCreateModel
{
    public string OrderNumber { get; set; }
    public double TotalPrice { get; set; }
    public DateTime OrderTime { get; set; }
    public string Status { get; set; }
    public int UserId { get; set; }
    public List<int> FoodItemIds { get; set; } // Only FoodItem IDs are included
}
