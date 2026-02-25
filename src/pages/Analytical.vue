<template>
  <MainLayout>
    <div class="container-fluid p-4">
      <h1 class="mb-4">Analytical Report</h1>

      <div class="row g-3 align-items-end mb-4">
        <div class="col-md-3">
          <label for="monthSelect" class="form-label">เดือน</label>
          <select id="monthSelect" class="form-select" :class="{ 'placeholder-selected': !selectedMonth }"
            v-model="selectedMonth" aria-label="Select Month">
            <option value="" style="color: #6c757d;">กรุณาเลือกเดือน</option>
            <option v-for="(month, index) in thaiMonths" :key="index" :value="month" style="color: #212529;">
              {{ month }}
            </option>
          </select>
        </div>
        <div class="col-md-3">
          <label for="yearSelect" class="form-label">ปี</label>
          <select id="yearSelect" class="form-select" :class="{ 'placeholder-selected': !selectedYear }"
            v-model="selectedYear" aria-label="Select Year">
            <option value="" style="color: #6c757d;">กรุณาเลือกปี</option>
            <option value="2568" style="color: #212529;">2568</option>
            <option value="2569" style="color: #212529;">2569</option>
          </select>
        </div>
        <div class="col-md-2">
          <button type="button" class="btn btn-primary w-100" @click="handleSearch">
            <i class="bi bi-search me-2"></i>ค้นหา
          </button>
        </div>
      </div>

      <div v-if="showGraph" class="row g-4">
        <div class="col-12">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white py-3">
              <h5 class="card-title m-0 text-primary">
                <i class="bi bi-bar-chart-line-fill me-2"></i>
                กราฟแสดงจำนวนครั้งที่เครื่องขัดข้อง (Failure Rate) เปรียบเทียบกับ อัตราการเสียซ้ำชนิดการตรวจแบบ Daily
                Check
                <div>(Recurrent Failure Rate)</div>
                <small class="text-muted d-block mt-1" style="font-size: 0.8em;">
                  ประจำเดือน {{ displayMonth }} ปี {{ displayYear }}
                </small>
              </h5>
            </div>
            <div class="card-body">
              <div class="chart-container" style="position: relative; height: 500px; width: 100%;">
                <canvas id="analyticalChart"></canvas>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="card shadow-sm">
        <div class="card-header bg-white py-3">
          <h5 class="card-title m-0 text-secondary">
            รายงานข้อมูลเชิงสถิติ (Analytical Dashboard)
          </h5>
        </div>
        <div class="card-body d-flex justify-content-center align-items-center"
          style="height: 400px; background-color: #f8f9fa;">
          <div class="text-center text-muted">
            <i class="bi bi-clipboard-data display-4 mb-3"></i>
            <p>กรุณากรอกข้อมูลและกดปุ่มค้นหาเพื่อแสดงข้อมูลวิเคราะห์</p>
          </div>
        </div>
      </div>

      <div v-if="showGraph" class="row g-4 mt-2">
        <div class="col-12">
          <h5 class="text-primary mb-3">
            <i class="bi bi-file-earmark-medical-fill me-2"></i>สรุปสถานะเครื่องเอกซเรย์ประจำเดือน{{ displayMonth }} ปี
            {{ displayYear }}
          </h5>
        </div>

        <div class="col-md-6 col-xl-3" v-for="(machine, index) in machineSummaries" :key="index">
          <div class="card h-100 border-0 shadow-sm" :class="machine.borderClass">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-start mb-2">
                <h6 class="fw-bold text-dark" :title="machine.name">
                  {{ machine.name }}
                </h6>
                <span class="badge rounded-pill" :class="machine.badgeClass">
                  {{ machine.statusText }}
                </span>
              </div>

              <div class="mb-3 text-center p-2 bg-light rounded">
                <small class="text-muted">จำนวนครั้งที่เสียทั้งหมด</small>
                <div class="h3 fw-bold mb-0" :class="machine.textClass">
                  {{ machine.totalFailures }} <span class="fs-6 text-muted">ครั้ง</span>
                </div>
              </div>

              <div class="mb-3">
                <h6 class="text-secondary" style="font-size: 0.8rem; font-weight: 600;">
                  <i class="bi bi-list-check me-1"></i>รายละเอียดรายหัวข้อ :
                </h6>
                <div class="table-responsive">
                  <table class="table table-sm table-borderless mb-0" style="font-size: 0.8rem;">
                    <thead class="text-muted" style="border-bottom: 1px solid #dee2e6;">
                      <tr>
                        <th class="fw-normal">รายการ</th>
                        <th class="text-end fw-normal">จำนวนที่เสีย</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, idx) in machine.breakdown" :key="idx">
                        <td class="text-truncate" style="max-width: 100px; white-space: pre-line;" :title="item.name">
                          {{ idx + 1 }}. {{ item.shortName }}
                        </td>
                        <td class="text-end">
                          {{ item.issues }}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div v-if="machine.majorIssue" class="alert p-2 mb-0" :class="machine.alertClass"
                style="font-size: 0.8rem;">
                <i class="bi bi-exclamation-triangle-fill me-1"></i>
                <strong>ปัญหาหลัก :</strong> {{ machine.majorIssue }}
                <div>(อัตราเสียซ้ำ {{ machine.isMultipleMajor ? 'อย่างละ ' : '' }}{{ machine.rfrValue }}%)</div>
              </div>
              <div v-else class="alert alert-success p-2 mb-0" style="font-size: 0.8rem;">
                <i class="bi bi-check-circle-fill me-1"></i> ประสิทธิภาพสมบูรณ์ ไม่พบการเสียซ้ำ
              </div>

              <div class="mt-3 pt-2 border-top">
                <small class="text-secondary d-block fw-bold">
                  <i class="bi bi-lightbulb-fill me-1 text-warning"></i>คำแนะนำ:
                </small>
                <small class="text-muted" style="font-size: 0.8rem; line-height: 1.4;">
                  {{ machine.recommendation }}
                </small>
              </div>
            </div>
          </div>
        </div>

        <!-- ================== กราฟแสดงจำนวนครั้งที่เสียรายเดือน ================== -->
        <div class="col-12 mt-4">
          <div class="card shadow-sm">
            <div class="card-header bg-white py-3">
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <h5 class="card-title m-0 text-primary">
                  <i class="bi bi-bar-chart-fill me-2"></i>กราฟแสดงจำนวนครั้งที่เครื่องขัดข้อง (Failure Rate)
                  ชนิดการตรวจแบบ Daily Check รายเดือนตลอดทั้งปี
                </h5>
                <div class="year-selector">
                  <label for="monthlyYearSelect" class="me-2">ปี:</label>
                  <select id="monthlyYearSelect" v-model="selectedMonthlyYear" class="form-select form-select-sm"
                    style="width: 120px;">
                    <option v-for="year in availableYears" :key="year" :value="year">
                      {{ year }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            <div class="card-body">
              <div class="monthly-chart-container" style="position: relative; height: 400px; width: 100%;">
                <canvas ref="monthlyChartCanvas"></canvas>
              </div>
            </div>
          </div>
        </div>

        <!-- ================== Summary Cards ================== -->
        <div class="col-12 mt-4">
          <div class="row g-3">
            <!-- Card 1: ภาพรวมสถานการณ์ -->
            <div class="col-md-4">
              <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #0d6efd !important;">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <i class="bi bi-graph-up-arrow text-primary fs-4"></i>
                    </div>
                    <div>
                      <h6 class="text-muted mb-0" style="font-size: 0.85rem;">ภาพรวมสถานการณ์</h6>
                      <small class="text-muted" style="font-size: 0.75rem;">สถิติการขัดข้องรวมปี {{ selectedMonthlyYear
                      }}</small>
                    </div>
                  </div>
                  <div class="text-center py-3">
                    <h2 class="display-4 fw-bold text-primary mb-1">{{ yearlyStatistics.totalFailures }}</h2>
                    <p class="text-muted mb-0">ครั้ง</p>
                  </div>
                  <div class="border-top pt-3 mt-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="text-muted" style="font-size: 0.85rem;">
                        <i class="bi bi-calendar-month me-1"></i>เฉลี่ยต่อเดือน
                      </span>
                      <span class="fw-bold text-dark">{{ yearlyStatistics.averagePerMonth }} ครั้ง</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 2: เครื่องที่ต้องโฟกัส -->
            <div class="col-md-4">
              <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #dc3545 !important;">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                      <i class="bi bi-exclamation-triangle-fill text-danger fs-4"></i>
                    </div>
                    <div>
                      <h6 class="text-muted mb-0" style="font-size: 0.85rem;">เครื่องที่ต้องโฟกัส</h6>
                      <small class="text-muted" style="font-size: 0.75rem;">พบปัญหาบ่อยที่สุด</small>
                    </div>
                  </div>
                  <div class="text-center py-3">
                    <h5 class="fw-bold text-dark mb-2">{{ topOffenderMachine.name }}</h5>
                    <div class="d-flex justify-content-center align-items-baseline">
                      <h3 class="display-6 fw-bold text-danger mb-0">{{ topOffenderMachine.count }}</h3>
                      <span class="text-muted ms-2">ครั้ง</span>
                    </div>
                  </div>
                  <div class="border-top pt-3 mt-3">
                    <small class="text-muted d-block text-center" style="font-size: 0.8rem;">
                      <i class="bi bi-info-circle me-1"></i>ควรตรวจสอบและวางแผนบำรุงรักษาเชิงป้องกัน
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 3: ช่วงเวลาที่ต้องเฝ้าระวัง -->
            <div class="col-md-4">
              <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #ffc107 !important;">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                      <i class="bi bi-calendar-event text-warning fs-4"></i>
                    </div>
                    <div>
                      <h6 class="text-muted mb-0" style="font-size: 0.85rem;">ช่วงเวลาที่ต้องเฝ้าระวัง</h6>
                      <small class="text-muted" style="font-size: 0.75rem;">เดือนที่มีการแจ้งซ่อมสูงสุด</small>
                    </div>
                  </div>
                  <div class="text-center py-3">
                    <h5 class="fw-bold text-dark mb-2">{{ peakMonth.name }}</h5>
                    <div class="d-flex justify-content-center align-items-baseline">
                      <h3 class="display-6 fw-bold text-warning mb-0">{{ peakMonth.count }}</h3>
                      <span class="text-muted ms-2">ครั้ง</span>
                    </div>
                  </div>
                  <div class="border-top pt-3 mt-3">
                    <small class="text-muted d-block text-center" style="font-size: 0.8rem;">
                      <i class="bi bi-lightbulb me-1"></i>เตรียมกำลังคนและอะไหล่สำหรับช่วงนี้
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ========== ประวัติการทำรายการ (ดึงข้อมูลจริงจากระบบ) ========== -->
      <div class="panel history-panel mt-4">
        <div class="panel-header">
          <h3 class="d-flex align-items-center gap-2">
            <i class="bi bi-clock-history"></i>
            ประวัติการทำรายการ
          </h3>
          <p class="panel-sub">รวมการบันทึกแบบฟอร์ม ระบบแจ้งซ่อม และรายการที่ส่งออก PDF</p>
        </div>

        <div class="panel-body history-body">
          <!-- Filters -->
          <div class="history-filters">
            <select v-model="historyFilters.type" class="history-input history-select">
              <option value="">ประเภทรายการ: ทั้งหมด</option>
              <option value="checklist">บันทึกแบบฟอร์ม / QC</option>
              <option value="repair">แจ้งซ่อม</option>
            </select>
            <select v-model="historyFilters.machine" class="history-input history-select">
              <option value="">เครื่อง: ทั้งหมด</option>
              <option v-for="m in historyMachines" :key="'m-' + m.id" :value="'machine-' + m.id">
                {{ m.machineName }} ({{ m.room || '-' }})
              </option>
            </select>
            <input
              v-model="historyFilters.dateFrom"
              type="date"
              class="history-input"
              placeholder="จากวันที่"
            />
            <input
              v-model="historyFilters.dateTo"
              type="date"
              class="history-input"
              placeholder="ถึงวันที่"
            />
            <input
              v-model="historyFilters.search"
              class="history-input"
              placeholder="ค้นหา ผู้ทำ, เครื่อง, รายละเอียด..."
            />
            <button type="button" class="history-btn" @click="applyHistoryFilters">
              <i class="bi bi-search me-1"></i>ค้นหา
            </button>
            <button type="button" class="history-btn history-btn-outline" @click="clearHistoryFilters">
              ล้างตัวกรอง
            </button>
          </div>

          <div v-if="historyLoading" class="history-loading">
            <div class="spinner-border text-primary" role="status"></div>
            <span>กำลังโหลดประวัติ...</span>
          </div>

          <template v-else>
            <div class="history-content">
            <!-- Table -->
            <div class="table-responsive mt-2">
              <table class="table history-table">
                <thead>
                  <tr>
                    <th>วันที่</th>
                    <th>ผู้ทำ</th>
                    <th>เครื่อง / ห้อง</th>
                    <th>ประเภทรายการ</th>
                    <th>การจัดการ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-if="paginatedHistory.length === 0">
                    <td colspan="5" class="text-center text-muted py-5">
                      <i class="bi bi-inbox display-6 d-block mb-2"></i>
                      ไม่พบรายการตามเงื่อนไข
                    </td>
                  </tr>
                  <tr v-else v-for="(item, idx) in paginatedHistory" :key="item.uid">
                    <td class="history-date">{{ item.displayDate }}</td>
                    <td>{{ item.user }}</td>
                    <td>{{ item.machine }}</td>
                    <td>
                      <span class="history-type-badge" :class="item.type === 'repair' ? 'badge-repair' : 'badge-form'">
                        {{ item.typeLabel }}
                      </span>
                    </td>
                    <td>
                      <button type="button" class="btn btn-sm btn-link p-0" @click="openHistoryDetail(item)">
                        ดูรายละเอียด
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Pagination -->
            <div v-if="historyFiltered.length > 0" class="history-pagination">
              <span class="history-pagination-summary">{{ historyPaginationSummary }}</span>
              <div class="history-pagination-btns">
                <button type="button" class="page-btn" :disabled="historyPage <= 1" @click="historyPage = Math.max(1, historyPage - 1)">
                  <i class="bi bi-chevron-left"></i>
                </button>
                <span class="page-info">หน้า {{ historyPage }} / {{ historyTotalPages }}</span>
                <button type="button" class="page-btn" :disabled="historyPage >= historyTotalPages" @click="historyPage = Math.min(historyTotalPages, historyPage + 1)">
                  <i class="bi bi-chevron-right"></i>
                </button>
              </div>
            </div>
            </div>
          </template>
        </div>
      </div>

      <!-- Detail Modal -->
      <div v-if="historyModal.open && historyModal.data" class="modal-backdrop" @click.self="historyModal.open = false">
        <div class="modal-card modal-card-wide">
          <h3 class="modal-title">
            {{ historyModal.data.type === 'repair' ? 'รายละเอียดแจ้งซ่อม' : 'รายละเอียดการบันทึกแบบฟอร์ม' }}
          </h3>
          <div class="modal-body-inner">
            <p><strong>วันที่:</strong> {{ historyModal.data.displayDate }}</p>
            <p><strong>ผู้ทำ:</strong> {{ historyModal.data.user }}</p>
            <p><strong>เครื่อง / ห้อง:</strong> {{ historyModal.data.machine }}</p>
            <p><strong>ประเภทรายการ:</strong> {{ historyModal.data.typeLabel }}</p>
            <template v-if="historyModal.data.type === 'repair'">
              <p><strong>รายละเอียด:</strong> {{ historyModal.data.detail }}</p>
              <p v-if="historyModal.data.remarks"><strong>หมายเหตุ:</strong> {{ historyModal.data.remarks }}</p>
            </template>
          </div>
          <button type="button" class="modal-close" @click="historyModal.open = false">ปิด</button>
        </div>
      </div>
      <!-- ========== END HISTORY SECTION ========== -->
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, nextTick, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import MainLayout from '../components/Layout/MainLayout.vue';
import Chart from 'chart.js/auto';

const API_BASE = '/api/Xraycare';
const router = useRouter();

// Constants
const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];

