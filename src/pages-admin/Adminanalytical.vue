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
            <i class="bi bi-file-earmark-medical-fill me-2"></i>สรุปสถานะเครื่องเอกซเรย์ประจำเดือน
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
                        <th class="text-center fw-normal">เสีย</th>
                        <th class="text-end fw-normal text-danger">ซ้ำ</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(item, idx) in machine.breakdown" :key="idx">
                        <td class="text-truncate" style="max-width: 100px;" :title="item.name">
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
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, nextTick, computed } from 'vue';
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
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์ และบักกี้', issues: 2, recurrent: 1 }, // 1/15 = 6.7%
        { name: 'X-ray tube warm-up', shortName: 'X-ray tube warm-up', issues: 1, recurrent: 0 }
      ]
    },
    // Machine 2 (BrandB): เบรกวิกฤต
    {
      breakdown: [
        { name: 'สายไฟ', shortName: 'สายไฟ', issues: 1, recurrent: 0 },
        { name: 'ระบบล็อกและเบรก', shortName: 'ระบบล็อกและเบรก', issues: 7, recurrent: 6 }, // 6/10 = 60% RFR
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์ และบักกี้', issues: 1, recurrent: 0 },
        { name: 'X-ray tube warm-up', shortName: 'X-ray tube warm-up', issues: 1, recurrent: 1 } // 1/10 = 10%
      ]
    },
    // Machine 3 (BrandC): การเคลื่อนที่เริ่มแย่
    {
      breakdown: [
        { name: 'สายไฟ', shortName: 'สายไฟ', issues: 0, recurrent: 0 },
        { name: 'ระบบล็อกและเบรก', shortName: 'ระบบล็อกและเบรก', issues: 2, recurrent: 1 }, // 1/5 = 20%
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์ และบักกี้', issues: 3, recurrent: 2 }, // 2/5 = 40% RFR
        { name: 'X-ray tube warm-up', shortName: 'X-ray tube warm-up', issues: 0, recurrent: 0 }
      ]
    },
    // Machine 4 (BrandD): ปกติ
    {
      breakdown: [
        { name: 'สายไฟ', shortName: 'สายไฟ', issues: 0, recurrent: 0 },
        { name: 'ระบบล็อกและเบรก', shortName: 'ระบบล็อกและเบรก', issues: 0, recurrent: 0 },
        { name: 'เตียง หลอดเอกซเรย์ และบักกี้', shortName: 'เตียง หลอดเอกซเรย์ และบักกี้', issues: 1, recurrent: 0 },
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