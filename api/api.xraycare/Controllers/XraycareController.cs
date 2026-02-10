using api.xraycare.Database;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using db.xraycare;

namespace api.xraycare.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class XraycareController : ControllerBase
    {
        private readonly DataContext _db;
        private readonly ILogger<XraycareController> _logger;

        public XraycareController(DataContext db, ILogger<XraycareController> logger)
        {
            _db = db;
            _logger = logger;
        }

        // ===================== Machine Endpoints =====================

        // GET: api/xraycare/GetAllMachines
        [HttpGet("GetAllMachines")]
        public async Task<IActionResult> GetMachines()
        {
            var list = await _db.Machines
                .OrderBy(m => m.RID)
                .Select(m => new
                {
                    id = m.RID,
                    machineName = m.Machine_name,
                    room = m.Room,
                    registerDate = m.Register_date,
                    caretaker = m.Caretaker
                })
                .ToListAsync();
            return Ok(list);
        }

        // POST: api/xraycare/AddMachine
        [HttpPost("AddMachine")]
        public async Task<IActionResult> AddMachine([FromBody] AddMachineRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.machineName))
                return BadRequest("machineName is required.");

            try
            {
                var machine = new Machine
                {
                    Machine_name = request.machineName,
                    Room = request.room ?? "",
                    Register_date = request.registerDate ?? "",
                    Caretaker = request.caretaker ?? ""
                };
                _db.Machines.Add(machine);
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = machine.RID,
                    machineName = machine.Machine_name,
                    room = machine.Room,
                    registerDate = machine.Register_date,
                    caretaker = machine.Caretaker
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddMachine failed");
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }

        // DELETE: api/xraycare/DeleteMachine/5
        [HttpDelete("DeleteMachine/{id}")]
        public async Task<IActionResult> DeleteMachine(int id)
        {
            try
            {
                var machine = await _db.Machines.FindAsync(id);
                if (machine == null)
                    return NotFound($"ไม่พบเครื่องเอกซ์เรย์ที่มี ID = {id}");

                _db.Machines.Remove(machine);
                await _db.SaveChangesAsync();

                return Ok(new { message = "ลบข้อมูลสำเร็จ", id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteMachine failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }

        // ===================== User Endpoints =====================

        // GET: api/xraycare/GetAllUsers
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var list = await _db.Users
                .OrderBy(u => u.RID)
                .Select(u => new
                {
                    id = u.RID,
                    username = u.Username,
                    password = u.Password,
                    position = u.Position
                })
                .ToListAsync();
            return Ok(list);
        }

        // POST: api/xraycare/AddUser
        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser([FromBody] AddUserRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.username))
                return BadRequest("username is required.");
            if (string.IsNullOrWhiteSpace(request.password))
                return BadRequest("password is required.");

            try
            {
                var user = new UserAccount
                {
                    Username = request.username,
                    Password = request.password,
                    Position = request.position ?? ""
                };
                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = user.RID,
                    username = user.Username,
                    password = user.Password,
                    position = user.Position
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddUser failed");
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }

        // PUT: api/xraycare/UpdateUserPassword/5
        [HttpPut("UpdateUserPassword/{id}")]
        public async Task<IActionResult> UpdateUserPassword(int id, [FromBody] UpdatePasswordRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.password))
                return BadRequest("password is required.");

            try
            {
                var user = await _db.Users.FindAsync(id);
                if (user == null)
                    return NotFound($"ไม่พบผู้ใช้ที่มี ID = {id}");

                user.Password = request.password;
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = user.RID,
                    username = user.Username,
                    password = user.Password,
                    position = user.Position
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateUserPassword failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }

        // DELETE: api/xraycare/DeleteUser/5
        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var user = await _db.Users.FindAsync(id);
                if (user == null)
                    return NotFound($"ไม่พบผู้ใช้ที่มี ID = {id}");

                _db.Users.Remove(user);
                await _db.SaveChangesAsync();

                return Ok(new { message = "ลบผู้ใช้สำเร็จ", id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteUser failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }
        // ===================== Repair Request Endpoints =====================

        // GET: api/xraycare/GetAllRepairRequests
        [HttpGet("GetAllRepairRequests")]
        public async Task<IActionResult> GetAllRepairRequests()
        {
            var list = await _db.RepairRequests
                .OrderBy(r => r.RID)
                .Select(r => new
                {
                    id = r.RID,
                    equipment = r.Equipment,
                    room = r.Room,
                    requestDate = r.RequestDate,
                    detail = r.Detail,
                    remarks = r.Remarks,
                    statusText = r.StatusText,
                    imageData = r.ImageData
                })
                .ToListAsync();
            return Ok(list);
        }

        // POST: api/xraycare/AddRepairRequest
        [HttpPost("AddRepairRequest")]
        public async Task<IActionResult> AddRepairRequest([FromBody] AddRepairRequestDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.equipment))
                return BadRequest("equipment is required.");

            try
            {
                var entity = new RepairRequest
                {
                    Equipment = request.equipment,
                    Room = request.room ?? "",
                    RequestDate = request.requestDate ?? "",
                    Detail = request.detail ?? "",
                    Remarks = request.remarks ?? "",
                    StatusText = request.statusText ?? "รอซ่อม",
                    ImageData = request.imageData
                };
                _db.RepairRequests.Add(entity);
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = entity.RID,
                    equipment = entity.Equipment,
                    room = entity.Room,
                    requestDate = entity.RequestDate,
                    detail = entity.Detail,
                    remarks = entity.Remarks,
                    statusText = entity.StatusText,
                    imageData = entity.ImageData
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddRepairRequest failed");
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }

        // PUT: api/xraycare/UpdateRepairStatus/5
        [HttpPut("UpdateRepairStatus/{id}")]
        public async Task<IActionResult> UpdateRepairStatus(int id, [FromBody] UpdateRepairStatusDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.statusText))
                return BadRequest("statusText is required.");

            try
            {
                var entity = await _db.RepairRequests.FindAsync(id);
                if (entity == null)
                    return NotFound($"ไม่พบรายการแจ้งซ่อมที่มี ID = {id}");

                entity.StatusText = request.statusText;
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = entity.RID,
                    equipment = entity.Equipment,
                    room = entity.Room,
                    requestDate = entity.RequestDate,
                    detail = entity.Detail,
                    remarks = entity.Remarks,
                    statusText = entity.StatusText,
                    imageData = entity.ImageData
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateRepairStatus failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }

        // DELETE: api/xraycare/DeleteRepairRequest/5
        [HttpDelete("DeleteRepairRequest/{id}")]
        public async Task<IActionResult> DeleteRepairRequest(int id)
        {
            try
            {
                var entity = await _db.RepairRequests.FindAsync(id);
                if (entity == null)
                    return NotFound($"ไม่พบรายการแจ้งซ่อมที่มี ID = {id}");

                _db.RepairRequests.Remove(entity);
                await _db.SaveChangesAsync();

                return Ok(new { message = "ลบรายการแจ้งซ่อมสำเร็จ", id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteRepairRequest failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }
    }

    // ===================== Request DTOs =====================

    public class AddMachineRequest
    {
        public string machineName { get; set; } = "";
        public string? room { get; set; }
        public string? registerDate { get; set; }
        public string? caretaker { get; set; }
    }

    public class AddUserRequest
    {
        public string username { get; set; } = "";
        public string password { get; set; } = "";
        public string? position { get; set; }
    }

    public class UpdatePasswordRequest
    {
        public string password { get; set; } = "";
    }

    public class AddRepairRequestDto
    {
        public string equipment { get; set; } = "";
        public string? room { get; set; }
        public string? requestDate { get; set; }
        public string? detail { get; set; }
        public string? remarks { get; set; }
        public string? statusText { get; set; }
        public string? imageData { get; set; }
    }

    public class UpdateRepairStatusDto
    {
        public string statusText { get; set; } = "";
    }
}