// State
const selectedMonth = ref('');
const selectedYear = ref('');
const displayMonth = ref('');
const displayYear = ref('');
const showGraph = ref(false);

let performanceChart = null;

// =========================================================
// Data & Logic (Updated to support detailed breakdown count)
// =========================================================
const machineSummaries = computed(() => {
  const names = ['X-Ray (BrandA/ModelX)', 'X-Ray (BrandB/ModelY)', 'X-Ray (BrandC/ModelZ)', 'X-Ray (BrandD/ModelW)'];

  // ข้อมูลดิบ: กำหนดจำนวนครั้งที่เสีย (Issues) และ เสียซ้ำ (Recurrent) ของแต่ละหัวข้อ
  // เพื่อให้ข้อมูลสอดคล้องกับกราฟที่เราต้องการ (เช่น BrandB เบรกเสียซ้ำเยอะ)
  const rawData = [
    // Machine 1 (BrandA): วิกฤต (อันตราย) - สายไฟเสียเยอะ
    {
      breakdown: [
        { name: 'สายไฟ', shortName: 'สายไฟ', issues: 8, recurrent: 6 }, // 8/15 = 53.3% RFR -> Critical
        { name: 'ระบบล็อกและเบรก', shortName: 'ระบบล็อกและเบรก', issues: 4, recurrent: 3 },
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์\nและบักกี้', issues: 2, recurrent: 1 },
        { name: 'X-ray tube warm-up', shortName: 'X-ray tube warm-up', issues: 1, recurrent: 0 }
      ]
    },
    // Machine 2 (BrandB): ต้องเฝ้าระวัง - เบรกเสียบ่อย
    {
      breakdown: [
        { name: 'สายไฟ', shortName: 'สายไฟ', issues: 2, recurrent: 0 },
        { name: 'ระบบล็อกและเบรก', shortName: 'ระบบล็อกและเบรก', issues: 4, recurrent: 2 }, // 4/10 = 40% RFR (>=30) -> Warning
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์\nและบักกี้', issues: 3, recurrent: 0 },
        { name: 'X-ray tube warm-up', shortName: 'X-ray tube warm-up', issues: 1, recurrent: 0 }
      ]
    },
    // Machine 3 (BrandC): ต้องเฝ้าระวัง - การเคลื่อนที่เริ่มแย่
    {
      breakdown: [
        { name: 'สายไฟ', shortName: 'สายไฟ', issues: 1, recurrent: 0 },
        { name: 'ระบบล็อกและเบรก', shortName: 'ระบบล็อกและเบรก', issues: 2, recurrent: 1 },
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์\nและบักกี้', issues: 3, recurrent: 2 }, // 3/8 = 37.5% RFR (>=30) -> Warning
        { name: 'X-ray tube warm-up', shortName: 'X-ray tube warm-up', issues: 2, recurrent: 0 }
      ]
    },
    // Machine 4 (BrandD): ปกติ - เสียน้อย
    {
      breakdown: [
        { name: 'สายไฟ', shortName: 'สายไฟ', issues: 1, recurrent: 0 },
        { name: 'ระบบล็อกและเบรก', shortName: 'ระบบล็อกและเบรก', issues: 1, recurrent: 0 },
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์\nและบักกี้', issues: 1, recurrent: 0 },
        { name: 'X-ray tube warm-up', shortName: 'X-ray tube warm-up', issues: 1, recurrent: 0 } // Max RFR 25% (<30) and Total 4 (<10) -> Normal
      ]
    }
  ];

  return names.map((name, index) => {
    const data = rawData[index];

    // คำนวณยอดรวมอัตโนมัติจาก Breakdown
    const totalFailures = data.breakdown.reduce((sum, item) => sum + item.issues, 0);

    // หา RFR สูงสุดเพื่อระบุปัญหาหลัก
    let maxRFR = 0;
    let maxIssues = [];

    // คำนวณ RFR ของแต่ละ Item เพื่อส่งไปวาดกราฟ (ใน Computed นี้เราใช้เพื่อหา Major Issue)
    data.breakdown.forEach(item => {
      // สูตร RFR % = (จำนวนครั้งในแต่ละรายการ / จำนวนครั้งเสียทั้งหมด) * 100
      const rfr = totalFailures > 0 ? (item.issues / totalFailures) * 100 : 0;
      if (rfr > maxRFR && rfr > 0) {
        maxRFR = rfr;
        maxIssues = [item.name];
      } else if (rfr === maxRFR && rfr > 0) {
        maxIssues.push(item.name);
      }
    });

    const majorIssueName = maxIssues.join(', ');

    // Grading Logic
    let status = 'normal';
    if (maxRFR >= 50) status = 'critical';
    else if (maxRFR >= 30 || totalFailures >= 10) status = 'warning';

    return {
      name: name,
      totalFailures: totalFailures,
      breakdown: data.breakdown, // ส่งข้อมูลรายละเอียดไปแสดงในตาราง
      majorIssue: maxRFR > 0 ? majorIssueName : null,
      isMultipleMajor: maxIssues.length > 1,
      rfrValue: maxRFR.toFixed(0),

      // Styling
      borderClass: status === 'critical' ? 'border-danger border-2' : (status === 'warning' ? 'border-warning border-2' : 'border-success border-2'),
      badgeClass: status === 'critical' ? 'bg-danger' : (status === 'warning' ? 'bg-warning text-dark' : 'bg-success'),
      textClass: status === 'critical' ? 'text-danger' : (status === 'warning' ? 'text-warning' : 'text-success'),
      alertClass: status === 'critical' ? 'alert-danger' : (status === 'warning' ? 'alert-warning' : 'alert-success'),
      statusText: status === 'critical' ? 'วิกฤต (อันตราย)' : (status === 'warning' ? 'ต้องเฝ้าระวัง' : 'ปกติ'),
      recommendation: getRecommendation(status, majorIssueName)
    };
  });
});

