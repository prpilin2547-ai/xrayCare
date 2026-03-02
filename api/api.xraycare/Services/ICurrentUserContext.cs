namespace api.xraycare.Services;

/// <summary>Provides the current user from the request (X-User-Id header). Used to check IsSuperAdmin.</summary>
public interface ICurrentUserContext
{
    int? UserId { get; }
    bool IsSuperAdmin { get; }
}
