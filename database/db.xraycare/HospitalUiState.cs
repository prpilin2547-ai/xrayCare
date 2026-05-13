namespace db.xraycare;

/// <summary>Per-hospital shared UI state (daily checklist progress + PM calendar overlays) synced across all users/devices.</summary>
public class HospitalUiState : BaseTable
{
    public int HospitalId { get; set; }
    public string JsonData { get; set; } = "{}";
}