const getRecommendation = (status, issue) => {
  if (status === 'critical') return `หยุดใช้งานทันที! และแจ้งช่างตรวจสอบ ${issue} อย่างละเอียด เนื่องจากมีความเสี่ยงสูงต่อความปลอดภัย`;
  if (status === 'warning') return `ควรวางแผนเปลี่ยนอะไหล่ ${issue} หรือตรวจสอบหาสาเหตุที่แท้จริงเพื่อลด Downtime`;
  return 'เครื่องอยู่ในสภาพดี ควรบำรุงรักษาเชิงป้องกัน (PM) ตามรอบปกติ';
};

// Methods
const handleSearch = () => {
  if (selectedMonth.value && selectedYear.value) {
    showGraph.value = true;
    displayMonth.value = selectedMonth.value;
    displayYear.value = selectedYear.value;
    nextTick(() => renderPerformanceChart());
  } else {
    showGraph.value = false;
  }
};

const renderPerformanceChart = () => {
  const ctx = document.getElementById('analyticalChart');
  if (performanceChart) performanceChart.destroy();

  // ดึงข้อมูลจาก machineSummaries มาพลอตกราฟ เพื่อให้ข้อมูลตรงกันเป๊ะ
  const summaries = machineSummaries.value;
  const labels = summaries.map(m => m.name);
  const failureData = summaries.map(m => m.totalFailures);

  // Helper ดึง % RFR จาก Breakdown
  const getRFRArray = (indexInBreakdown) => {
    return summaries.map(m => {
      const item = m.breakdown[indexInBreakdown];
      return m.totalFailures > 0 ? ((item.issues / m.totalFailures) * 100).toFixed(1) : 0;
    });
  };

  performanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'จำนวนแจ้งซ่อมทั้งหมด (ครั้ง)',
          data: failureData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          order: 5,
          yAxisID: 'y'
        },
        {
          label: 'RFR : สายไฟ',
          data: getRFRArray(0),
          type: 'line',
          borderColor: '#dc3545',
          backgroundColor: '#dc3545',
          borderWidth: 2,
          pointStyle: 'circle',
          pointRadius: 5,
          tension: 0.3,
          order: 1,
          yAxisID: 'y1'
        },
        {
          label: 'RFR : ระบบล็อกและเบรก',
          data: getRFRArray(1),
          type: 'line',
          borderColor: '#ffc107',
          backgroundColor: '#ffc107',
          borderWidth: 2,
          pointStyle: 'triangle',
          pointRadius: 6,
          tension: 0.3,
          order: 2,
          yAxisID: 'y1'
        },
        {
          label: 'RFR : การเคลื่อนที่ (เตียง/หลอด/บักกี้)',
          data: getRFRArray(2),
          type: 'line',
          borderColor: '#6f42c1',
          backgroundColor: '#6f42c1',
          borderWidth: 2,
          pointStyle: 'rect',
          pointRadius: 6,
          tension: 0.3,
          order: 3,
          yAxisID: 'y1'
        },
        {
          label: 'RFR : Tube Warm-up',
          data: getRFRArray(3),
          type: 'line',
          borderColor: '#198754',
          backgroundColor: '#198754',
          borderWidth: 2,
          pointStyle: 'rectRot',
          pointRadius: 6,
          tension: 0.3,
          order: 4,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        y: { type: 'linear', display: true, position: 'left', beginAtZero: true, title: { display: true, text: 'จำนวนครั้งที่เสีย (Count)' } },
        y1: { type: 'linear', display: true, position: 'right', min: 0, max: 100, title: { display: true, text: 'อัตราการเสียซ้ำ (RFR %)' }, grid: { drawOnChartArea: false }, ticks: { callback: v => v + "%" } }
      },
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, padding: 20 } },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) label += ': ';
              if (context.parsed.y !== null) {
                label += context.parsed.y;
                if (context.dataset.type === 'line') label += '%'; else label += ' ครั้ง';
              }
              return label;
            }
          }
        }
      }
    }
  });
};

