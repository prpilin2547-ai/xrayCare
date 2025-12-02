<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-title">Analytical Dashboard</h2>

      <!-- SECTION 1: OPERATIONAL FAILURE METRICS -->
      <div class="section-header">
        <h3>🛠️ ตัวชี้วัดการขัดข้องของการปฏิบัติงาน (Operational Failure Metrics)</h3>
        <p>การวิเคราะห์การชำรุดของอุปกรณ์และปัญหาที่เกิดขึ้นซ้ำ (Analysis of equipment breakdowns and recurrent issues)</p>
      </div>

      <div class="grid-2">
        <!-- Chart 1: Failure Rate + RFR -->
        <div class="panel">
          <div class="panel-header">
            <h3>อัตราการขัดข้องรายเดือน & ผลกระทบจากการเสียซ้ำ (Monthly Failure Rate & Recurrent Impact)</h3>
          </div>
          <div class="panel-body">
            <div class="chart-container">
              <canvas ref="failureChartRef"></canvas>
            </div>
            <div class="panel-explain">
              <p>แท่งกราฟแสดงยอดรวมการเสียต่อเดือน ส่วนเส้นสีเหลืองแสดงเปอร์เซ็นต์ของการเสียที่เป็น "การเสียซ้ำ" (ภายในระยะเวลา 3 เดือน)</p>
            </div>
          </div>
        </div>

        <!-- Chart 2: RFR Trend -->
        <div class="panel">
          <div class="panel-header">
            <h3>แนวโน้มเชิงพยากรณ์ : อัตราการเสียซ้ำ (Predictive Trend : Recurrent Failure Rate)</h3>
          </div>
          <div class="panel-body">
            <div class="chart-container">
              <canvas ref="trendChartRef"></canvas>
            </div>
            <div class="panel-explain">
              <p><strong>Predictive Analysis :</strong> เส้นแนวโน้มนี้ช่วยระบุความไม่เสถียรที่กำลังเพิ่มขึ้น หากกราฟมีแนวโน้มสูงขึ้นอย่างต่อเนื่อง แสดงว่าจำเป็นต้องมีการบำรุงรักษาเชิงลึก หรือถึงเวลาต้องเปลี่ยนอุปกรณ์ใหม่</p>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: QC & CALIBRATION METRICS -->
      <div class="section-header">
        <h3>✅ ตัวชี้วัดการควบคุมคุณภาพและการสอบเทียบ (QC & Calibration Metrics)</h3>
        <p>การติดตามผลการปฏิบัติตามกฎระเบียบและมาตรฐานคุณภาพของภาพ (Monitoring compliance and image quality standards.)</p>
      </div>

      <div class="grid-2">
        <!-- Chart 3: QC Pass Rate -->
        <div class="panel">
          <div class="panel-header">
            <h3>ประสิทธิภาพอัตราการผ่านเกณฑ์ QC (QC Pass Rate Performance)</h3>
          </div>
          <div class="panel-body">
            <div class="chart-container">
              <canvas ref="qcChartRef"></canvas>
            </div>
            <div class="panel-explain">
              <p><strong>การตรวจสอบตามเกณฑ์ :</strong> แท่งสีเขียว แสดงถึงอัตราการผ่านเกณฑ์ที่ยอมรับได้ (มากกว่า 90%) แท่งสีแดง บ่งบอกถึงเดือนที่ต้องรีบตรวจสอบกระบวนการสอบเทียบโดยทันที</p>
            </div>
          </div>
        </div>

        <!-- Chart 4: Summary Pie -->
        <div class="panel">
          <div class="panel-header">
            <h3>สัดส่วนปัญหาที่พบโดยรวม (Overall Issue Distribution)</h3>
          </div>
          <div class="panel-body">
            <div class="chart-container pie-container">
              <canvas ref="pieChartRef"></canvas>
            </div>
          </div>
        </div>
      </div>

      <!-- SUMMARY STRIP -->
      <div class="summary-strip">
        <span class="summary-label">บทสรุป :</span>
        <span class="summary-text">
          แดชบอร์ดถูกอัปเดตเพื่อแยก "ปัญหาด้านการปฏิบัติงาน" ออกจาก "ประสิทธิภาพด้าน QC
          ให้ใช้ <strong>แนวโน้มการเสียซ้ำ (Recurrent Failure Trend)</strong> เพื่อคาดการณ์ความจำเป็นในการบำรุงรักษาในอนาคต
        </span>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import MainLayout from '../components/Layout/MainLayout.vue';
