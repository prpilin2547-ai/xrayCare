namespace db.xraycare;

public class ChecklistRecord : BaseTable
{
    public int HospitalId { get; set; }
    public string? FormType { get; set; }
    public string? MachineName { get; set; }
    public string? Room { get; set; }
    public string? CheckDate { get; set; }
    public string? Tester { get; set; }
    public string? JsonData { get; set; }
}