// ================== Monthly Chart Logic ==================
const STORAGE_KEY = 'repair_items'
const monthlyChartCanvas = ref(null)
const selectedMonthlyYear = ref(2568)
let monthlyChartInstance = null

// โหลดข้อมูลจาก localStorage
const repairItems = ref([])

const loadRepairItems = () => {
  // ข้อมูลตัวอย่างสำหรับทั้ง 4 เครื่อง (ใช้เสมอเพื่อให้กราฟแสดงครบ)
  const sampleData = []

  // Helper สำหรับสร้างข้อมูลสุ่ม
  const generateRandomData = () => {
    const equipmentList = [
      { name: 'X-ray general รุ่น xxx', room: 'ห้อง 1' },
      { name: 'X-ray general รุ่น yyyy', room: 'ห้อง 2' },
      { name: 'X-ray general รุ่น zzzz', room: 'ห้อง 3' },
      { name: 'X-ray general รุ่น aaaa', room: 'ห้อง 4' }
    ]

    const details = ['สายไฟ', 'ระบบล็อกและเบรก', 'เตียง หลอดเอกซเรย์ และบักกี้', 'X-ray tube warm-up']
    const statuses = ['ดำเนินการแล้ว', 'รอซ่อม']
    const years = [2568, 2569]
    let id = 1000

    years.forEach(year => {
      // วนลูป 12 เดือน
      for (let month = 0; month < 12; month++) {
        // วนลูปแต่ละเครื่อง
        equipmentList.forEach((equip, index) => {
          // กำหนดจำนวนครั้งที่เสียแบบสุ่ม (1 - 8 ครั้ง) เพื่อให้กราฟมีแท่งสูงต่ำต่างกันชัดเจน
          let count = Math.floor(Math.random() * 8) + 1

          // เพิ่มความแปรปรวนพิเศษ
          if (month % 4 === 0 && index === 0) count = Math.floor(Math.random() * 5) + 8 // BrandA เสียเยอะบางเดือน
          if (month === 11 && index === 3) count = 10    // ธ.ค. BrandD เสียเยอะมาก
          if (month === 5 && index === 1) count = 7     // มิ.ย. BrandB เสียค่อนข้างเยอะ
          if (month === 2 && index === 2) count = 2      // มี.ค. BrandC เสียน้อย

          for (let i = 0; i < count; i++) {
            // สร้างวันที่
            const day = Math.floor(Math.random() * 28) + 1
            const monthStr = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'][month]

            sampleData.push({
              id: id++,
              equipment: equip.name,
              room: equip.room,
              requestDate: `${day} ${monthStr} ${year}`,
              detail: details[Math.floor(Math.random() * details.length)],
              statusText: statuses[Math.floor(Math.random() * statuses.length)]
            })
          }
        })
      }
    })
  }

  generateRandomData()

  const stored = localStorage.getItem(STORAGE_KEY)
  let storedData = []

  if (stored) {
    try {
      storedData = JSON.parse(stored)
    } catch (e) {
      storedData = []
    }
  }

  // รวมข้อมูลตัวอย่างกับข้อมูลจาก localStorage เสมอ
  repairItems.value = [...sampleData, ...storedData]
}

