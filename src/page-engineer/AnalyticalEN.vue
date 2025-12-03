<template>
  <MainLayout>
    <div class="page">
      <div class="page-header">
        <h2 class="page-title">Analytical Dashboard</h2>

        <!-- Equipment Selector -->
        <div class="controls">
          <div class="control-group">
            <label>View Mode:</label>
            <div class="toggle-buttons">
              <button :class="['btn-toggle', { active: viewMode === 'all' }]" @click="viewMode = 'all'">
                Overview (All Machines)
              </button>
              <button :class="['btn-toggle', { active: viewMode === 'individual' }]" @click="viewMode = 'individual'">
                Individual Machine
              </button>
            </div>
          </div>

          <div class="control-group" v-if="viewMode === 'individual'">
            <label>Select Machine:</label>
            <select v-model="selectedMachineId" class="select-input">
              <option v-for="eq in equipmentList" :key="eq.id" :value="eq.id">
                {{ eq.name }} - {{ eq.location }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- SECTION 1: OPERATIONAL FAILURE METRICS -->
      <div class="section-header">
        <h3>🛠️ ตัวชี้วัดการขัดข้องของการปฏิบัติงาน (Operational Failure Metrics)</h3>
        <p>การวิเคราะห์การชำรุดของอุปกรณ์และปัญหาที่เกิดขึ้นซ้ำ (Analysis of equipment breakdowns and recurrent issues)
        </p>
      </div>

      <div class="grid-2">
        <!-- Chart 1: Failure Rate -->
        <div class="panel">
          <div class="panel-header">
            <h3>อัตราการขัดข้องรายเดือน (Monthly Failure Rate)</h3>
          </div>
          <div class="panel-body">
            <div class="chart-container">
              <canvas ref="failureChartRef"></canvas>
            </div>
            <div class="panel-explain">
              <p v-if="viewMode === 'all'">
                <strong>Overview:</strong> กราฟแท่งเปรียบเทียบจำนวนการเสียของแต่ละเครื่องในแต่ละเดือน (แยก 4 แท่ง)
                เพื่อให้เห็นความแตกต่างชัดเจน
              </p>
              <p v-else>
                <strong>Individual:</strong> กราฟแสดงจำนวนครั้งที่เครื่อง {{ getSelectedMachineName() }}
                ขัดข้องในแต่ละเดือน
              </p>
            </div>
          </div>
        </div>

        <!-- Chart 2: RFR Trend -->
        <div class="panel">
          <div class="panel-header">
            <h3>แนวโน้มอัตราการเสียซ้ำ (Recurrent Failure Rate Trend - 3 Month Rolling)</h3>
          </div>
          <div class="panel-body">
            <div class="chart-container">
              <canvas ref="trendChartRef"></canvas>
            </div>
            <div class="panel-explain">
              <p><strong>Predictive Analysis:</strong> คำนวณจากสัดส่วนการเสียซ้ำเทียบกับการเสียทั้งหมดในรอบ 3
                เดือนย้อนหลัง (Rolling Average)</p>
              <ul class="explain-list">
                <li>กราฟสูงขึ้น = ความเสถียรลดลง (Warning)</li>
                <li>กราฟต่ำลง = การซ่อมบำรุงมีประสิทธิภาพ</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <!-- SECTION 2: QC & CALIBRATION METRICS -->
      <div class="section-header">
        <h3>✅ ตัวชี้วัดการควบคุมคุณภาพและการสอบเทียบ (QC & Calibration Metrics)</h3>
        <p>การติดตามผลการปฏิบัติตามกฎระเบียบและมาตรฐานคุณภาพของภาพ</p>
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
              <p>แสดงเปอร์เซ็นต์การผ่านเกณฑ์มาตรฐานกรมวิทย์ฯ (เป้าหมาย > 90%)</p>
            </div>
          </div>
        </div>

        <!-- Chart 4: Summary Distribution -->
        <div class="panel">
          <div class="panel-header">
            <h3>สัดส่วนภาพรวม (Overall Distribution)</h3>
          </div>
          <div class="panel-body">
            <div class="chart-container pie-container">
              <canvas ref="pieChartRef"></canvas>
            </div>
            <div class="panel-explain">
              <p v-if="viewMode === 'all'">สัดส่วนจำนวนการขัดข้องทั้งหมด แบ่งตามเครื่องเอ็กซเรย์</p>
              <p v-else>สัดส่วนประเภทปัญหาของเครื่อง {{ getSelectedMachineName() }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- SUMMARY STRIP -->
      <div class="summary-strip">
        <span class="summary-label">บทสรุป :</span>
        <span class="summary-text">
          ข้อมูลถูกแยกวิเคราะห์รายเครื่องเพื่อความชัดเจน
          <strong>Recurrent Failure Rate (RFR)</strong> คำนวณแบบสะสม 3 เดือนเพื่อสะท้อนความเสถียรที่แท้จริง
          ควรตรวจสอบเครื่องที่มีแนวโน้ม RFR สูงกว่า 20% อย่างใกล้ชิด
        </span>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import MainLayout from '../components/Layout/MainLayout.vue';
import {
  Chart,
  BarController,
  LineController,
  PieController,
  DoughnutController,
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

Chart.register(
  BarController,
  LineController,
  PieController,
  DoughnutController,
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

// --- Data & Configuration ---

const equipmentList = [
  { id: 'xray1', name: 'X-Ray (BrandA/ModelX)', location: 'ห้อง 101', color: '#ef4444' }, // Red
  { id: 'xray2', name: 'X-Ray (BrandB/ModelY)', location: 'ห้อง 102', color: '#3b82f6' }, // Blue
  { id: 'xray3', name: 'X-Ray (BrandC/ModelZ)', location: 'ห้อง 103', color: '#10b981' }, // Green
  { id: 'xray4', name: 'X-Ray (BrandD/ModelW)', location: 'ห้อง 104', color: '#f59e0b' }  // Orange
];

// Mock Data Generation (12 months)
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Helper to generate random data consistent for demo
const generateData = (baseFailure, volatility) => {
  return months.map(() => {
    const failures = Math.max(0, Math.round(baseFailure + (Math.random() - 0.5) * volatility));
    const recurrent = failures > 0 ? Math.round(Math.random() * (failures * 0.4)) : 0; // 0-40% recurrent
    const qcTotal = 20 + Math.floor(Math.random() * 5);
    const qcPassed = qcTotal - Math.floor(Math.random() * 3); // High pass rate
    return { failures, recurrent, qcTotal, qcPassed };
  });
};

const db = {
  'xray1': generateData(4, 3), // Old machine, high failure
  'xray2': generateData(1, 1), // New machine, low failure
  'xray3': generateData(2, 2), // Average
  'xray4': generateData(3, 2)  // Average
};

// State
const viewMode = ref('all'); // 'all' | 'individual'
const selectedMachineId = ref(equipmentList[0].id);

// Chart Instances
let failureChart = null;
let trendChart = null;
let qcChart = null;
let pieChart = null;

// Refs
const failureChartRef = ref(null);
const trendChartRef = ref(null);
const qcChartRef = ref(null);
const pieChartRef = ref(null);

// --- Helpers ---

const getSelectedMachineName = () => {
  const eq = equipmentList.find(e => e.id === selectedMachineId.value);
  return eq ? eq.name : '';
};

// Calculate RFR (3-month rolling)
// Formula: Sum(Recurrent last 3 mos) / Sum(Failures last 3 mos) * 100
const calculateRollingRFR = (dataArray) => {
  return dataArray.map((_, index) => {
    if (index < 2) return 0; // Need at least 3 months (0,1,2)

    // Slice includes current index
    const window = dataArray.slice(index - 2, index + 1);
    const sumFailures = window.reduce((acc, curr) => acc + curr.failures, 0);
    const sumRecurrent = window.reduce((acc, curr) => acc + curr.recurrent, 0);

    if (sumFailures === 0) return 0;
    return Math.round((sumRecurrent / sumFailures) * 100);
  });
};

// --- Chart Rendering ---

const renderCharts = () => {
  renderFailureChart();
  renderTrendChart();
  renderQCChart();
  renderPieChart();
};

const renderFailureChart = () => {
  if (failureChart) failureChart.destroy();
  const ctx = failureChartRef.value.getContext('2d');

  let config;

  if (viewMode.value === 'all') {
    // Grouped Bar Chart (Side-by-Side)
    config = {
      type: 'bar',
      data: {
        labels: months,
        datasets: equipmentList.map(eq => ({
          label: eq.name,
          data: db[eq.id].map(d => d.failures),
          backgroundColor: eq.color,
          // stack: 'total' removed
        }))
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          tooltip: { mode: 'index', intersect: false }
        },
        scales: {
          x: { stacked: false },
          y: { stacked: false, title: { display: true, text: 'Number of Failures' } }
        }
      }
    };
  } else {
    // Individual: Bar Chart
    const eq = equipmentList.find(e => e.id === selectedMachineId.value);
    const data = db[eq.id];
    config = {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'Failures',
          data: data.map(d => d.failures),
          backgroundColor: eq.color,
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, title: { display: true, text: 'Number of Failures' } }
        }
      }
    };
  }

  failureChart = new Chart(ctx, config);
};

