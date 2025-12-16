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
                        <th class="fw-normal">รายการ </th>
                        <th class="text-center fw-normal">เสีย</th>
                        <th class="text-end fw-normal text-danger">ซ้ำ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, idx) in machine.breakdown" :key="idx">
                        <td class="text-truncate" style="max-width: 100px; white-space: pre-line;" :title="item.name">
                          {{ idx + 1 }}. {{ item.shortName }}
                        </td>
                        <td class="text-center">
                          {{ item.issues }}
                        </td>
                        <td class="text-end"
                          :class="{ 'fw-bold text-danger': item.recurrent > 0, 'text-muted': item.recurrent === 0 }">
                          {{ item.recurrent }}
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
                <div>(อัตราเสียซ้ำ {{ machine.rfrValue }}%)</div>
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
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, nextTick, computed, onMounted, watch } from 'vue';
import MainLayout from '../components/Layout/MainLayout.vue';
import Chart from 'chart.js/auto';

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
    // Machine 1 (BrandA): สายไฟเสียเยอะ
    {
      breakdown: [
        { name: 'สายไฟ', shortName: 'สายไฟ', issues: 8, recurrent: 6 }, // 6/15 = 40% RFR
        { name: 'ระบบล็อกและเบรก', shortName: 'ระบบล็อกและเบรก', issues: 4, recurrent: 3 }, // 3/15 = 20%
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์\nและบักกี้', issues: 2, recurrent: 1 }, // 1/15 = 6.7%
        { name: 'X-ray tube warm-up', shortName: 'X-ray tube warm-up', issues: 1, recurrent: 0 }
      ]
    },
    // Machine 2 (BrandB): เบรกวิกฤต
    {
      breakdown: [
        { name: 'สายไฟ', shortName: 'สายไฟ', issues: 1, recurrent: 0 },
        { name: 'ระบบล็อกและเบรก', shortName: 'ระบบล็อกและเบรก', issues: 7, recurrent: 6 }, // 6/10 = 60% RFR
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์\nและบักกี้', issues: 1, recurrent: 0 },
        { name: 'X-ray tube warm-up', shortName: 'X-ray tube warm-up', issues: 1, recurrent: 1 } // 1/10 = 10%
      ]
    },
    // Machine 3 (BrandC): การเคลื่อนที่เริ่มแย่
    {
      breakdown: [
        { name: 'สายไฟ', shortName: 'สายไฟ', issues: 0, recurrent: 0 },
        { name: 'ระบบล็อกและเบรก', shortName: 'ระบบล็อกและเบรก', issues: 2, recurrent: 1 }, // 1/5 = 20%
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์\nและบักกี้', issues: 3, recurrent: 2 }, // 2/5 = 40% RFR
        { name: 'X-ray tube warm-up', shortName: 'X-ray tube warm-up', issues: 0, recurrent: 0 }
      ]
    },
    // Machine 4 (BrandD): ปกติ
    {
      breakdown: [
        { name: 'สายไฟ', shortName: 'สายไฟ', issues: 0, recurrent: 0 },
        { name: 'ระบบล็อกและเบรก', shortName: 'ระบบล็อกและเบรก', issues: 0, recurrent: 0 },
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์\nและบักกี้', issues: 1, recurrent: 0 },
        { name: 'X-ray tube warm-up', shortName: 'X-ray tube warm-up', issues: 1, recurrent: 0 }
      ]
    }
  ];

  return names.map((name, index) => {
    const data = rawData[index];

    // คำนวณยอดรวมอัตโนมัติจาก Breakdown
    const totalFailures = data.breakdown.reduce((sum, item) => sum + item.issues, 0);

    // หา RFR สูงสุดเพื่อระบุปัญหาหลัก
    let maxRFR = 0;
    let maxIssueName = '';

    // คำนวณ RFR ของแต่ละ Item เพื่อส่งไปวาดกราฟ (ใน Computed นี้เราใช้เพื่อหา Major Issue)
    data.breakdown.forEach(item => {
      // สูตร RFR % = (Recurrent / TotalFailures) * 100
      const rfr = totalFailures > 0 ? (item.recurrent / totalFailures) * 100 : 0;
      if (rfr > maxRFR) {
        maxRFR = rfr;
        maxIssueName = item.name;
      }
    });

    // Grading Logic
    let status = 'normal';
    if (maxRFR >= 50) status = 'critical';
    else if (maxRFR >= 30 || totalFailures >= 10) status = 'warning';

    return {
      name: name,
      totalFailures: totalFailures,
      breakdown: data.breakdown, // ส่งข้อมูลรายละเอียดไปแสดงในตาราง
      majorIssue: maxRFR > 0 ? maxIssueName : null,
      rfrValue: maxRFR.toFixed(0),

      // Styling
      borderClass: status === 'critical' ? 'border-danger border-2' : (status === 'warning' ? 'border-warning border-2' : 'border-success border-2'),
      badgeClass: status === 'critical' ? 'bg-danger' : (status === 'warning' ? 'bg-warning text-dark' : 'bg-success'),
      textClass: status === 'critical' ? 'text-danger' : (status === 'warning' ? 'text-warning' : 'text-success'),
      alertClass: status === 'critical' ? 'alert-danger' : 'alert-warning',
      statusText: status === 'critical' ? 'วิกฤต (อันตราย)' : (status === 'warning' ? 'ต้องเฝ้าระวัง' : 'ปกติ'),
      recommendation: getRecommendation(status, maxIssueName)
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
      return m.totalFailures > 0 ? ((item.recurrent / m.totalFailures) * 100).toFixed(1) : 0;
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

// แปลงชื่ออุปกรณ์เป็น Brand/Model format
const mapEquipmentToBrand = (equipmentName) => {
  const mapping = {
    'X-ray general รุ่น xxx': 'X-Ray (BrandA/ModelX)',
    'X-ray general รุ่น yyyy': 'X-Ray (BrandB/ModelY)',
    'X-ray general รุ่น zzzz': 'X-Ray (BrandC/ModelZ)',
    'X-ray general รุ่น aaaa': 'X-Ray (BrandD/ModelW)'
  }
  return mapping[equipmentName] || equipmentName
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

  // Listen for storage changes
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
</script>

<style scoped>
.chart-container {
  position: relative;
  margin: auto;
}

.placeholder-selected {
  color: #6c757d;
}
</style>