// สร้างรายการปีที่มีข้อมูล
const availableYears = computed(() => {
  const years = new Set()
  repairItems.value.forEach(item => {
    if (item.requestDate) {
      const yearMatch = item.requestDate.match(/(\d{4})/)
      if (yearMatch) {
        years.add(parseInt(yearMatch[1]))
      }
    }
  })
  if (years.size === 0) {
    years.add(2568)
  }
  return Array.from(years).sort((a, b) => b - a)
})

// ฟังก์ชันแปลงเดือนไทยเป็นตัวเลข
const thaiMonthToNumber = (monthStr) => {
  const months = {
    'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5,
    'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11
  }
  return months[monthStr] !== undefined ? months[monthStr] : -1
}

// helper แสดงชื่ออุปกรณ์
const getEquipmentText = (item) => {
  if (item.room) return item.equipment
  return item.equipment.replace(/\s*ห้อง\s*\d+\s*$/, '')
}

// คำนวณข้อมูลสำหรับกราฟรายเดือน
const monthlyChartData = computed(() => {
  const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

  // กำหนดชนิดเครื่องทั้งหมด 4 เครื่องให้แสดงเสมอ
  const equipmentTypes = [
    'X-ray general รุ่น xxx',
    'X-ray general รุ่น yyyy',
    'X-ray general รุ่น zzzz',
    'X-ray general รุ่น aaaa'
  ]

  const brandEquipmentTypes = [
    'X-Ray (BrandA/ModelX)',
    'X-Ray (BrandB/ModelY)',
    'X-Ray (BrandC/ModelZ)',
    'X-Ray (BrandD/ModelW)'
  ]

  // สีสำหรับแต่ละชนิดเครื่อง (สีสดใสแยกชัดเจน)
  const colors = [
    'rgba(255, 99, 132, 0.8)',   // แดง - BrandA
    'rgba(54, 162, 235, 0.8)',   // น้ำเงิน - BrandB
    'rgba(255, 206, 86, 0.8)',   // เหลือง - BrandC
    'rgba(75, 192, 192, 0.8)'    // เขียว - BrandD
  ]

  // สร้างโครงสร้างข้อมูลสำหรับแต่ละชนิดเครื่อง
  const datasets = equipmentTypes.map((equipment, index) => {
    const monthlyData = new Array(12).fill(0)

    // นับจำนวนครั้งที่เสียในแต่ละเดือน
    repairItems.value.forEach(item => {
      if (getEquipmentText(item) === equipment && item.requestDate) {
        const match = item.requestDate.match(/(\d+)\s+([^\s]+)\s+(\d{4})/)
        if (match) {
          const monthStr = match[2]
          const year = parseInt(match[3])
          const monthIndex = thaiMonthToNumber(monthStr)

          if (year === selectedMonthlyYear.value && monthIndex !== -1) {
            monthlyData[monthIndex]++
          }
        }
      }
    })

    return {
      label: brandEquipmentTypes[index],  // ใช้ชื่อ Brand/Model
      data: monthlyData,
      backgroundColor: colors[index],
      borderColor: colors[index].replace('0.8', '1'),
      borderWidth: 1,
      barPercentage: 0.8,
      categoryPercentage: 0.9,
      stack: 'stack' + index  // แยก stack ให้แต่ละเครื่องไม่ซ้อนกัน
    }
  })

  return {
    labels: monthNames,
    datasets: datasets
  }
})

// คำนวณสถิติรวมของปีที่เลือก
const yearlyStatistics = computed(() => {
  const currentYearData = repairItems.value.filter(item => {
    if (!item.requestDate) return false
    const yearMatch = item.requestDate.match(/(\d{4})/)
    return yearMatch && parseInt(yearMatch[1]) === selectedMonthlyYear.value
  })

  const totalFailures = currentYearData.length
  const averagePerMonth = (totalFailures / 12).toFixed(1)

  return {
    totalFailures,
    averagePerMonth
  }
})

