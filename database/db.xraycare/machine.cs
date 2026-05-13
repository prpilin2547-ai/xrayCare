namespace db.xraycare;

public class Machine : BaseTable
{
    public int HospitalId { get; set; }
    public string? Machine_name { get; set; }
    public string? Room { get; set; }
    public string? Register_date { get; set; }
    public string? Caretaker { get; set; }

    /// <summary>Daily checklist status; paired with <see cref="StatusDateKey"/> (yyyy-MM-dd, Asia/Bangkok).</summary>
    public ChecklistMachineStatus Status { get; set; }

    /// <summary>Calendar day (yyyy-MM-dd, Asia/Bangkok) for which <see cref="Status"/> applies.</summary>
    public string? StatusDateKey { get; set; }
}
