using FastFoodApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FastFoodApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FeedbackController : ControllerBase
    {
        private readonly FoodContext _context;

        public FeedbackController(FoodContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> LoadFeedback()
        {
            var feedbacks = await _context.Feedback.ToListAsync();
            return Ok(feedbacks);
        }

        [HttpPost]
        public async Task<IActionResult> SubmitFeedback([FromBody] Feedback feedback)
        {
            if (ModelState.IsValid)
            {
                _context.Feedback.Add(feedback);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Feedback submitted successfully" });
            }

            return BadRequest(ModelState);
        }
    }




}