const renderTrendChart = () => {
  if (trendChart) trendChart.destroy();
  const ctx = trendChartRef.value.getContext('2d');

  let datasets = [];

  if (viewMode.value === 'all') {
    // Multi-line chart
    datasets = equipmentList.map(eq => ({
      label: eq.name,
      data: calculateRollingRFR(db[eq.id]),
      borderColor: eq.color,
      backgroundColor: 'transparent',
      tension: 0.3,
      pointRadius: 3
    }));
  } else {
    // Single line
    const eq = equipmentList.find(e => e.id === selectedMachineId.value);
    datasets = [{
      label: 'RFR % (Rolling 3-Month)',
      data: calculateRollingRFR(db[eq.id]),
      borderColor: eq.color,
      backgroundColor: eq.color + '20', // transparent fill
      fill: true,
      tension: 0.3
    }];
  }

  trendChart = new Chart(ctx, {
    type: 'line',
    data: { labels: months, datasets },
    options: {
      responsive: true,
      interaction: { mode: 'index', intersect: false },
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: { display: true, text: 'Recurrent Failure Rate (%)' }
        }
      },
      plugins: {
        annotation: {
          annotations: {
            line1: {
              type: 'line',
              yMin: 20,
              yMax: 20,
              borderColor: 'red',
              borderWidth: 1,
              borderDash: [5, 5],
              label: { enabled: true, content: 'Warning Threshold (20%)' }
            }
          }
        }
      }
    }
  });
};

