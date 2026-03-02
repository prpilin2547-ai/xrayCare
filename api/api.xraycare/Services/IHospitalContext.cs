namespace api.xraycare.Services;

/// <summary>Provides the current hospital ID from the request (e.g. X-Hospital-Id header).</summary>
public interface IHospitalContext
{
    /// <summary>Current hospital ID, or null if not set/invalid.</summary>
    int? HospitalId { get; }
}
