
using api.xraycare.Database;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging.Abstractions;
using Npgsql;
public static class Extension
{
    public static IHostApplicationBuilder InitAppService(this IHostApplicationBuilder builder)
    {
        // builder.Services.AddTransient<IPurchaseOrderService, PurchaseOrdersAPIService>();    
        // Add HttpClient for calling external APIs
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
            var scope = app.Services.CreateScope();
            var bdb = scope.ServiceProvider.GetService<DataContext>();
            if (bdb != null && bdb.Database.GetPendingMigrations().Any())
                bdb.Database.Migrate();
        }
        catch (Exception e)
        {
            var scope = app.Services.CreateScope();
            var log = scope.ServiceProvider.GetService<ILoggerFactory>()?.CreateLogger("Migrations") ?? NullLogger.Instance;
            log.LogError(e.ToString());
        }
        return app;
    }
}