// หาเครื่องที่มีปัญหาบ่อยที่สุด
const topOffenderMachine = computed(() => {
  const equipmentTypes = [
    'X-ray general รุ่น xxx',
    'X-ray general รุ่น yyyy',
    'X-ray general รุ่น zzzz',
    'X-ray general รุ่น aaaa'
  ]

  const brandNames = [
    'X-Ray (BrandA/ModelX)',
    'X-Ray (BrandB/ModelY)',
    'X-Ray (BrandC/ModelZ)',
    'X-Ray (BrandD/ModelW)'
  ]

  let maxCount = 0
  let topMachine = ''
  let topBrandName = ''

  equipmentTypes.forEach((equipment, index) => {
    const count = repairItems.value.filter(item => {
      if (!item.requestDate) return false
      const yearMatch = item.requestDate.match(/(\d{4})/)
      const year = yearMatch ? parseInt(yearMatch[1]) : 0
      return getEquipmentText(item) === equipment && year === selectedMonthlyYear.value
    }).length

    if (count > maxCount) {
      maxCount = count
      topMachine = equipment
      topBrandName = brandNames[index]
    }
  })

  return {
    name: topBrandName,
    count: maxCount
  }
})

// หาเดือนที่มีการแจ้งซ่อมสูงสุด
const peakMonth = computed(() => {
  const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']
  const fullMonthNames = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม']

  const monthCounts = new Array(12).fill(0)

  repairItems.value.forEach(item => {
    if (!item.requestDate) return
    const match = item.requestDate.match(/(\d+)\s+([^\s]+)\s+(\d{4})/)
    if (match) {
      const monthStr = match[2]
      const year = parseInt(match[3])
      const monthIndex = thaiMonthToNumber(monthStr)

      if (year === selectedMonthlyYear.value && monthIndex !== -1) {
        monthCounts[monthIndex]++
      }
    }
  })

  const maxCount = Math.max(...monthCounts)
  const peakMonthIndex = monthCounts.indexOf(maxCount)

  return {
    name: fullMonthNames[peakMonthIndex],
    count: maxCount
  }
})

// สร้าง/อัพเดทกราฟรายเดือน
const createMonthlyChart = () => {
  if (!monthlyChartCanvas.value) return

  // ทำลายกราฟเก่า
  if (monthlyChartInstance) {
    monthlyChartInstance.destroy()
  }

  const ctx = monthlyChartCanvas.value.getContext('2d')

  monthlyChartInstance = new Chart(ctx, {
    type: 'bar',
    data: monthlyChartData.value,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              family: 'Sarabun, sans-serif',
              size: 12
            }
          }
        },
        title: {
          display: true,
          text: `จำนวนครั้งที่เครื่องเสียรายเดือน ปี ${selectedMonthlyYear.value}`,
          font: {
            family: 'Sarabun, sans-serif',
            size: 16,
            weight: 'bold'
          }
        },
        tooltip: {
          callbacks: {
            title: function (context) {
              return 'เดือน: ' + context[0].label
            },
            label: function (context) {
              return context.dataset.label + ': ' + context.parsed.y + ' ครั้ง'
            }
          }
        }
      },
      scales: {
        x: {
          stacked: false,
          title: {
            display: true,
            text: 'เดือน',
            font: {
              family: 'Sarabun, sans-serif',
              size: 14
            }
          },
          ticks: {
            font: {
              family: 'Sarabun, sans-serif'
            }
          },
          grid: {
            display: false
          }
        },
        y: {
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: 'จำนวนครั้ง',
            font: {
              family: 'Sarabun, sans-serif',
              size: 14
            }
          },
          ticks: {
            stepSize: 1,
            font: {
              family: 'Sarabun, sans-serif'
            }
          }
        }
      }
    }
  })
}

// เมื่อเปลี่ยนปี ให้อัพเดทกราฟ
watch(selectedMonthlyYear, () => {
  if (showGraph.value) {
    createMonthlyChart()
  }
})

// เมื่อแสดงกราฟ ให้สร้างกราฟรายเดือน
watch(showGraph, (newVal) => {
  if (newVal) {
    nextTick(() => {
      loadRepairItems()
      createMonthlyChart()
    })
  }
})

// โหลดข้อมูลเมื่อ component mount
onMounted(() => {
  loadRepairItems()
  loadHistoryData()

  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      loadRepairItems()
      if (showGraph.value && monthlyChartCanvas.value) {
        createMonthlyChart()
      }
    }
  })

  window.addEventListener('storage-local-update', () => {
    loadRepairItems()
    if (showGraph.value && monthlyChartCanvas.value) {
      createMonthlyChart()
    }
  })
})

// ---------- ประวัติการทำรายการ (ดึงข้อมูลจริง) ----------
const formTypeToLabel = {
  F1_F2: 'F1/F2 : การดูแลรักษาและตรวจสอบเครื่องเอกซเรย์',
  F10: 'F10 : แบบบันทึกการตรวจสอบความสว่างแสงไฟ',
  F12: 'F12 : แบบบันทึกอัตราการถ่ายภาพซ้ำ',
  F3_F6: 'F3-F6 : การควบคุมคุณภาพจอภาพ / บันทึกการตรวจสอบเครื่อง',
  F7_F8: 'F7-F8 : Collimator / Dark noise CR/DR',
  F9: 'F9 : การตรวจสอบคุณภาพเสื้อตะกั่ว',
  F11: 'F11 : แบบบันทึกผลการวัดความหนาผู้ป่วย',
  F13: 'F13 : แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวด์',
}
const formTypeToRoute = {
  F1_F2: 'XrayF1Print',
  F10: 'XrayF10Print',
  F12: 'XrayF12Print',
  F3_F6: 'XrayF3Print',
  F7_F8: 'XrayF71Print',
  F9: 'XrayF9Print',
  F11: 'XrayF11Print',
  F13: 'XrayF13Print',
}

const historyChecklistRecords = ref([])
const historyRepairRequests = ref([])
const historyMachines = ref([])
const historyLoading = ref(false)
const historyFilters = ref({
  type: '',
  machine: '',
  dateFrom: '',
  dateTo: '',
  search: '',
})
const historyPage = ref(1)
const HISTORY_PAGE_SIZE = 20

function parseCheckDateForSort(str) {
  if (!str || typeof str !== 'string') return 0
  const trimmed = str.trim()
  const datePart = (trimmed.split(/\s+/)[0] || trimmed).trim()
  const parts = datePart.split('/')
  if (parts.length >= 3) {
    const d = parseInt(parts[0], 10)
    const m = parseInt(parts[1], 10) - 1
    const y = parseInt(parts[2], 10)
    const yAd = y > 2400 ? y - 543 : y
    const t = new Date(yAd, m, d).getTime()
    return isNaN(t) ? 0 : t
  }
  return 0
}

