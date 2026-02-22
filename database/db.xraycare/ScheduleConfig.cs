namespace db.xraycare;

public class ScheduleConfig : BaseTable
{
    public string? StartDate { get; set; }
    public string? FrequencyType { get; set; }
    public string? Description { get; set; }
    /// <summary>JSON array of form type codes, e.g. ["F10","F12"]</summary>
    public string? FormTypes { get; set; }
}
