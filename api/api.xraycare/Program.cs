using System.Text.Json;
using api.xraycare.Middleware;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers()
    .AddJsonOptions(o =>
    {
        o.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
        o.JsonSerializerOptions.PropertyNameCaseInsensitive = true;
    });

// CORS: ให้ frontend (Vite localhost:5173) เรียก API ได้
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://127.0.0.1:5173")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Swagger/Swagger UI from Swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Xraycare API",
        Version = "v1"
    });
});

// services ของคุณเอง
builder.InitAppService();
builder.SetupDataContext();

var app = builder.Build();

app.UseMiddleware<ApiExceptionMiddleware>();

// ✅ เปิด Swagger ตลอดไปเลย (ใน Docker ใช้ง่ายสุด)
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Xraycare API v1");
    c.RoutePrefix = "swagger"; // เปิดที่ /swagger
});

// ❗ ปิด HTTPS redirection ไปก่อน (ใน Docker ถ้าเปิดแค่พอร์ต 80 มันจะ redirect พัง)
//// if (!app.Environment.IsDevelopment())
//// {
////     app.UseHttpsRedirection();
//// }

// หรือถ้าอยากให้เปิดเฉพาะ production จริง ๆ ใช้แบบนี้
// if (!app.Environment.IsDevelopment())
// {
//     app.UseHttpsRedirection();
// }

app.UseRouting();
app.UseCors();

// ถ้ามี Auth ก็เติมได้
// app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.ApplyMigration();
app.SeedDefaultAdmin();

app.Run();