function parseRequestDateForSort(str) {
  if (!str || typeof str !== 'string') return 0
  const thaiMonths = { 'ม.ค.': 0, 'ก.พ.': 1, 'มี.ค.': 2, 'เม.ย.': 3, 'พ.ค.': 4, 'มิ.ย.': 5, 'ก.ค.': 6, 'ส.ค.': 7, 'ก.ย.': 8, 'ต.ค.': 9, 'พ.ย.': 10, 'ธ.ค.': 11 }
  const thaiMatch = str.match(/(\d+)\s+([^\s]+)\s+(\d{4})/)
  if (thaiMatch) {
    const d = parseInt(thaiMatch[1], 10)
    const m = thaiMonths[thaiMatch[2]]
    const y = parseInt(thaiMatch[3], 10) - 543
    if (m !== undefined) {
      const t = new Date(y, m, d).getTime()
      return isNaN(t) ? 0 : t
    }
  }
  const slashMatch = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/)
  if (slashMatch) {
    const d = parseInt(slashMatch[1], 10)
    const m = parseInt(slashMatch[2], 10) - 1
    const y = parseInt(slashMatch[3], 10)
    const yAd = y > 2400 ? y - 543 : y
    const t = new Date(yAd, m, d).getTime()
    return isNaN(t) ? 0 : t
  }
  return 0
}

const historyUnified = computed(() => {
  const list = []
  historyChecklistRecords.value.forEach((r) => {
    const sortTime = parseCheckDateForSort(r.checkDate)
    list.push({
      uid: 'c-' + r.id,
      type: 'checklist',
      sortTime,
      displayDate: r.checkDate || '-',
      user: r.tester || '-',
      machine: [r.machineName, r.room].filter(Boolean).join(' ') || '-',
      typeLabel: formTypeToLabel[r.formType] || r.formType || 'แบบฟอร์ม',
      status: getChecklistStatus(r),
      statusClass: null,
      detail: '',
      remarks: '',
      jsonPreview: (r.jsonData && typeof r.jsonData === 'string') ? r.jsonData.substring(0, 500) : (r.jsonData ? JSON.stringify(r.jsonData).substring(0, 500) : '-'),
      raw: r,
      canPrint: !!formTypeToRoute[r.formType],
      machineId: null,
    })
  })
  historyRepairRequests.value.forEach((r) => {
    const sortTime = parseRequestDateForSort(r.requestDate) || 0
    list.push({
      uid: 'r-' + r.id,
      type: 'repair',
      sortTime,
      displayDate: r.requestDate || '-',
      user: r.reporterName || r.tester || '-',
      machine: [r.equipment, r.room].filter(Boolean).join(' ') || '-',
      typeLabel: 'แจ้งซ่อม',
      status: r.statusText || '-',
      statusClass: (r.statusText === 'ดำเนินการแล้ว') ? 'success' : 'warning',
      detail: r.detail || '',
      remarks: r.remarks || '',
      jsonPreview: '',
      raw: r,
      canPrint: false,
      machineId: null,
    })
  })
  list.sort((a, b) => b.sortTime - a.sortTime)
  return list
})

function getChecklistStatus(r) {
  try {
    const parsed = r.jsonData ? JSON.parse(r.jsonData) : {}
    if (parsed.summaryResult) return parsed.summaryResult
    if (Array.isArray(parsed.checklist)) {
      const hasFail = parsed.checklist.some((x) => (x.result || '').toLowerCase() === 'fail')
      return hasFail ? 'Fail' : 'Pass'
    }
  } catch (_) {}
  return '-'
}

const historyFiltered = computed(() => {
  let list = historyUnified.value
  if (historyFilters.value.type === 'checklist') list = list.filter((x) => x.type === 'checklist')
  if (historyFilters.value.type === 'repair') list = list.filter((x) => x.type === 'repair')
  if (historyFilters.value.machine) {
    const mid = historyFilters.value.machine.replace('machine-', '')
    const m = historyMachines.value.find((x) => String(x.id) === mid)
    if (m) {
      const name = (m.machineName || '').trim()
      const room = (m.room || '').trim()
      list = list.filter((x) => {
        const raw = x.raw
        if (x.type === 'checklist') return (raw.machineName || '').trim() === name && (raw.room || '').trim() === room
        return (raw.equipment || '').trim() === name && (raw.room || '').trim() === room
      })
    }
  }
  if (historyFilters.value.dateFrom) {
    const tFrom = new Date(historyFilters.value.dateFrom).getTime()
    list = list.filter((x) => x.sortTime >= tFrom)
  }
  if (historyFilters.value.dateTo) {
    const tTo = new Date(historyFilters.value.dateTo).getTime() + 86400000
    list = list.filter((x) => x.sortTime <= tTo)
  }
  if (historyFilters.value.search && historyFilters.value.search.trim()) {
    const q = historyFilters.value.search.trim().toLowerCase()
    list = list.filter((x) =>
      (x.user || '').toLowerCase().includes(q) ||
      (x.machine || '').toLowerCase().includes(q) ||
      (x.typeLabel || '').toLowerCase().includes(q) ||
      (x.detail || '').toLowerCase().includes(q) ||
      (x.status || '').toLowerCase().includes(q)
    )
  }
  return list
})

const historyTotalPages = computed(() => Math.max(1, Math.ceil(historyFiltered.value.length / HISTORY_PAGE_SIZE)))
const paginatedHistory = computed(() => {
  const list = historyFiltered.value
  const start = (historyPage.value - 1) * HISTORY_PAGE_SIZE
  return list.slice(start, start + HISTORY_PAGE_SIZE)
})
const historyPaginationSummary = computed(() => {
  const total = historyFiltered.value.length
  if (total === 0) return 'ไม่มีรายการ'
  const start = (historyPage.value - 1) * HISTORY_PAGE_SIZE + 1
  const end = Math.min(historyPage.value * HISTORY_PAGE_SIZE, total)
  return `แสดง ${start}–${end} จาก ${total} รายการ`
})

const historyModal = ref({ open: false, data: null })

function openHistoryDetail(item) {
  historyModal.value.data = item
  historyModal.value.open = true
}

function applyHistoryFilters() {
  historyPage.value = 1
}

function clearHistoryFilters() {
  historyFilters.value = { type: '', machine: '', dateFrom: '', dateTo: '', search: '' }
  historyPage.value = 1
}

function getMachineQueryFromRow(row) {
  if (!row.machineName && !row.room) return ''
  const m = historyMachines.value.find(
    (mach) =>
      (mach.machineName || '').trim() === (row.machineName || '').trim() &&
      (mach.room || '').trim() === (row.room || '').trim()
  )
  return m ? 'machine-' + m.id : (row.machineName || '')
}

