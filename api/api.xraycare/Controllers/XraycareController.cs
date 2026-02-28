using System.Text.Json;
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

        // ===================== Login Endpoint =====================

        // POST: api/xraycare/Login
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.username))
                return BadRequest("username is required.");
            if (string.IsNullOrWhiteSpace(request.password))
                return BadRequest("password is required.");

            try
            {
                var user = await _db.Users
                    .FirstOrDefaultAsync(u => u.Username == request.username && u.Password == request.password);

                if (user == null)
                    return Unauthorized(new { message = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });

                return Ok(new
                {
                    id = user.RID,
                    username = user.Username,
                    position = user.Position
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed");
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
                .OrderByDescending(r => r.RID)
                .Select(r => new
                {
                    id = r.RID,
                    equipment = r.Equipment,
                    room = r.Room,
                    requestDate = r.RequestDate,
                    reporterName = r.ReporterName,
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
                    ReporterName = request.reporterName ?? "",
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
                    reporterName = entity.ReporterName,
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
                    reporterName = entity.ReporterName,
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

        // ===================== Checklist Record Endpoints =====================

        // GET: api/xraycare/GetAllChecklistRecords
        [HttpGet("GetAllChecklistRecords")]
        public async Task<IActionResult> GetAllChecklistRecords()
        {
            var list = await _db.ChecklistRecords
                .OrderByDescending(c => c.RID)
                .Select(c => new
                {
                    id = c.RID,
                    formType = c.FormType,
                    machineName = c.MachineName,
                    room = c.Room,
                    checkDate = c.CheckDate,
                    tester = c.Tester,
                    jsonData = c.JsonData
                })
                .ToListAsync();
            return Ok(list);
        }

        // GET: api/xraycare/GetChecklistRecord/5
        [HttpGet("GetChecklistRecord/{id}")]
        public async Task<IActionResult> GetChecklistRecord(int id)
        {
            var record = await _db.ChecklistRecords
                .Where(c => c.RID == id)
                .Select(c => new
                {
                    id = c.RID,
                    formType = c.FormType,
                    machineName = c.MachineName,
                    room = c.Room,
                    checkDate = c.CheckDate,
                    tester = c.Tester,
                    jsonData = c.JsonData
                })
                .FirstOrDefaultAsync();
            if (record == null)
                return NotFound($"ไม่พบรายการ Checklist ที่มี ID = {id}");
            return Ok(record);
        }

        // GET: api/xraycare/GetChecklistRecordsByForm/{formType}
        [HttpGet("GetChecklistRecordsByForm/{formType}")]
        public async Task<IActionResult> GetChecklistRecordsByForm(string formType)
        {
            var list = await _db.ChecklistRecords
                .Where(c => c.FormType == formType)
                .OrderByDescending(c => c.RID)
                .Select(c => new
                {
                    id = c.RID,
                    formType = c.FormType,
                    machineName = c.MachineName,
                    room = c.Room,
                    checkDate = c.CheckDate,
                    tester = c.Tester,
                    jsonData = c.JsonData
                })
                .ToListAsync();
            return Ok(list);
        }

        // POST: api/xraycare/SaveChecklist
        [HttpPost("SaveChecklist")]
        public async Task<IActionResult> SaveChecklist([FromBody] SaveChecklistRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.formType))
                return BadRequest("formType is required.");

            try
            {
                var record = new ChecklistRecord
                {
                    FormType = request.formType,
                    MachineName = request.machineName ?? "",
                    Room = request.room ?? "",
                    CheckDate = request.checkDate ?? "",
                    Tester = request.tester ?? "",
                    JsonData = request.jsonData ?? ""
                };
                _db.ChecklistRecords.Add(record);
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = record.RID,
                    formType = record.FormType,
                    machineName = record.MachineName,
                    room = record.Room,
                    checkDate = record.CheckDate,
                    tester = record.Tester
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SaveChecklist failed");
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }

        // DELETE: api/xraycare/DeleteChecklistRecord/5
        [HttpDelete("DeleteChecklistRecord/{id}")]
        public async Task<IActionResult> DeleteChecklistRecord(int id)
        {
            try
            {
                var record = await _db.ChecklistRecords.FindAsync(id);
                if (record == null)
                    return NotFound($"ไม่พบรายการ Checklist ที่มี ID = {id}");

                _db.ChecklistRecords.Remove(record);
                await _db.SaveChangesAsync();

                return Ok(new { message = "ลบรายการ Checklist สำเร็จ", id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteChecklistRecord failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }

        // ===================== Schedule Config Endpoints =====================

        // GET: api/xraycare/GetAllScheduleConfigs
        [HttpGet("GetAllScheduleConfigs")]
        public async Task<IActionResult> GetAllScheduleConfigs()
        {
            var list = await _db.ScheduleConfigs
                .OrderBy(s => s.RID)
                .Select(s => new
                {
                    id = s.RID,
                    startDate = s.StartDate,
                    frequencyType = s.FrequencyType,
                    description = s.Description,
                    formTypes = s.FormTypes
                })
                .ToListAsync();
            return Ok(list);
        }

        // POST: api/xraycare/AddScheduleConfig
        [HttpPost("AddScheduleConfig")]
        public async Task<IActionResult> AddScheduleConfig([FromBody] AddScheduleConfigRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.startDate))
                return BadRequest("startDate is required.");
            if (string.IsNullOrWhiteSpace(request.frequencyType))
                return BadRequest("frequencyType is required.");

            try
            {
                var formTypesJson = request.formTypes != null && request.formTypes.Count > 0
                    ? JsonSerializer.Serialize(request.formTypes)
                    : null;
                var entity = new ScheduleConfig
                {
                    StartDate = request.startDate,
                    FrequencyType = request.frequencyType,
                    Description = request.description ?? "",
                    FormTypes = formTypesJson
                };
                _db.ScheduleConfigs.Add(entity);
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = entity.RID,
                    startDate = entity.StartDate,
                    frequencyType = entity.FrequencyType,
                    description = entity.Description,
                    formTypes = entity.FormTypes
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddScheduleConfig failed");
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }

        // PUT: api/xraycare/UpdateScheduleConfig/5
        [HttpPut("UpdateScheduleConfig/{id}")]
        public async Task<IActionResult> UpdateScheduleConfig(int id, [FromBody] UpdateScheduleConfigRequest request)
        {
            if (request == null)
                return BadRequest("Request body is required.");
            try
            {
                var entity = await _db.ScheduleConfigs.FindAsync(id);
                if (entity == null)
                    return NotFound($"ไม่พบ Schedule Config ที่มี ID = {id}");

                if (!string.IsNullOrWhiteSpace(request.startDate))
                    entity.StartDate = request.startDate;
                if (!string.IsNullOrWhiteSpace(request.frequencyType))
                    entity.FrequencyType = request.frequencyType;
                if (request.description != null)
                    entity.Description = request.description;
                if (request.formTypes != null)
                    entity.FormTypes = request.formTypes.Count > 0
                        ? JsonSerializer.Serialize(request.formTypes)
                        : null;

                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = entity.RID,
                    startDate = entity.StartDate,
                    frequencyType = entity.FrequencyType,
                    description = entity.Description,
                    formTypes = entity.FormTypes
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateScheduleConfig failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }

        // DELETE: api/xraycare/DeleteScheduleConfig/5
        [HttpDelete("DeleteScheduleConfig/{id}")]
        public async Task<IActionResult> DeleteScheduleConfig(int id)
        {
            try
            {
                var entity = await _db.ScheduleConfigs.FindAsync(id);
                if (entity == null)
                    return NotFound($"ไม่พบ Schedule Config ที่มี ID = {id}");

                _db.ScheduleConfigs.Remove(entity);
                await _db.SaveChangesAsync();

                return Ok(new { message = "ลบ Schedule Config สำเร็จ", id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteScheduleConfig failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, message);
            }
        }

        // GET: api/xraycare/GetNotifications
        [HttpGet("GetNotifications")]
        public async Task<IActionResult> GetNotifications()
        {
            try
            {
                var configs = await _db.ScheduleConfigs.ToListAsync();
                var todayDate = DateTime.Today;
                var notifications = new List<object>();

                foreach (var cfg in configs)
                {
                    if (string.IsNullOrWhiteSpace(cfg.StartDate) || string.IsNullOrWhiteSpace(cfg.FrequencyType))
                        continue;

                    int day, month, year;
                    if (cfg.StartDate.Contains('-'))
                    {
                        var parts = cfg.StartDate.Split('-');
                        if (parts.Length != 3) continue;
                        if (!int.TryParse(parts[0], out year) ||
                            !int.TryParse(parts[1], out month) ||
                            !int.TryParse(parts[2], out day))
                            continue;
                    }
                    else
                    {
                        var parts = cfg.StartDate.Split('/');
                        if (parts.Length != 3) continue;
                        if (!int.TryParse(parts[0], out day) ||
                            !int.TryParse(parts[1], out month) ||
                            !int.TryParse(parts[2], out year))
                            continue;
                    }

                    DateTime startDate;
                    try { startDate = new DateTime(year, month, day); }
                    catch { continue; }

                    int intervalMonths = cfg.FrequencyType switch
                    {
                        "1m" => 1,
                        "3m" => 3,
                        "6m" => 6,
                        _ => 0
                    };
                    if (intervalMonths == 0) continue;

                    var nextCheck = startDate;
                    while (nextCheck < todayDate)
                    {
                        nextCheck = nextCheck.AddMonths(intervalMonths);
                    }

                    int daysRemaining = (nextCheck - todayDate).Days;

                    string status = daysRemaining == 0 ? "today"
                                  : daysRemaining <= 7 ? "upcoming"
                                  : "info";

                    string frequencyLabel = cfg.FrequencyType switch
                    {
                        "1m" => "ทุก 1 เดือน",
                        "3m" => "ทุก 3 เดือน",
                        "6m" => "ทุก 6 เดือน",
                        _ => cfg.FrequencyType ?? ""
                    };

                    notifications.Add(new
                    {
                        id = cfg.RID,
                        status,
                        daysRemaining,
                        nextCheckDate = nextCheck.ToString("dd/MM/yyyy"),
                        frequencyType = cfg.FrequencyType,
                        frequencyLabel,
                        description = cfg.Description
                    });
                }

                return Ok(notifications.OrderBy(n => ((dynamic)n).daysRemaining));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetNotifications failed");
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
        public string? reporterName { get; set; }
        public string? detail { get; set; }
        public string? remarks { get; set; }
        public string? statusText { get; set; }
        public string? imageData { get; set; }
    }

    public class UpdateRepairStatusDto
    {
        public string statusText { get; set; } = "";
    }

    public class LoginRequest
    {
        public string username { get; set; } = "";
        public string password { get; set; } = "";
    }

    public class SaveChecklistRequest
    {
        public string formType { get; set; } = "";
        public string? machineName { get; set; }
        public string? room { get; set; }
        public string? checkDate { get; set; }
        public string? tester { get; set; }
        public string? jsonData { get; set; }
    }

    public class AddScheduleConfigRequest
    {
        public string startDate { get; set; } = "";
        public string frequencyType { get; set; } = "";
        public string? description { get; set; }
        public List<string>? formTypes { get; set; }
    }

    public class UpdateScheduleConfigRequest
    {
        public string? startDate { get; set; }
        public string? frequencyType { get; set; }
        public string? description { get; set; }
        public List<string>? formTypes { get; set; }
    }
}
