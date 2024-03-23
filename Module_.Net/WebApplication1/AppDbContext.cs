using Microsoft.EntityFrameworkCore;

namespace WebApplication1
{
    public class AppDbContext : DbContext
    {
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseInMemoryDatabase("MyDatabase");
        }

        public DbSet<Case.Case> Cases { get; set; }
    }
}