function goToHistoryPrint(item) {
  if (item.type !== 'checklist' || !item.raw) return
  const row = item.raw
  const routeName = formTypeToRoute[row.formType]
  if (!routeName) {
    alert('ไม่พบแบบฟอร์มสำหรับรายการนี้')
    return
  }
  const machineQuery = getMachineQueryFromRow(row)
  router.push({
    name: routeName,
    query: { id: row.id, machine: machineQuery, date: row.checkDate || '' },
  })
}

function closeModalAndPrint() {
  const data = historyModal.value.data
  if (data) goToHistoryPrint(data)
  historyModal.value.open = false
}

async function loadHistoryData() {
  historyLoading.value = true
  try {
    const [resMachines, resChecklist, resRepair] = await Promise.all([
      fetch(API_BASE + '/GetAllMachines'),
      fetch(API_BASE + '/GetAllChecklistRecords'),
      fetch(API_BASE + '/GetAllRepairRequests'),
    ])
    historyMachines.value = resMachines.ok ? (await resMachines.json()) || [] : []
    const checklistData = resChecklist.ok ? await resChecklist.json() : []
    historyChecklistRecords.value = Array.isArray(checklistData) ? checklistData : []
    const repairData = resRepair.ok ? await resRepair.json() : []
    historyRepairRequests.value = Array.isArray(repairData) ? repairData : []
  } catch (e) {
    console.error('Load history error:', e)
  } finally {
    historyLoading.value = false
  }
}

watch(
  () => [historyFilters.value.type, historyFilters.value.machine, historyFilters.value.dateFrom, historyFilters.value.dateTo, historyFilters.value.search],
  () => { historyPage.value = 1 }
)
</script>

<style scoped>
.chart-container {
  position: relative;
  margin: auto;
}

.placeholder-selected {
  color: var(--text-muted, #94a3b8);
}

/* Chart & card containers */
.card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  overflow: hidden;
}

.panel {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0, 0, 0, 0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.06));
  overflow: hidden;
}

.panel-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-soft, #e2e8f0);
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--text-main, #0f172a);
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
}

.panel-sub {
  margin: 4px 0 0;
  font-size: 0.85rem;
  color: var(--text-secondary, #64748b);
  font-weight: 400;
}

.history-type-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.badge-form {
  background: #eff6ff;
  color: #1d4ed8;
}

.badge-repair {
  background: #fef3c7;
  color: #b45309;
}

.tag-status {
  padding: 3px 10px;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.tag-status.tag-success {
  background: #f0fdf4;
  color: #15803d;
}

.tag-status.tag-warning {
  background: #fef3c7;
  color: #b45309;
}

.tag-status.tag-secondary {
  background: #f1f5f9;
  color: #475569;
}

.history-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 16px;
  color: var(--text-secondary, #64748b);
}

.history-pagination-summary {
  font-size: 0.85rem;
  color: var(--text-secondary, #64748b);
}

.history-pagination-btns {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-info {
  font-size: 0.85rem;
  color: var(--text-main, #0f172a);
}

.history-btn-outline {
  background: transparent !important;
  color: #64748b;
  border: 1px solid #e2e8f0;
}

.history-btn-outline:hover {
  background: #f8fafc !important;
  color: #0f172a;
}

.history-select {
  min-width: 180px;
}

.modal-card-wide {
  max-width: 560px;
}

.modal-body-inner {
  margin-bottom: 16px;
}

.modal-body-inner p {
  margin-bottom: 8px;
}

.history-date {
  white-space: nowrap;
}

.panel-body {
  padding: 20px;
}

.history-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.history-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 16px;
}

.history-input,
.history-btn {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 12px;
  font-size: 0.85rem;
}

.history-input {
  background: var(--bg-card, #fff);
}

.history-btn {
  background: linear-gradient(135deg, #6c3ce0, #8b5cf6);
  color: #fff;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast, 150ms);
}

.history-btn:hover {
  box-shadow: 0 2px 8px rgba(108, 60, 224, 0.35);
}

.tag-pass {
  background: #f0fdf4;
  color: #15803d;
  padding: 3px 10px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
  font-weight: 600;
}

.tag-fail {
  background: #fef2f2;
  color: #dc2626;
  padding: 3px 10px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.75rem;
  font-weight: 600;
}

.history-pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
}

.page-btn {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 6px 12px;
  cursor: pointer;
  background: var(--bg-card, #fff);
  transition: all var(--transition-fast, 150ms);
}

.page-btn:hover:not(:disabled) {
  background: #f1f5f9;
}

.page-btn.active {
  background: linear-gradient(135deg, #6c3ce0, #8b5cf6);
  color: #fff;
  border-color: transparent;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.history-table {
  border-radius: var(--radius-md, 12px);
  overflow: hidden;
}

.history-table th {
  background: #f8fafc;
  color: var(--text-secondary, #475569);
  font-weight: 600;
  font-size: 0.85rem;
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.5);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-card {
  background: var(--bg-card, #fff);
  border-radius: var(--radius-xl, 20px);
  padding: 28px;
  max-width: 600px;
  width: 92%;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--border-soft, #e2e8f0);
}

.modal-title {
  margin: 0 0 16px;
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--text-main, #0f172a);
}

.modal-section {
  margin-top: 16px;
}

.modal-json {
  background: #f8fafc;
  padding: 12px;
  border-radius: var(--radius-sm, 8px);
  max-height: 180px;
  overflow-y: auto;
  font-size: 0.8rem;
  border: 1px solid var(--border-soft, #e2e8f0);
}

.modal-close {
  margin-top: 20px;
  padding: 10px 18px;
  background: linear-gradient(135deg, #6c3ce0, #8b5cf6);
  color: #fff;
  border: none;
  border-radius: var(--radius-sm, 8px);
  width: 100%;
  cursor: pointer;
  font-weight: 600;
  transition: all var(--transition-fast, 150ms);
}

.modal-close:hover {
  box-shadow: 0 2px 8px rgba(108, 60, 224, 0.35);
}

/* Machine summary cards hover */
.card.border-danger:hover,
.card.border-warning:hover,
.card.border-success:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

/* Form select modern styling */
.form-select {
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 12px;
  font-size: 0.85rem;
}

@media (max-width: 1024px) {
  .history-filters { flex-direction: column; }
  .history-input { width: 100%; }
}
@media (max-width: 640px) {
  .chart-container { padding: 12px; }
  .panel { border-radius: 12px; }
  .panel-header { padding: 12px 14px; font-size: 0.85rem; }
  .panel-body { padding: 14px; }
  .history-body { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .history-pagination { flex-wrap: wrap; gap: 4px; }
  .page-btn { padding: 5px 10px; font-size: 0.78rem; }
  .modal-card { width: calc(100vw - 24px); padding: 16px; }
}
</style>