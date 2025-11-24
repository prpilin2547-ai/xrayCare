using System.ComponentModel.DataAnnotations;

namespace db.xraycare;

public class BaseTable
{
    [Key]
    public int RID { get; set; }
}
