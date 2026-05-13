using System.Globalization;
using System.Text.Json;
using api.xraycare.Database;
using api.xraycare.Services;
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
        private readonly IHospitalContext _hospital;
        private readonly ICurrentUserContext _currentUser;

        public XraycareController(DataContext db, ILogger<XraycareController> logger, IHospitalContext hospital, ICurrentUserContext currentUser)
        {
            _db = db;
            _logger = logger;
            _hospital = hospital;
            _currentUser = currentUser;
        }

        private int? GetHospitalId() => _hospital.HospitalId;

        /// <summary>Calendar date yyyy-MM-dd in Asia/Bangkok (matches daily checklist reset).</summary>
        private static string GetBangkokDateKey()
        {
            var tz = TimeZoneInfo.FindSystemTimeZoneById("Asia/Bangkok");
            var local = TimeZoneInfo.ConvertTimeFromUtc(DateTime.UtcNow, tz);
            return local.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);
        }

        private static string? NormalizeDateKey(string? key) =>
            string.IsNullOrWhiteSpace(key) ? null : key.Trim();

        // ===================== Health (no auth required) =====================

        // GET: api/xraycare/Ping
        [HttpGet("Ping")]
        public IActionResult Ping()
        {
            return Ok(new { ok = true, service = "Xraycare" });
        }

        // ===================== Hospital Endpoints (no hospital header required) =====================

        // GET: api/xraycare/GetHospitals
        [HttpGet("GetHospitals")]
        public async Task<IActionResult> GetHospitals()
        {
            var list = await _db.Hospitals
                .OrderBy(h => h.RID)
                .Select(h => new { id = h.RID, name = h.Name, code = h.Code })
                .ToListAsync();
            return Ok(list);
        }

        // POST: api/xraycare/AddHospital (Root Admin only)
        [HttpPost("AddHospital")]
        public async Task<IActionResult> AddHospital([FromBody] AddHospitalRequest request)
        {
            if (!_currentUser.IsSuperAdmin)
                return StatusCode(403, new { message = "เฉพาะ Root Admin เท่านั้นที่สร้างโรงพยาบาลใหม่ได้" });
            if (request == null || string.IsNullOrWhiteSpace(request.name))
                return BadRequest(new { message = "name is required." });

            try
            {
                var hospital = new Hospital
                {
                    Name = request.name,
                    Code = request.code ?? (request.name.Length > 0 ? request.name.Substring(0, Math.Min(10, request.name.Length)).ToUpperInvariant() : null)
                };
                _db.Hospitals.Add(hospital);
                await _db.SaveChangesAsync();
                return Ok(new { id = hospital.RID, name = hospital.Name, code = hospital.Code });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddHospital failed");
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message = message });
            }
        }

        // PUT: api/xraycare/UpdateHospital/5 (Root Admin: any hospital; SuperAdmin/Admin: own hospital only)
        [HttpPut("UpdateHospital/{id}")]
        public async Task<IActionResult> UpdateHospital(int id, [FromBody] UpdateHospitalRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Request body is required." });

            if (!_currentUser.IsSuperAdmin)
            {
                var hid = GetHospitalId();
                if (!hid.HasValue || hid.Value != id)
                    return StatusCode(403, new { message = "แก้ไขได้เฉพาะโรงพยาบาลของตนเองเท่านั้น" });
            }

            try
            {
                var hospital = await _db.Hospitals.FindAsync(id);
                if (hospital == null)
                    return NotFound(new { message = "ไม่พบโรงพยาบาลที่ระบุ" });

                if (!string.IsNullOrWhiteSpace(request.name)) hospital.Name = request.name;
                if (request.code != null) hospital.Code = request.code;
                await _db.SaveChangesAsync();
                return Ok(new { id = hospital.RID, name = hospital.Name, code = hospital.Code });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateHospital failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message = message });
            }
        }

        // DELETE: api/xraycare/DeleteHospital/5 (Root Admin only; fails if hospital has users/machines)
        [HttpDelete("DeleteHospital/{id}")]
        public async Task<IActionResult> DeleteHospital(int id)
        {
            if (!_currentUser.IsSuperAdmin)
                return StatusCode(403, new { message = "เฉพาะ Root Admin เท่านั้นที่ลบโรงพยาบาลได้" });

            try
            {
                var hospital = await _db.Hospitals.FindAsync(id);
                if (hospital == null)
                    return NotFound(new { message = "ไม่พบโรงพยาบาลที่ระบุ" });

                var hasUsers = await _db.Users.AnyAsync(u => u.HospitalId == id);
                if (hasUsers)
                    return BadRequest(new { message = "ไม่สามารถลบได้ เนื่องจากมีผู้ใช้ในโรงพยาบาลนี้ กรุณาย้ายหรือลบผู้ใช้ก่อน" });

                var hasMachines = await _db.Machines.AnyAsync(m => m.HospitalId == id);
                if (hasMachines)
                    return BadRequest(new { message = "ไม่สามารถลบได้ เนื่องจากมีเครื่องมือในโรงพยาบาลนี้" });

                _db.Hospitals.Remove(hospital);
                await _db.SaveChangesAsync();
                return Ok(new { message = "ลบโรงพยาบาลสำเร็จ", id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteHospital failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message = message });
            }
        }

        // ===================== Machine Endpoints =====================

        // GET: api/xraycare/GetAllMachines
        [HttpGet("GetAllMachines")]
        public async Task<IActionResult> GetMachines()
        {
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            var todayKey = GetBangkokDateKey();
            var machines = await _db.Machines
                .Where(m => m.HospitalId == hid)
                .OrderBy(m => m.RID)
                .ToListAsync();

            var changed = false;
            foreach (var m in machines)
            {
                var dk = NormalizeDateKey(m.StatusDateKey);
                if (dk != todayKey)
                {
                    m.Status = ChecklistMachineStatus.unCheck;
                    m.StatusDateKey = todayKey;
                    changed = true;
                }
            }

            if (changed)
                await _db.SaveChangesAsync();

            var list = machines.Select(m => new
            {
                id = m.RID,
                machineName = m.Machine_name,
                room = m.Room,
                registerDate = m.Register_date,
                caretaker = m.Caretaker,
                status = m.Status.ToString(),
                statusDateKey = m.StatusDateKey
            }).ToList();
            return Ok(list);
        }

        // POST: api/xraycare/AddMachine
        [HttpPost("AddMachine")]
        public async Task<IActionResult> AddMachine([FromBody] AddMachineRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.machineName))
                return BadRequest(new { message = "machineName is required." });

            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var machine = new Machine
                {
                    HospitalId = hid.Value,
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
                    caretaker = machine.Caretaker,
                    status = machine.Status.ToString(),
                    statusDateKey = machine.StatusDateKey
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddMachine failed");
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message = message });
            }
        }

        // DELETE: api/xraycare/DeleteMachine/5
        [HttpDelete("DeleteMachine/{id}")]
        public async Task<IActionResult> DeleteMachine(int id)
        {
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var machine = await _db.Machines.FirstOrDefaultAsync(m => m.RID == id && m.HospitalId == hid);
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
                return StatusCode(500, new { message = message });
            }
        }

        // ===================== Login Endpoint =====================

        // POST: api/xraycare/Login (hospitalId optional; if omitted, first hospital is used)
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.username))
                return BadRequest(new { message = "username is required." });
            if (string.IsNullOrWhiteSpace(request.password))
                return BadRequest(new { message = "password is required." });

            try
            {
                int hospitalId = request.hospitalId ?? _db.Hospitals.OrderBy(h => h.RID).Select(h => h.RID).FirstOrDefault();
                if (hospitalId <= 0)
                    return Unauthorized(new { message = "ไม่พบโรงพยาบาลในระบบ" });

                var user = await _db.Users
                    .FirstOrDefaultAsync(u => u.Username == request.username && u.Password == request.password && u.HospitalId == hospitalId);

                if (user == null)
                    return Unauthorized(new { message = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง หรือไม่สังกัดโรงพยาบาลที่เลือก" });

                var hospital = await _db.Hospitals.FindAsync(hospitalId);
                return Ok(new
                {
                    id = user.RID,
                    username = user.Username,
                    position = user.Position,
                    hospitalId = hospitalId,
                    hospitalName = hospital?.Name ?? "",
                    isSuperAdmin = user.IsSuperAdmin
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Login failed");
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message = message });
            }
        }

        // ===================== User Endpoints =====================

        // GET: api/xraycare/GetAllUsers (X-User-Id required for superadmin; X-Hospital-Id: 0 = all hospitals when superadmin)
        [HttpGet("GetAllUsers")]
        public async Task<IActionResult> GetAllUsers()
        {
            var hid = GetHospitalId();
            var isSuperAdmin = _currentUser.IsSuperAdmin;
            IQueryable<UserAccount> query = _db.Users;
            if (isSuperAdmin && (hid == null || hid == 0))
            {
                // SuperAdmin with no hospital or "all" (0): return users from all hospitals
            }
            else if (hid.HasValue && hid.Value > 0)
            {
                query = query.Where(u => u.HospitalId == hid.Value);
            }
            else
            {
                return BadRequest(new { message = "X-Hospital-Id header is required." });
            }

            var list = await query
                .OrderBy(u => u.RID)
                .Select(u => new
                {
                    id = u.RID,
                    username = u.Username,
                    password = u.Password,
                    position = u.Position,
                    hospitalId = u.HospitalId,
                    isSuperAdmin = u.IsSuperAdmin
                })
                .ToListAsync();
            return Ok(list);
        }

        // POST: api/xraycare/AddUser (SuperAdmin can pass hospitalId when X-Hospital-Id is 0)
        [HttpPost("AddUser")]
        public async Task<IActionResult> AddUser([FromBody] AddUserRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.username))
                return BadRequest(new { message = "username is required." });
            if (string.IsNullOrWhiteSpace(request.password))
                return BadRequest(new { message = "password is required." });
            var hid = GetHospitalId();
            var isSuperAdmin = _currentUser.IsSuperAdmin;
            int targetHospitalId;
            if (isSuperAdmin && (hid == null || hid == 0))
            {
                if (!request.hospitalId.HasValue || request.hospitalId.Value <= 0)
                    return BadRequest(new { message = "SuperAdmin must provide hospitalId when managing all hospitals." });
                var exists = await _db.Hospitals.AnyAsync(h => h.RID == request.hospitalId.Value);
                if (!exists) return BadRequest(new { message = "Invalid hospitalId." });
                targetHospitalId = request.hospitalId.Value;
            }
            else
            {
                if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
                targetHospitalId = hid.Value;
                if (request.hospitalId.HasValue && request.hospitalId.Value > 0)
                {
                    var exists = await _db.Hospitals.AnyAsync(h => h.RID == request.hospitalId.Value);
                    if (exists)
                        targetHospitalId = request.hospitalId.Value;
                }
            }
            try
            {
                var user = new UserAccount
                {
                    HospitalId = targetHospitalId,
                    Username = request.username,
                    Password = request.password,
                    Position = request.position ?? "",
                    IsSuperAdmin = isSuperAdmin && (request.isSuperAdmin == true)
                };
                _db.Users.Add(user);
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = user.RID,
                    username = user.Username,
                    password = user.Password,
                    position = user.Position,
                    hospitalId = user.HospitalId,
                    isSuperAdmin = user.IsSuperAdmin
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddUser failed");
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message = message });
            }
        }

        // PUT: api/xraycare/UpdateUserPassword/5 (SuperAdmin can update any user)
        [HttpPut("UpdateUserPassword/{id}")]
        public async Task<IActionResult> UpdateUserPassword(int id, [FromBody] UpdatePasswordRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.password))
                return BadRequest(new { message = "password is required." });
            var hid = GetHospitalId();
            if (hid == null && !_currentUser.IsSuperAdmin) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var user = _currentUser.IsSuperAdmin
                    ? await _db.Users.FirstOrDefaultAsync(u => u.RID == id)
                    : await _db.Users.FirstOrDefaultAsync(u => u.RID == id && u.HospitalId == hid);
                if (user == null)
                    return NotFound(new { message = $"ไม่พบผู้ใช้ที่มี ID = {id}" });

                user.Password = request.password;
                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = user.RID,
                    username = user.Username,
                    password = user.Password,
                    position = user.Position,
                    hospitalId = user.HospitalId
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateUserPassword failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message = message });
            }
        }

        // PUT: api/xraycare/UpdateUser/5 (change hospital, role, and/or password; SuperAdmin can edit any user)
        [HttpPut("UpdateUser/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Request body is required." });
            var hid = GetHospitalId();
            if (hid == null && !_currentUser.IsSuperAdmin) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var user = _currentUser.IsSuperAdmin
                    ? await _db.Users.FirstOrDefaultAsync(u => u.RID == id)
                    : await _db.Users.FirstOrDefaultAsync(u => u.RID == id && u.HospitalId == hid);
                if (user == null)
                    return NotFound(new { message = $"ไม่พบผู้ใช้ที่มี ID = {id}" });

                if (request.hospitalId.HasValue && request.hospitalId.Value > 0)
                {
                    var hospitalExists = await _db.Hospitals.AnyAsync(h => h.RID == request.hospitalId.Value);
                    if (hospitalExists)
                        user.HospitalId = request.hospitalId.Value;
                }
                if (!string.IsNullOrWhiteSpace(request.position))
                    user.Position = request.position;
                if (!string.IsNullOrWhiteSpace(request.password))
                    user.Password = request.password;
                if (_currentUser.IsSuperAdmin && request.isSuperAdmin.HasValue)
                    user.IsSuperAdmin = request.isSuperAdmin.Value;

                await _db.SaveChangesAsync();

                return Ok(new
                {
                    id = user.RID,
                    username = user.Username,
                    password = user.Password,
                    position = user.Position,
                    hospitalId = user.HospitalId,
                    isSuperAdmin = user.IsSuperAdmin
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateUser failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message = message });
            }
        }

        // DELETE: api/xraycare/DeleteUser/5 (SuperAdmin can delete any user)
        [HttpDelete("DeleteUser/{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var hid = GetHospitalId();
            if (hid == null && !_currentUser.IsSuperAdmin) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var user = _currentUser.IsSuperAdmin
                    ? await _db.Users.FirstOrDefaultAsync(u => u.RID == id)
                    : await _db.Users.FirstOrDefaultAsync(u => u.RID == id && u.HospitalId == hid);
                if (user == null)
                    return NotFound(new { message = $"ไม่พบผู้ใช้ที่มี ID = {id}" });

                _db.Users.Remove(user);
                await _db.SaveChangesAsync();

                return Ok(new { message = "ลบผู้ใช้สำเร็จ", id });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteUser failed for ID {Id}", id);
                var message = ex.InnerException?.Message ?? ex.Message;
                return StatusCode(500, new { message = message });
            }
        }
        // ===================== Repair Request Endpoints =====================

        // GET: api/xraycare/GetAllRepairRequests
        [HttpGet("GetAllRepairRequests")]
        public async Task<IActionResult> GetAllRepairRequests()
        {
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            var list = await _db.RepairRequests
                .Where(r => r.HospitalId == hid)
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
                return BadRequest(new { message = "equipment is required." });

            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var entity = new RepairRequest
                {
                    HospitalId = hid.Value,
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
                return StatusCode(500, new { message = message });
            }
        }

        // PUT: api/xraycare/UpdateRepairStatus/5
        [HttpPut("UpdateRepairStatus/{id}")]
        public async Task<IActionResult> UpdateRepairStatus(int id, [FromBody] UpdateRepairStatusDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.statusText))
                return BadRequest(new { message = "statusText is required." });
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var entity = await _db.RepairRequests.FirstOrDefaultAsync(r => r.RID == id && r.HospitalId == hid);
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
                return StatusCode(500, new { message = message });
            }
        }

        // DELETE: api/xraycare/DeleteRepairRequest/5
        [HttpDelete("DeleteRepairRequest/{id}")]
        public async Task<IActionResult> DeleteRepairRequest(int id)
        {
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var entity = await _db.RepairRequests.FirstOrDefaultAsync(r => r.RID == id && r.HospitalId == hid);
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
                return StatusCode(500, new { message = message });
            }
        }

        // ===================== Checklist Record Endpoints =====================

        // GET: api/xraycare/GetAllChecklistRecords
        [HttpGet("GetAllChecklistRecords")]
        public async Task<IActionResult> GetAllChecklistRecords()
        {
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            var list = await _db.ChecklistRecords
                .Where(c => c.HospitalId == hid)
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
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            var record = await _db.ChecklistRecords
                .Where(c => c.RID == id && c.HospitalId == hid)
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
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            var list = await _db.ChecklistRecords
                .Where(c => c.FormType == formType && c.HospitalId == hid)
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
                return BadRequest(new { message = "formType is required." });
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var record = new ChecklistRecord
                {
                    HospitalId = hid.Value,
                    FormType = request.formType,
                    MachineName = request.machineName ?? "",
                    Room = request.room ?? "",
                    CheckDate = request.checkDate ?? "",
                    Tester = request.tester ?? "",
                    JsonData = request.jsonData ?? ""
                };
                _db.ChecklistRecords.Add(record);

                if (string.Equals(request.formType?.Trim(), "F1_F2", StringComparison.Ordinal))
                {
                    var machineName = (request.machineName ?? "").Trim();
                    if (!string.IsNullOrEmpty(machineName))
                    {
                        var hospitalMachines = await _db.Machines
                            .Where(m => m.HospitalId == hid.Value)
                            .ToListAsync();
                        var machine = hospitalMachines.FirstOrDefault(m =>
                            !string.IsNullOrWhiteSpace(m.Machine_name) &&
                            string.Equals(m.Machine_name.Trim(), machineName, StringComparison.OrdinalIgnoreCase));
                        if (machine != null)
                        {
                            var todayKey = GetBangkokDateKey();
                            machine.Status = ChecklistMachineStatus.Checked;
                            machine.StatusDateKey = todayKey;
                        }
                    }
                }

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
                return StatusCode(500, new { message = message });
            }
        }

        // DELETE: api/xraycare/DeleteChecklistRecord/5
        [HttpDelete("DeleteChecklistRecord/{id}")]
        public async Task<IActionResult> DeleteChecklistRecord(int id)
        {
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var record = await _db.ChecklistRecords.FirstOrDefaultAsync(c => c.RID == id && c.HospitalId == hid);
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
                return StatusCode(500, new { message = message });
            }
        }

        // ===================== Schedule Config Endpoints =====================

        // GET: api/xraycare/GetAllScheduleConfigs
        [HttpGet("GetAllScheduleConfigs")]
        public async Task<IActionResult> GetAllScheduleConfigs()
        {
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            var list = await _db.ScheduleConfigs
                .Where(s => s.HospitalId == hid)
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
                return BadRequest(new { message = "startDate is required." });
            if (string.IsNullOrWhiteSpace(request.frequencyType))
                return BadRequest(new { message = "frequencyType is required." });
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var formTypesJson = request.formTypes != null && request.formTypes.Count > 0
                    ? JsonSerializer.Serialize(request.formTypes)
                    : null;
                var entity = new ScheduleConfig
                {
                    HospitalId = hid.Value,
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
                return StatusCode(500, new { message = message });
            }
        }

        // PUT: api/xraycare/UpdateScheduleConfig/5
        [HttpPut("UpdateScheduleConfig/{id}")]
        public async Task<IActionResult> UpdateScheduleConfig(int id, [FromBody] UpdateScheduleConfigRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Request body is required." });
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var entity = await _db.ScheduleConfigs.FirstOrDefaultAsync(s => s.RID == id && s.HospitalId == hid);
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
                return StatusCode(500, new { message = message });
            }
        }

        // DELETE: api/xraycare/DeleteScheduleConfig/5
        [HttpDelete("DeleteScheduleConfig/{id}")]
        public async Task<IActionResult> DeleteScheduleConfig(int id)
        {
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var entity = await _db.ScheduleConfigs.FirstOrDefaultAsync(s => s.RID == id && s.HospitalId == hid);
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
                return StatusCode(500, new { message = message });
            }
        }

        // GET: api/xraycare/GetNotifications
        [HttpGet("GetNotifications")]
        public async Task<IActionResult> GetNotifications()
        {
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var configs = await _db.ScheduleConfigs.Where(s => s.HospitalId == hid).ToListAsync();
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
                return StatusCode(500, new { message = message });
            }
        }

        // ===================== Hospital shared UI state (daily checklist + PM calendar) =====================

        private static readonly JsonSerializerOptions HospitalUiJsonOptions = new()
        {
            PropertyNameCaseInsensitive = true,
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        private async Task<HospitalUiState> GetOrCreateHospitalUiStateRow(int hospitalId)
        {
            var row = await _db.HospitalUiStates.FirstOrDefaultAsync(x => x.HospitalId == hospitalId);
            if (row != null)
                return row;

            var created = new HospitalUiState
            {
                HospitalId = hospitalId,
                JsonData = "{}"
            };
            _db.HospitalUiStates.Add(created);
            await _db.SaveChangesAsync();
            return created;
        }

        private static HospitalUiStateBlob ParseHospitalUiBlob(string? json)
        {
            if (string.IsNullOrWhiteSpace(json))
                return new HospitalUiStateBlob();
            try
            {
                return JsonSerializer.Deserialize<HospitalUiStateBlob>(json, HospitalUiJsonOptions) ?? new HospitalUiStateBlob();
            }
            catch
            {
                return new HospitalUiStateBlob();
            }
        }

        // GET: api/xraycare/GetHospitalUiState
        [HttpGet("GetHospitalUiState")]
        public async Task<IActionResult> GetHospitalUiState()
        {
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var row = await _db.HospitalUiStates.AsNoTracking().FirstOrDefaultAsync(x => x.HospitalId == hid.Value);
                var blob = row == null ? new HospitalUiStateBlob() : ParseHospitalUiBlob(row.JsonData);
                return Ok(new
                {
                    dailyChecked = blob.DailyChecked ?? new Dictionary<string, List<string>>(),
                    pmEventsByDate = blob.PmEventsByDate ?? new Dictionary<string, List<string>>(),
                    pmMonthlyRules = blob.PmMonthlyRules ?? new Dictionary<string, string>(),
                    pmHiddenMonthlyTasks = blob.PmHiddenMonthlyTasks ?? new Dictionary<string, List<string>>(),
                    pmDisabledDailyDates = blob.PmDisabledDailyDates ?? new Dictionary<string, bool>()
                });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "GetHospitalUiState failed");
                return StatusCode(500, new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        // POST: api/xraycare/AppendDailyCheckedMachine
        [HttpPost("AppendDailyCheckedMachine")]
        public async Task<IActionResult> AppendDailyCheckedMachine([FromBody] AppendDailyCheckedMachineRequest request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.machineName))
                return BadRequest(new { message = "machineName is required." });
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var todayKey = GetBangkokDateKey();
                var name = request.machineName.Trim();
                var hospitalMachines = await _db.Machines
                    .Where(m => m.HospitalId == hid.Value)
                    .ToListAsync();
                var machine = hospitalMachines.FirstOrDefault(m =>
                    !string.IsNullOrWhiteSpace(m.Machine_name) &&
                    string.Equals(m.Machine_name.Trim(), name, StringComparison.OrdinalIgnoreCase));
                if (machine == null)
                    return Ok(new { ok = true, message = "Machine not found; nothing updated." });

                machine.Status = ChecklistMachineStatus.Checked;
                machine.StatusDateKey = todayKey;
                await _db.SaveChangesAsync();
                return Ok(new { ok = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AppendDailyCheckedMachine failed");
                return StatusCode(500, new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }

        // PUT: api/xraycare/SaveHospitalPmCalendar
        [HttpPut("SaveHospitalPmCalendar")]
        public async Task<IActionResult> SaveHospitalPmCalendar([FromBody] SaveHospitalPmCalendarRequest request)
        {
            if (request == null)
                return BadRequest(new { message = "Request body is required." });
            var hid = GetHospitalId();
            if (hid == null) return BadRequest(new { message = "X-Hospital-Id header is required." });
            try
            {
                var row = await GetOrCreateHospitalUiStateRow(hid.Value);
                var blob = ParseHospitalUiBlob(row.JsonData);
                blob.PmEventsByDate = request.pmEventsByDate ?? new Dictionary<string, List<string>>();
                blob.PmMonthlyRules = request.pmMonthlyRules ?? new Dictionary<string, string>();
                blob.PmHiddenMonthlyTasks = request.pmHiddenMonthlyTasks ?? new Dictionary<string, List<string>>();
                blob.PmDisabledDailyDates = request.pmDisabledDailyDates ?? new Dictionary<string, bool>();
                row.JsonData = JsonSerializer.Serialize(blob, HospitalUiJsonOptions);
                await _db.SaveChangesAsync();
                return Ok(new { ok = true });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "SaveHospitalPmCalendar failed");
                return StatusCode(500, new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }
    }

    internal class HospitalUiStateBlob
    {
        public Dictionary<string, List<string>>? DailyChecked { get; set; }
        public Dictionary<string, List<string>>? PmEventsByDate { get; set; }
        public Dictionary<string, string>? PmMonthlyRules { get; set; }
        public Dictionary<string, List<string>>? PmHiddenMonthlyTasks { get; set; }
        public Dictionary<string, bool>? PmDisabledDailyDates { get; set; }
    }

    public class AppendDailyCheckedMachineRequest
    {
        public string dateKey { get; set; } = "";
        public string machineName { get; set; } = "";
    }

    public class SaveHospitalPmCalendarRequest
    {
        public Dictionary<string, List<string>>? pmEventsByDate { get; set; }
        public Dictionary<string, string>? pmMonthlyRules { get; set; }
        public Dictionary<string, List<string>>? pmHiddenMonthlyTasks { get; set; }
        public Dictionary<string, bool>? pmDisabledDailyDates { get; set; }
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
        public int? hospitalId { get; set; }
        /// <summary>Only applied when the caller is SuperAdmin. Makes the new user a root admin (manage all hospitals).</summary>
        public bool? isSuperAdmin { get; set; }
    }

    public class UpdatePasswordRequest
    {
        public string password { get; set; } = "";
    }

    public class UpdateUserRequest
    {
        public string? password { get; set; }
        public int? hospitalId { get; set; }
        public string? position { get; set; }
        /// <summary>Only applied when the caller is SuperAdmin. Grant or revoke root admin (manage all hospitals).</summary>
        public bool? isSuperAdmin { get; set; }
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
        public int? hospitalId { get; set; }
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

    public class AddHospitalRequest
    {
        public string name { get; set; } = "";
        public string? code { get; set; }
    }

    public class UpdateHospitalRequest
    {
        public string? name { get; set; }
        public string? code { get; set; }
    }
}
