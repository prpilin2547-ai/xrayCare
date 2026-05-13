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

    public DbSet<Hospital> Hospitals { get; set; }
    public DbSet<Machine> Machines { get; set; }
    public DbSet<UserAccount> Users { get; set; }
    public DbSet<RepairRequest> RepairRequests { get; set; }
    public DbSet<ChecklistRecord> ChecklistRecords { get; set; }
    public DbSet<ScheduleConfig> ScheduleConfigs { get; set; }
    public DbSet<HospitalUiState> HospitalUiStates { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<UserAccount>().HasIndex(u => new { u.HospitalId, u.Username }).IsUnique();
        modelBuilder.Entity<HospitalUiState>().HasIndex(x => x.HospitalId).IsUnique();
    }
}