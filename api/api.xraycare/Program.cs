using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

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

// ถ้ามี Auth ก็เติมได้
// app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.ApplyMigration();

app.Run();
