using FastFoodApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace FastFoodApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly FoodContext _context;
        private readonly JwtTokenService _jwtTokenService;

        public UserController(FoodContext context, JwtTokenService jwtTokenService)
        {
            _context = context;
            _jwtTokenService = jwtTokenService;
        }

        // Get all users except admins
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            var users = await _context.Users
                .Where(u => u.Role != "Admin")
                .ToListAsync();
            return Ok(users);
        }

        // Get user by ID
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(user);
        }

        // Update user by ID
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] AppUser updatedUser)
        {
            if (id != updatedUser.Id)
            {
                return BadRequest("User ID mismatch.");
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            user.Name = updatedUser.Name;
            user.ContactNo = updatedUser.ContactNo;
            user.Dob = updatedUser.Dob;
            user.Email = updatedUser.Email;
            user.Username = updatedUser.Username;

            try
            {
                _context.Entry(user).State = EntityState.Modified;
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound("User not found.");
                }
                throw;
            }

            return NoContent();
        }

        // Register a new user
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingUser = await _context.Users.SingleOrDefaultAsync(u => u.Username == model.Username);
            if (existingUser != null)
            {
                return Conflict("Username already exists.");
            }
            var existingEmail = await _context.Users.SingleOrDefaultAsync(u => u.Email == model.Email);
            if (existingEmail != null)
            {
                return Conflict("Username already exists.");
            }

            var user = new AppUser
            {
                Name = model.Name,
                Dob = model.Dob,
                ContactNo = model.ContactNumber,
                address=model.address,
                Email = model.Email,
                Username = model.Username,
                Password = model.Password, // Note: Ensure to use encryption in a real application
                Role = model.Role
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate JWT token for the new user
            var token = _jwtTokenService.GenerateToken(user);

            return CreatedAtAction(nameof(GetUserById), new { id = user.Id }, new { user, token });
        }

        // User login
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var user = await _context.Users
                .SingleOrDefaultAsync(u => u.Username == model.Username && u.Password == model.Password && u.Role == "User");

            if (user == null)
            {
                return Unauthorized("Invalid username or password.");
            }

            // Generate JWT token
            var token = _jwtTokenService.GenerateToken(user);

            return Ok(new { userId = user.Id, token });
        }

        // Delete user by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }

        [HttpGet("count")]
        public async Task<IActionResult> GetUserCount()
        {
            var count = await _context.Users.CountAsync();
            return Ok(count);
        }

        [HttpGet("{id}/role")]
        public async Task<IActionResult> GetUserRole(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            return Ok(new { role = user.Role });
        }
        [AllowAnonymous]
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword([FromBody] ForgotPasswordModel model)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == model.Email && u.Role == "User");
            if (user == null)
            {
                return NotFound("User with this email does not exist.");
            }

            // Generate reset token
            var token = Guid.NewGuid().ToString();

            // Store the token and send via email
            // await _emailService.SendPasswordResetEmail(user.Email, token);

            return Ok(new { message = "Password reset link has been sent to your email." });
        }
        [AllowAnonymous]
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordModel model)
        {
            var user = await _context.Users.SingleOrDefaultAsync(u => u.Email == model.Email && u.Role == "User");
            if (user == null)
            {
                return NotFound("User not found.");
            }

            // Update the password
            user.Password = model.NewPassword;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Password reset successful." });
        }

    }
}