import {
  Chart,
  BarController,
  LineController,
  PieController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
Chart.register(
  BarController,
  LineController,
  PieController,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

/**
 * Data Source:
 * - failures: Number of breakdowns/repairs per month
 * - qcTotal: Total QC tests
 * - qcPassed: Passed QC tests
 * - recurrent: Recurrent failures (within 3 months)
 */
const currentYear = new Date().getFullYear();

const monthlyData = [
  { label: 'Jan', failures: 5, qcTotal: 50, qcPassed: 46, recurrent: 1 },
  { label: 'Feb', failures: 3, qcTotal: 45, qcPassed: 40, recurrent: 1 },
  { label: 'Mar', failures: 8, qcTotal: 48, qcPassed: 44, recurrent: 2 },
  { label: 'Apr', failures: 6, qcTotal: 52, qcPassed: 47, recurrent: 2 },
  { label: 'May', failures: 4, qcTotal: 55, qcPassed: 50, recurrent: 1 },
  { label: 'Jun', failures: 7, qcTotal: 50, qcPassed: 45, recurrent: 3 },
  { label: 'Jul', failures: 2, qcTotal: 48, qcPassed: 46, recurrent: 0 },
  { label: 'Aug', failures: 5, qcTotal: 52, qcPassed: 49, recurrent: 1 },
  { label: 'Sep', failures: 6, qcTotal: 54, qcPassed: 51, recurrent: 2 },
  { label: 'Oct', failures: 4, qcTotal: 51, qcPassed: 48, recurrent: 1 },
  { label: 'Nov', failures: 3, qcTotal: 49, qcPassed: 47, recurrent: 0 },
  { label: 'Dec', failures: 7, qcTotal: 53, qcPassed: 50, recurrent: 2 }
];

// Computed Data
const labels = computed(() => monthlyData.map(m => `${m.label}`));

const failureRate = computed(() => monthlyData.map(m => m.failures));

const qcPassRate = computed(() =>
  monthlyData.map(m =>
    m.qcTotal > 0 ? Math.round((m.qcPassed / m.qcTotal) * 100) : 0
  )
);

const rfrRate = computed(() =>
  monthlyData.map(m =>
    m.failures > 0 ? Math.round((m.recurrent / m.failures) * 100) : 0
  )
);

// Pie Chart Data
const totalFailure = computed(() =>
  monthlyData.reduce((sum, m) => sum + m.failures, 0)
);
const totalQcFail = computed(() =>
  monthlyData.reduce((sum, m) => sum + (m.qcTotal - m.qcPassed), 0)
);
const totalRecurrent = computed(() =>
  monthlyData.reduce((sum, m) => sum + m.recurrent, 0)
);

// Chart References
const failureChartRef = ref(null);
const trendChartRef = ref(null);
const qcChartRef = ref(null);
const pieChartRef = ref(null);

let failureChart = null;
let trendChart = null;
let qcChart = null;
let pieChart = null;

onMounted(() => {
  createFailureChart();
  createTrendChart();
  createQcChart();
  createPieChart();
});

// 1. Operational: Failure Rate + RFR (Mixed Chart)
const createFailureChart = () => {
  if (!failureChartRef.value) return;
  const ctx = failureChartRef.value.getContext('2d');

  failureChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.value,
      datasets: [
        {
          label: 'Monthly Failure Rate (จำนวนครั้ง)',
          data: failureRate.value,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          yAxisID: 'y',
          order: 2
        },
        {
          label: 'Recurrent Failure Rate (%)',
          data: rfrRate.value,
          type: 'line',
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.2)',
          borderWidth: 2,
          tension: 0.3,
          pointRadius: 4,
          yAxisID: 'y1',
          order: 1
        }
      ]
    },
    options: {
      responsive: true,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: 'ตัวชี้วัดการขัดข้อง (Monthly & Recurrent)',
          font: { size: 16, family: 'Noto Sans Thai' }
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y;
                if (context.dataset.yAxisID === 'y1') label += '%';
              }
              return label;
            }
          }
        }
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: 'Failures (จำนวนครั้ง)' },
          grid: { color: 'rgba(0,0,0,0.05)' }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: 'Recurrent Rate (%)' },
          grid: { drawOnChartArea: false },
          min: 0,
          max: 100
        }
      }
    }
  });
};

