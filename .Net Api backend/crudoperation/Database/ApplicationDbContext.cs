using Microsoft.EntityFrameworkCore;
using crudoperation.Models;

namespace crudoperation.Database
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base (options)
        {

        }

        public DbSet<Product> Products { get; set; }
    }
}
