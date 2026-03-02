using api.xraycare.Database;
using api.xraycare.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Npgsql;

public static class Extension
{
    public static IHostApplicationBuilder InitAppService(this IHostApplicationBuilder builder)
    {
        builder.Services.AddHttpContextAccessor();
        builder.Services.AddScoped<IHospitalContext, HospitalContext>();
        builder.Services.AddScoped<api.xraycare.Services.ICurrentUserContext, api.xraycare.Services.CurrentUserContext>();
        builder.Services.AddHttpClient();
        return builder;
    }

    public static IHostApplicationBuilder SetupDataContext(this IHostApplicationBuilder builder)
    {
        AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
        builder.Services.AddDbContext<DataContext>();

        return builder;
    }
    public static WebApplication ApplyMigration(this WebApplication app)
    {
        try
        {
            using var scope = app.Services.CreateScope();
            var bdb = scope.ServiceProvider.GetService<DataContext>();
            if (bdb != null)
                bdb.Database.Migrate();
        }
        catch (Exception e)
        {
            using var scope = app.Services.CreateScope();
            var log = scope.ServiceProvider.GetService<ILoggerFactory>()?.CreateLogger("Migrations") ?? NullLogger.Instance;
            log.LogError(e, "Migration failed");
        }
        return app;
    }

    public static WebApplication SeedDefaultAdmin(this WebApplication app)
    {
        try
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<DataContext>();
            // Ensure default hospital exists
            if (!db.Hospitals.Any())
            {
                db.Hospitals.Add(new db.xraycare.Hospital
                {
                    Name = "โรงพยาบาลหลัก (Default)",
                    Code = "DEFAULT"
                });
                db.SaveChanges();
            }
            var firstHospital = db.Hospitals.OrderBy(h => h.RID).FirstOrDefault();
            if (firstHospital == null) return app;
            var defaultHospitalId = firstHospital.RID;
            if (!db.Users.Any(u => u.Username == "Superadmin"))
            {
                db.Users.Add(new db.xraycare.UserAccount
                {
                    HospitalId = defaultHospitalId,
                    Username = "Superadmin",
                    Password = "Superadmin1234",
                    Position = "Admin",
                    IsSuperAdmin = true
                });
                db.SaveChanges();
                var log = scope.ServiceProvider.GetService<ILoggerFactory>()?.CreateLogger("Seed");
                log?.LogInformation("Default admin user created (username: Superadmin)");
            }
        }
        catch (Exception e)
        {
            using var scope = app.Services.CreateScope();
            var log = scope.ServiceProvider.GetService<ILoggerFactory>()?.CreateLogger("Seed") ?? NullLogger.Instance;
            log.LogError(e, "Failed to seed default admin user");
        }
        return app;
    }
}


