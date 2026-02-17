namespace db.xraycare;

public class UserAccount : BaseTable
{
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? Position { get; set; }
}
