using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using api.xraycare.Database;

namespace api.xraycare.Services;

public class CurrentUserContext : ICurrentUserContext
{
    public const string HeaderName = "X-User-Id";
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly DataContext _db;
    private bool? _isSuperAdmin;
    private int? _userId;

    public CurrentUserContext(IHttpContextAccessor httpContextAccessor, DataContext db)
    {
        _httpContextAccessor = httpContextAccessor;
        _db = db;
    }

    public int? UserId
    {
        get
        {
            if (_userId.HasValue) return _userId;
            var header = _httpContextAccessor.HttpContext?.Request?.Headers[HeaderName].FirstOrDefault();
            if (string.IsNullOrEmpty(header) || !int.TryParse(header, out var id) || id <= 0)
                return null;
            _userId = id;
            return id;
        }
    }

    public bool IsSuperAdmin
    {
        get
        {
            if (_isSuperAdmin.HasValue) return _isSuperAdmin.Value;
            var uid = UserId;
            if (uid == null) { _isSuperAdmin = false; return false; }
            var user = _db.Users.AsNoTracking().FirstOrDefault(u => u.RID == uid);
            _isSuperAdmin = user?.IsSuperAdmin ?? false;
            return _isSuperAdmin.Value;
        }
    }
}