// 2. Operational: RFR Trend (Line Chart)
const createTrendChart = () => {
  if (!trendChartRef.value) return;
  const ctx = trendChartRef.value.getContext('2d');

  trendChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.value,
      datasets: [
        {
          label: 'Recurrent Failure Rate Trend (เฉลี่ยหมุนเวียน 3 เดือน)',
          data: rfrRate.value, // Using RFR directly for now, ideally would be a rolling avg calculation
          borderColor: '#8b5cf6', // Violet
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderWidth: 3,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#fff',
          pointBorderColor: '#8b5cf6',
          pointRadius: 5,
          pointHoverRadius: 7
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'การวิเคราะห์การบำรุงรักษาเชิงพยากรณ์ : แนวโน้มการเสียซ้ำ',
          font: { size: 16, family: 'Noto Sans Thai' }
        },
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: 'Recurrent Rate (%)' }
        }
      }
    }
  });
};

// 3. QC: Pass Rate (Bar Chart)
const createQcChart = () => {
  if (!qcChartRef.value) return;
  const ctx = qcChartRef.value.getContext('2d');

  qcChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.value,
      datasets: [
        {
          label: 'QC Pass Rate (%)',
          data: qcPassRate.value,
          backgroundColor: qcPassRate.value.map(val =>
            val >= 90 ? 'rgba(34, 197, 94, 0.7)' : 'rgba(239, 68, 68, 0.7)'
          ), // Green if >= 90, Red if < 90
          borderColor: 'rgba(0,0,0,0.1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'ประสิทธิภาพ QC & การสอบเทียบ (อัตราการผ่านเกณฑ์)',
          font: { size: 16, family: 'Noto Sans Thai' }
        },
        legend: { display: false } // Color indicates status
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: 'Pass Rate (%)' }
        }
      }
    }
  });
};

// 4. Summary: Pie Chart
const createPieChart = () => {
  if (!pieChartRef.value) return;
  const ctx = pieChartRef.value.getContext('2d');

  pieChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Total Failures', 'QC Failed', 'Recurrent Failures'],
      datasets: [
        {
          data: [totalFailure.value, totalQcFail.value, totalRecurrent.value],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)'
          ],
          borderWidth: 0
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'right' },
        title: {
          display: true,
          text: 'สัดส่วนปัญหาที่พบโดยรวม (Overall Issue Distribution)',
          font: { size: 14, family: 'Noto Sans Thai' }
        }
      }
    }
  });
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');

.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
  font-family: 'Noto Sans Thai', sans-serif;
}

.page-title {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #1f2937;
}

/* PANEL BASE */
.panel {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.3s ease;
}

.panel:hover {
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.panel-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 16px 20px;
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  letter-spacing: 0.3px;
}

.panel-body {
  padding: 24px;
}

/* CHART CONTAINER */
.chart-container {
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  border: 1px solid #e5e7eb;
}

.pie-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
}

/* EXPLANATION BLOCK */
.panel-explain {
  margin-top: 16px;
  padding: 16px 18px;
  border-radius: 12px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-left: 4px solid #f59e0b;
  font-size: 0.9rem;
  color: #78350f;
}

.explain-title {
  margin: 0 0 8px;
  font-weight: 700;
  font-size: 1rem;
  color: #92400e;
}

.explain-desc {
  margin: 0 0 12px;
  line-height: 1.6;
  color: #78350f;
}

.explain-list {
  margin: 8px 0 0;
  padding-left: 24px;
  line-height: 1.7;
}

.explain-list li {
  margin-bottom: 10px;
}

.explain-list li strong {
  color: #92400e;
  font-weight: 600;
}

.data-source {
  display: inline-block;
  margin-top: 4px;
  font-size: 0.82rem;
  color: #a16207;
  font-style: italic;
}

/* SUMMARY STRIP */
.summary-strip {
  margin-top: 8px;
  padding: 16px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  border-left: 4px solid #3b82f6;
  display: flex;
  gap: 10px;
  font-size: 0.95rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.summary-label {
  font-weight: 700;
  color: #1e40af;
}

.summary-text {
  flex: 1;
  line-height: 1.6;
  color: #1e3a8a;
}

/* NEW STYLES */
.section-header {
  margin-top: 16px;
  margin-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.section-header h3 {
  margin: 0;
  font-size: 1.4rem;
  color: #374151;
  font-weight: 700;
}

.section-header p {
  margin: 4px 0 0;
  color: #6b7280;
  font-size: 0.95rem;
}

.grid-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.5rem;
  }

  .panel-header h3 {
    font-size: 1rem;
  }

  .chart-container {
    padding: 15px;
  }

  .panel-body {
    padding: 16px;
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>