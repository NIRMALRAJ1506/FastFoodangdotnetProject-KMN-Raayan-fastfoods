using FastFoodApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

namespace FastFoodApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly FoodContext _context;
        private readonly JwtTokenService _jwtTokenService;

        public AdminController(FoodContext context, JwtTokenService jwtTokenService)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (await _context.Users.AnyAsync(u => u.Username == model.Username))
            {
                return BadRequest("Username already exists.");
            }

            var admin = new AppUser
            {
                Name = model.Name,
                Dob = model.Dob,
                ContactNo = model.ContactNumber,
                Email = model.Email,
                Username = model.Username,
                Password = model.Password, // You should encrypt passwords in a real application
                Role = "Admin"
            };

            _context.Users.Add(admin);
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = _jwtTokenService.GenerateToken(admin);

            return Ok(new { message = "Admin registered successfully.", token });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var admin = await _context.Users
                .SingleOrDefaultAsync(u => u.Username == model.Username && u.Password == model.Password && u.Role == "Admin");

            if (admin == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            // Generate JWT token
            var token = _jwtTokenService.GenerateToken(admin);

            return Ok(new { message = "Admin login successful", token, userId = admin.Id });
        }
        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            var admin = await _context.Users.SingleOrDefaultAsync(u => u.Email == model.Email && u.Role == "Admin");
            if (admin == null)
            {
                return NotFound("Admin with this email does not exist.");
            }

            // Generate reset token (in a real app, use a more secure method)
            var token = Guid.NewGuid().ToString();

            // Store the token (you can store it in a table or in-memory store)
            // Send token via email (Implement this as per your project)
            // await _emailService.SendPasswordResetEmail(admin.Email, token);

            return Ok(new { message = "Password reset link has been sent to your email." });
        }
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            // Validate the token (in a real app, retrieve the token and verify)
            // Assume we have the token validation process

            var admin = await _context.Users.SingleOrDefaultAsync(u => u.Email == model.Email && u.Role == "Admin");
            if (admin == null)
            {
                return NotFound("Admin not found.");
            }

            // Update the password (you should hash the password in a real app)
            admin.Password = model.NewPassword;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successful." });
        }

    }
}
