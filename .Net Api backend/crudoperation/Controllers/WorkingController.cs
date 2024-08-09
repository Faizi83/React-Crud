using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using crudoperation.Database;
using crudoperation.Models;
using System.IO;
using System.Threading.Tasks;

namespace crudoperation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WorkingController : ControllerBase
    {
        private readonly ApplicationDbContext dbContext;

        public WorkingController(ApplicationDbContext _dbContext)
        {
            dbContext = _dbContext;
        }

        [HttpPost("add-product")]
        public async Task<IActionResult> AddProduct(IFormFile image, [FromForm] string productName, [FromForm] decimal price, [FromForm] string description)
        {
            var product = new Product
            {
                ProductName = productName,
                Price = price,
                Description = description
            };

            if (image != null)
            {
                var uniqueFileName = $"{Guid.NewGuid()}_{image.FileName}";
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "images", uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                product.ImagePath = $"/images/{uniqueFileName}";
            }

            dbContext.Products.Add(product);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

        [HttpGet("get-products")]
        public async Task<IActionResult> GetProducts()
        {
            var products = await dbContext.Products.ToListAsync();
            return Ok(products);
        }

        [HttpGet("get-product/{id}")]
        public async Task<IActionResult> GetSingleProduct(int id)
        {
            var product = await dbContext.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }
            return Ok(product);
        }
        [HttpPut("update-product/{id}")]
        public async Task<IActionResult> UpdateProduct(int id, [FromForm] IFormFile? image, [FromForm] string productName, [FromForm] decimal price, [FromForm] string description, [FromForm] string imagePath)
        {
            if (string.IsNullOrEmpty(productName) || price <= 0 || string.IsNullOrEmpty(description))
            {
                return BadRequest("Invalid input data");
            }

            var product = await dbContext.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            product.ProductName = productName;
            product.Price = price;
            product.Description = description;

            // Handle image upload only if a new image is provided
            if (image != null && image.Length > 0)
            {
                // Delete old image if it exists
                if (!string.IsNullOrEmpty(product.ImagePath))
                {
                    var oldImagePath = Path.Combine(Directory.GetCurrentDirectory(), product.ImagePath.TrimStart('/'));
                    if (System.IO.File.Exists(oldImagePath))
                    {
                        System.IO.File.Delete(oldImagePath);
                    }
                }

                // Save the new image
                var uniqueFileName = $"{Guid.NewGuid()}_{image.FileName}";
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), "images", uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                product.ImagePath = $"/images/{uniqueFileName}";
            }
            else if (!string.IsNullOrEmpty(imagePath))
            {
                // Update imagePath if no new image is provided
                product.ImagePath = imagePath;
            }

            dbContext.Products.Update(product);
            await dbContext.SaveChangesAsync();

            return Ok();
        }


        [HttpDelete("delete-product/{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            var product = await dbContext.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            // Check if the product has an associated image and delete it from the folder
            if (!string.IsNullOrEmpty(product.ImagePath))
            {
                var filePath = Path.Combine(Directory.GetCurrentDirectory(), product.ImagePath.TrimStart('/'));
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
            }

            dbContext.Products.Remove(product);
            await dbContext.SaveChangesAsync();

            return Ok();
        }

    }
}
