using Microsoft.EntityFrameworkCore;
using db.xraycare;

namespace api.xraycare.Database;
public class DataContext : DbContext
{
    private readonly IConfiguration _options;
    public DataContext(IConfiguration options)
    {
        _options = options;
    }
    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        var connectionString = _options.GetConnectionString("DefaultConnection");
        optionsBuilder.UseNpgsql(connectionString);
    }

    public DbSet<Machine> Machines { get; set; }

    
}