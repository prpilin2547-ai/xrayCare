using System.Net;
using System.Text.Json;
using Npgsql;

namespace api.xraycare.Middleware;

/// <summary>
/// Catches unhandled exceptions and returns a consistent JSON error response.
/// Prevents raw stack traces and DB errors from reaching the client.
/// </summary>
public class ApiExceptionMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiExceptionMiddleware> _logger;
    private readonly IHostEnvironment _env;

    public ApiExceptionMiddleware(RequestDelegate next, ILogger<ApiExceptionMiddleware> logger, IHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled exception: {Message}", ex.Message);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var message = GetUserMessage(ex);

            var body = new { message };
            var json = JsonSerializer.Serialize(body);
            await context.Response.WriteAsync(json);
        }
    }

    private string GetUserMessage(Exception ex)
    {
        if (ex is PostgresException pg && pg.SqlState == "42703")
            return "ฐานข้อมูลยังไม่มี column ที่จำเป็น (IsSuperAdmin). กรุณารัน migration หรือคำสั่งแก้ไข: docker compose exec postgres psql -U xrayuser -d postgres -c \"ALTER TABLE \\\"Users\\\" ADD COLUMN IF NOT EXISTS \\\"IsSuperAdmin\\\" boolean NOT NULL DEFAULT false; UPDATE \\\"Users\\\" SET \\\"IsSuperAdmin\\\" = true WHERE \\\"Username\\\" = 'Superadmin';\" แล้ว restart API";

        if (_env.IsDevelopment())
            return ex.InnerException?.Message ?? ex.Message;

        return "เกิดข้อผิดพลาดของเซิร์ฟเวอร์ กรุณาลองใหม่หรือติดต่อผู้ดูแลระบบ";
    }
}
