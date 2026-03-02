namespace db.xraycare;

public class RepairRequest : BaseTable
{
    public int HospitalId { get; set; }
    public string? Equipment { get; set; }
    public string? Room { get; set; }
    public string? RequestDate { get; set; }
    /// <summary>ชื่อผู้แจ้งซ่อม (ผู้ทำรายการ)</summary>
    public string? ReporterName { get; set; }
    public string? Detail { get; set; }
    public string? Remarks { get; set; }
    public string? StatusText { get; set; }
    public string? ImageData { get; set; }
}
