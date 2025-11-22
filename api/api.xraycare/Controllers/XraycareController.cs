using api.xraycare.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace api.xraycare.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class XraycareController : ControllerBase
    {
        private readonly DataContext _db;

        public XraycareController(DataContext db)
        {
            _db = db;
        }

        // GET: api/xraycare/machines
        [HttpGet("GetAllMachines")]
        public async Task<IActionResult> GetMachines()
        {
            var machines = await _db.Machines.ToListAsync();
            return Ok(machines);
        }
    }
}
