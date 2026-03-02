using Microsoft.AspNetCore.Http;

namespace api.xraycare.Services;

public class HospitalContext : IHospitalContext
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    public const string HeaderName = "X-Hospital-Id";

    public HospitalContext(IHttpContextAccessor httpContextAccessor)
    {
        _httpContextAccessor = httpContextAccessor;
    }

    public int? HospitalId
    {
        get
        {
            var header = _httpContextAccessor.HttpContext?.Request?.Headers[HeaderName].FirstOrDefault();
            if (string.IsNullOrEmpty(header) || !int.TryParse(header, out var id) || id < 0)
                return null;
            return id; // 0 = "all hospitals" for superadmin
        }
    }
}