const renderQCChart = () => {
  if (qcChart) qcChart.destroy();
  const ctx = qcChartRef.value.getContext('2d');

  let config;

  if (viewMode.value === 'all') {
    // Multi-line for QC Pass Rate comparison
    config = {
      type: 'line',
      data: {
        labels: months,
        datasets: equipmentList.map(eq => {
          const rates = db[eq.id].map(d => Math.round((d.qcPassed / d.qcTotal) * 100));
          return {
            label: eq.name,
            data: rates,
            borderColor: eq.color,
            tension: 0.2,
            pointRadius: 3
          };
        })
      },
      options: {
        responsive: true,
        scales: {
          y: { min: 80, max: 100, title: { display: true, text: 'Pass Rate (%)' } }
        }
      }
    };
  } else {
    // Individual: Bar Chart with Color Coding
    const eq = equipmentList.find(e => e.id === selectedMachineId.value);
    const rates = db[eq.id].map(d => Math.round((d.qcPassed / d.qcTotal) * 100));

    config = {
      type: 'bar',
      data: {
        labels: months,
        datasets: [{
          label: 'QC Pass Rate %',
          data: rates,
          backgroundColor: rates.map(r => r >= 90 ? '#22c55e' : '#ef4444'), // Green vs Red
        }]
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: {
          y: { min: 0, max: 100, title: { display: true, text: 'Pass Rate (%)' } }
        }
      }
    };
  }

  qcChart = new Chart(ctx, config);
};

