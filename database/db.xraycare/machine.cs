namespace db.xraycare;

public class Machine : BaseTable
{
    public string? Machine_name { get; set; }
    public string? Room { get; set; }
    public string? Register_date { get; set; }
    public string? Caretaker { get; set; }
}
