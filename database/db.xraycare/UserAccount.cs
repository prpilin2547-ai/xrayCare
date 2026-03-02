using System.ComponentModel.DataAnnotations.Schema;

namespace db.xraycare;

public class UserAccount : BaseTable
{
    public int HospitalId { get; set; }
    public string? Username { get; set; }
    public string? Password { get; set; }
    public string? Position { get; set; }
    /// <summary>When true, user can manage all hospitals (not scoped to one hospital).</summary>
    [Column("IsSuperAdmin")]
    public bool IsSuperAdmin { get; set; }
}