const renderPieChart = () => {
  if (pieChart) pieChart.destroy();
  const ctx = pieChartRef.value.getContext('2d');

  let config;

  if (viewMode.value === 'all') {
    // Distribution of Total Failures by Machine
    const totalFailuresByMachine = equipmentList.map(eq => {
      return db[eq.id].reduce((acc, curr) => acc + curr.failures, 0);
    });

    config = {
      type: 'doughnut',
      data: {
        labels: equipmentList.map(e => e.name),
        datasets: [{
          data: totalFailuresByMachine,
          backgroundColor: equipmentList.map(e => e.color)
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Total Failures by Machine' }
        }
      }
    };
  } else {
    // Distribution of Issues for Specific Machine
    const eq = equipmentList.find(e => e.id === selectedMachineId.value);
    const data = db[eq.id];
    const totalFailures = data.reduce((acc, curr) => acc + curr.failures, 0);
    const totalRecurrent = data.reduce((acc, curr) => acc + curr.recurrent, 0);
    const uniqueFailures = totalFailures - totalRecurrent;
    const qcFailures = data.reduce((acc, curr) => acc + (curr.qcTotal - curr.qcPassed), 0);

    config = {
      type: 'doughnut',
      data: {
        labels: ['Unique Failures', 'Recurrent Failures', 'QC Failures'],
        datasets: [{
          data: [uniqueFailures, totalRecurrent, qcFailures],
          backgroundColor: ['#3b82f6', '#f59e0b', '#ef4444']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          title: { display: true, text: 'Issue Type Distribution' }
        }
      }
    };
  }

  pieChart = new Chart(ctx, config);
};

// --- Lifecycle ---

onMounted(() => {
  renderCharts();
});

watch([viewMode, selectedMachineId], () => {
  renderCharts();
});

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Thai:wght@300;400;500;600;700&display=swap');

.page {
  font-family: 'Noto Sans Thai', sans-serif;
  color: #1f2937;
  max-width: 1200px;
  margin: 0 auto;
  padding-bottom: 40px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.page-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

/* Controls */
.controls {
  display: flex;
  gap: 20px;
  align-items: center;
  background: white;
  padding: 10px 16px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.control-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.control-group label {
  font-weight: 600;
  font-size: 0.9rem;
  color: #4b5563;
}

.toggle-buttons {
  display: flex;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
}

.btn-toggle {
  border: none;
  background: transparent;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.btn-toggle.active {
  background: white;
  color: #2563eb;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-weight: 600;
}

.select-input {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
}

/* Sections */
.section-header {
  margin-top: 24px;
  margin-bottom: 16px;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.section-header h3 {
  font-size: 1.25rem;
  color: #374151;
  margin: 0 0 4px 0;
}

.section-header p {
  color: #6b7280;
  font-size: 0.9rem;
  margin: 0;
}

/* Grid & Panels */
.grid-2 {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(450px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.panel {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel-header {
  background: #f8fafc;
  padding: 16px 20px;
  border-bottom: 1px solid #e2e8f0;
}

.panel-header h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #334155;
}

.panel-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
}

.pie-container {
  display: flex;
  justify-content: center;
}

.panel-explain {
  margin-top: 16px;
  background: #fffbeb;
  border-left: 4px solid #f59e0b;
  padding: 12px 16px;
  border-radius: 0 8px 8px 0;
  font-size: 0.85rem;
  color: #92400e;
}

.panel-explain p {
  margin: 0;
}

.explain-list {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

/* Summary Strip */
.summary-strip {
  background: #eff6ff;
  border-left: 4px solid #3b82f6;
  padding: 16px 20px;
  border-radius: 8px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.summary-label {
  font-weight: 700;
  color: #1e40af;
  white-space: nowrap;
}

.summary-text {
  color: #1e3a8a;
  line-height: 1.5;
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .controls {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .grid-2 {
    grid-template-columns: 1fr;
  }
}
</style>
