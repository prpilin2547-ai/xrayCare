namespace db.xraycare;

public class ScheduleConfig : BaseTable
{
    public string? StartDate { get; set; }
    public string? FrequencyType { get; set; }
    public string? Description { get; set; }
}
