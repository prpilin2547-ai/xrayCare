<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-title">Analytical</h2>

      <!-- 1) BAR CHART -->
      <div class="panel chart-panel">
        <div class="panel-header">
          <h3>1. การวิเคราะห์ประสิทธิภาพและคุณภาพเครื่องเอกซเรย์</h3>
        </div>
        <div class="panel-body">
          <div class="chart-container">
            <canvas ref="barChartRef"></canvas>
          </div>

          <!-- explanation -->
          <div class="panel-explain">
            <p class="explain-title">📊 กราฟแท่ง (Bar Chart) คืออะไร?</p>
            <p class="explain-desc">
              กราฟแท่งเป็นกราฟที่ใช้แท่งสี่เหลี่ยมในการแสดงข้อมูลเชิงปริมาณ
              เหมาะสำหรับการเปรียบเทียบค่าต่างๆ ในแต่ละช่วงเวลา หรือหมวดหมู่
            </p>
            <p class="explain-title">สถิติที่ใช้ในกราฟนี้</p>
            <ul class="explain-list">
              <li>
                <strong>Failure Rate (จำนวนครั้งที่เสีย/เดือน)</strong>
                = จำนวนครั้งที่เครื่องเอกซเรย์ <u>ขัดข้องหรือมีการแจ้งซ่อม</u> ในแต่ละเดือน
                <br><span class="data-source">ข้อมูลจาก: แบบบันทึกการแจ้งซ่อม/การขัดข้อง</span>
              </li>
              <li>
                <strong>QC Pass Rate (%)</strong>
                = (จำนวนครั้งที่ผลการทดสอบ QC <u>ผ่านเกณฑ์กรมวิทย์</u> ÷
                จำนวนการทดสอบ QC ทั้งหมดในเดือนนั้น) × 100
                <br><span class="data-source">ข้อมูลจาก: แบบบันทึกการทดสอบ QC รายรอบ</span>
              </li>
              <li>
                <strong>Recurrent Failure Rate (RFR, %)</strong>
                = (จำนวนการเสียที่จัดเป็น <u>การเสียซ้ำ</u> ภายใน 3 เดือน
                ÷ จำนวนการเสียทั้งหมดในช่วงเดียวกัน) × 100
                <br><span class="data-source">ข้อมูลจาก: การวิเคราะห์ประวัติการซ่อมในระบบ</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 2) LINE CHART -->
      <div class="panel chart-panel">
        <div class="panel-header">
          <h3>2. แนวโน้มประสิทธิภาพและคุณภาพตามช่วงเวลา</h3>
        </div>
        <div class="panel-body">
          <div class="chart-container">
            <canvas ref="lineChartRef"></canvas>
          </div>

          <!-- explanation -->
          <div class="panel-explain">
            <p class="explain-title">📈 กราฟเส้น (Line Chart) คืออะไร?</p>
            <p class="explain-desc">
              กราฟเส้นเป็นกราฟที่ใช้เส้นเชื่อมจุดข้อมูลต่างๆ เพื่อแสดงแนวโน้มหรือการเปลี่ยนแปลงของข้อมูลตามช่วงเวลา
              เหมาะสำหรับการวิเคราะห์ว่าค่าต่างๆ เพิ่มขึ้น ลดลง หรือคงที่
            </p>
            <p class="explain-title">การตีความจากกราฟเส้น</p>
            <ul class="explain-list">
              <li>
                ใช้ดู <strong>แนวโน้ม</strong> ว่าจำนวนการเสีย (Failure Rate) เพิ่มขึ้นหรือลดลงในแต่ละเดือน
              </li>
              <li>
                ดูว่า <strong>คุณภาพภาพและปริมาณรังสี (QC Pass Rate)</strong>
                มีแนวโน้มคงที่ ดีขึ้น หรือแย่ลงเมื่อเทียบแต่ละเดือน
              </li>
              <li>
                ตรวจสอบว่า <strong>Recurrent Failure Rate (RFR)</strong>
                มีช่วงไหนที่สูงผิดปกติ ซึ่งอาจบ่งชี้ว่าเครื่องไม่เสถียร หรือการซ่อมไม่แก้ปัญหาต้นเหตุ
              </li>
            </ul>
            <p class="explain-title">สถิติที่ใช้</p>
            <p class="explain-desc">
              ใช้ข้อมูลเดียวกับกราฟแท่ง แต่แสดงในรูปแบบเส้นเพื่อให้เห็นแนวโน้มการเปลี่ยนแปลงได้ชัดเจนขึ้น
            </p>
          </div>
        </div>
      </div>

      <!-- 3) PIE CHART -->
      <div class="panel chart-panel">
        <div class="panel-header">
          <h3>3. สัดส่วนปัญหาทั้งหมดที่เกิดขึ้น</h3>
        </div>
        <div class="panel-body">
          <div class="chart-container pie-container">
            <canvas ref="pieChartRef"></canvas>
          </div>

          <!-- explanation -->
          <div class="panel-explain">
            <p class="explain-title">🥧 กราฟวงกลม/แผนภูมิวงกลม (Pie Chart) คืออะไร?</p>
            <p class="explain-desc">
              กราฟวงกลมเป็นกราฟที่แสดงสัดส่วนของข้อมูลแต่ละประเภทเทียบกับข้อมูลทั้งหมด
              โดยแบ่งวงกลมออกเป็นส่วนต่างๆ ตามเปอร์เซ็นต์ เหมาะสำหรับการดูภาพรวมว่าส่วนไหนมีสัดส่วนมากที่สุด
            </p>
            <p class="explain-title">สถิติที่ใช้ใน Pie Chart</p>
            <ul class="explain-list">
              <li>
                <strong>จำนวนการเสียทั้งหมด (Total Failures)</strong> =
                ผลรวมจำนวนครั้งที่เครื่องขัดข้องหรือมีการแจ้งซ่อมทุกเดือน
                <br><span class="data-source">คำนวณจาก: Σ Failure Rate ทุกเดือน</span>
              </li>
              <li>
                <strong>จำนวนครั้ง QC ไม่ผ่านเกณฑ์ (Total QC Failures)</strong> =
                ผลรวมของ (จำนวนการทดสอบ QC ทั้งหมด − จำนวนที่ผ่านเกณฑ์) ทุกเดือน
                <br><span class="data-source">คำนวณจาก: Σ (QC Total - QC Passed) ทุกเดือน</span>
              </li>
              <li>
                <strong>จำนวนการเสียซ้ำ (Total Recurrent Failures)</strong> =
                ผลรวมครั้งที่เครื่องเสียซ้ำภายในช่วงเวลาสั้น (3 เดือนหลังจากซ่อม)
                <br><span class="data-source">คำนวณจาก: Σ Recurrent Failures ทุกเดือน</span>
              </li>
              <li>
                สัดส่วนในวงกลม = (จำนวนของแต่ละประเภท ÷ จำนวนเหตุการณ์ทั้งหมด) × 100
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- SUMMARY STRIP -->
      <div class="summary-strip">
        <span class="summary-label">สรุป :</span>
        <span class="summary-text">
          ระบบแสดงข้อมูลจริงจากแบบบันทึกเพื่อวิเคราะห์
          1) ประสิทธิภาพเครื่องเอกซเรย์ (Failure Rate)
          2) คุณภาพภาพและปริมาณรังสี (QC Pass Rate)
          และ 3) ความเสถียรของเครื่องจากการเสียซ้ำ (Recurrent Failure Rate; RFR)
          โดยแสดงทั้งในรูปกราฟแท่ง กราฟเส้น และแผนภูมิวงกลม
        </span>
      </div>

      <!-- ========== HISTORY SECTION ========== -->
      <div class="panel">
        <div class="panel-header">
          <h3>ประวัติการทำรายการ</h3>
        </div>

        <div class="panel-body history-body">
          <!-- Search Filters -->
          <div class="history-filters">
            <input v-model="filters.device" class="history-input" placeholder="ค้นหาตามชื่อเครื่อง..." />

            <select v-model="filters.form" class="history-input">
              <option value="">เลือกแบบบันทึก</option>
              <option>dairy check</option>
              <option>monthly check(1 month)</option>
              <option>monthly check(3 month)</option>
              <option>monthly check(6 month)</option>
            </select>

            <input type="date" v-model="filters.date" class="history-input" />

            <button class="history-btn" @click="searchHistory">
              ค้นหา
            </button>
          </div>

          <!-- Table -->
          <div class="table-responsive mt-2">
            <table class="table table-bordered small history-table">
              <thead class="table-light text-center">
                <tr>
                  <th>วันที่</th>
                  <th>ผู้ทำ</th>
                  <th>เครื่อง</th>
                  <th>แบบบันทึก</th>
                  <th>ผล</th>
                  <th>รายละเอียด</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in history" :key="item.id">
                  <td>{{ item.timestamp }}</td>
                  <td>{{ item.user }}</td>
                  <td>{{ item.device }}</td>
                  <td class="fw-bold">{{ item.form }}</td>
                  <td>
                    <span :class="item.status === 'Pass' ? 'tag-pass' : 'tag-fail'">
                      {{ item.status }}
                    </span>
                  </td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary" @click="openDetail(item)">
                      ดูเพิ่มเติม
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Pagination -->
          <div class="history-pagination">
            <button class="page-btn" @click="prevPage" :disabled="page === 1">
              ‹
            </button>
            <span>หน้า {{ page }}</span>
            <button class="page-btn" @click="nextPage">
              ›
            </button>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <div v-if="modal.open" class="modal-backdrop">
        <div class="modal-card">
          <h3 class="modal-title">รายละเอียดการทำรายการ</h3>

          <p><strong>วันที่:</strong> {{ modal.data.timestamp }}</p>
          <p><strong>ผู้ทำ:</strong> {{ modal.data.user }}</p>
          <p><strong>เครื่อง:</strong> {{ modal.data.device }}</p>
          <p><strong>แบบบันทึก:</strong> {{ modal.data.form }}</p>
          <p><strong>ผล:</strong> {{ modal.data.status }}</p>

          <div class="modal-section">
            <strong>ข้อมูลที่บันทึก</strong>
            <pre class="modal-json">{{ modal.data.values }}</pre>
          </div>

          <button class="modal-close" @click="modal.open = false">
            ปิด
          </button>
        </div>
      </div>
      <!-- ========== END HISTORY SECTION ========== -->
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import MainLayout from '../components/Layout/MainLayout.vue'
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
  Legend
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
  Legend
);

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

const labels = computed(() => monthlyData.map(m => `${m.label} ${currentYear}`));
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

const totalFailure = computed(() =>
  monthlyData.reduce((sum, m) => sum + m.failures, 0)
);
const totalQcFail = computed(() =>
  monthlyData.reduce((sum, m) => sum + (m.qcTotal - m.qcPassed), 0)
);
const totalRecurrent = computed(() =>
  monthlyData.reduce((sum, m) => sum + m.recurrent, 0)
);

const barChartRef = ref(null);
const lineChartRef = ref(null);
const pieChartRef = ref(null);

let barChart = null;
let lineChart = null;
let pieChart = null;

onMounted(() => {
  createBarChart();
  createLineChart();
  createPieChart();
});

const createBarChart = () => {
  if (!barChartRef.value) return;
  const ctx = barChartRef.value.getContext('2d');
  barChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.value,
      datasets: [
        {
          label: 'Failure Rate (ครั้ง/เดือน)',
          data: failureRate.value,
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        },
        {
          label: 'QC Pass Rate (%)',
          data: qcPassRate.value,
          backgroundColor: 'rgba(54, 162, 235, 0.7)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Recurrent Failure Rate (%)',
          data: rfrRate.value,
          backgroundColor: 'rgba(255, 206, 86, 0.7)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { size: 12 }, padding: 15, usePointStyle: true }
        },
        title: {
          display: true,
          text: 'การเปรียบเทียบ Failure Rate, QC Pass Rate และ RFR รายเดือน',
          font: { size: 14, weight: 'bold' },
          padding: { top: 10, bottom: 20 }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.1)', drawBorder: true },
          ticks: { font: { size: 11 } }
        },
        x: {
          grid: { display: false },
          ticks: { font: { size: 11 } }
        }
      }
    }
  });
};

const createLineChart = () => {
  if (!lineChartRef.value) return;
  const ctx = lineChartRef.value.getContext('2d');
  lineChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels.value,
      datasets: [
        {
          label: 'Failure Rate (ครั้ง/เดือน)',
          data: failureRate.value,
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(255, 99, 132, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'QC Pass Rate (%)',
          data: qcPassRate.value,
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(54, 162, 235, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        },
        {
          label: 'Recurrent Failure Rate (%)',
          data: rfrRate.value,
          borderColor: 'rgba(255, 206, 86, 1)',
          backgroundColor: 'rgba(255, 206, 86, 0.1)',
          borderWidth: 2,
          tension: 0.3,
          fill: true,
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: 'rgba(255, 206, 86, 1)',
          pointBorderColor: '#fff',
          pointBorderWidth: 2
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: { font: { size: 12 }, padding: 15, usePointStyle: true }
        },
        title: {
          display: true,
          text: 'แนวโน้มการเปลี่ยนแปลงของ Failure Rate, QC Pass Rate และ RFR',
          font: { size: 14, weight: 'bold' },
          padding: { top: 10, bottom: 20 }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: 'rgba(0, 0, 0, 0.1)', drawBorder: true },
          ticks: { font: { size: 11 } }
        },
        x: {
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: { font: { size: 11 } }
        }
      }
    }
  });
};

const createPieChart = () => {
  if (!pieChartRef.value) return;
  const ctx = pieChartRef.value.getContext('2d');
  pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [
        `การเสียทั้งหมด (${totalFailure.value} ครั้ง)`,
        `QC ไม่ผ่านเกณฑ์ (${totalQcFail.value} ครั้ง)`,
        `การเสียซ้ำ (${totalRecurrent.value} ครั้ง)`
      ],
      datasets: [
        {
          data: [totalFailure.value, totalQcFail.value, totalRecurrent.value],
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)'
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 2,
          hoverOffset: 15
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          display: true,
          position: 'right',
          labels: {
            font: { size: 12 },
            padding: 15,
            usePointStyle: true,
            pointStyle: 'circle'
          }
        },
        title: {
          display: true,
          text: 'สัดส่วนปัญหาทั้งหมดที่เกิดขึ้น',
          font: { size: 14, weight: 'bold' },
          padding: { top: 10, bottom: 20 }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleFont: { size: 13 },
          bodyFont: { size: 12 },
          padding: 12,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              const label = context.label || '';
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = ((value / total) * 100).toFixed(1);
              return `${label}: ${percentage}%`;
            }
          }
        }
      }
    }
  });
};

// History section data
const filters = ref({
  device: '',
  form: '',
  date: ''
})

const page = ref(1)

const history = ref([
  {
    id: 1,
    timestamp: '2025-02-01 10:20',
    user: 'John Doe',
    device: 'X-Ray Model A / Room 101',
    form: 'F3',
    status: 'Pass',
    values: '{ "brightness": 220, "contrast": 180 }'
  },
  {
    id: 2,
    timestamp: '2025-02-03 09:10',
    user: 'Jane Smith',
    device: 'X-Ray Model B / Room 102',
    form: 'F7-1',
    status: 'Fail',
    values: '{ "alignment": "3.5°", "limit": "3°" }'
  }
])

const modal = ref({
  open: false,
  data: {}
})

const openDetail = (item) => {
  modal.value.data = item
  modal.value.open = true
}

const searchHistory = () => {
  console.log('ค้นหาด้วย filter:', filters.value)
}

const nextPage = () => {
  page.value++
}

const prevPage = () => {
  if (page.value > 1) page.value--
}
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 24px;
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

.panel.chart-panel:hover {
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
  min-height: 400px;
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

/* ========== HISTORY SECTION STYLES ========== */
.history-body {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.history-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.history-input {
  padding: 6px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 0.9rem;
}

.history-btn {
  background: var(--purple-main);
  color: white;
  border: none;
  padding: 6px 16px;
  border-radius: 8px;
  cursor: pointer;
}

.tag-pass {
  background: #10b981;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
}

.tag-fail {
  background: #ef4444;
  color: white;
  padding: 2px 8px;
  border-radius: 6px;
}

.history-pagination {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 6px;
}

.page-btn {
  background: #e5e7eb;
  border: none;
  padding: 4px 12px;
  border-radius: 6px;
}

/* Modal */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
}

.modal-card {
  background: white;
  width: 480px;
  max-width: 90vw;
  padding: 18px;
  border-radius: 14px;
  box-shadow: 0 8px 22px rgba(0, 0, 0, 0.2);
}

.modal-title {
  margin: 0 0 10px;
  font-size: 1.1rem;
}

.modal-json {
  background: #f3f4f6;
  padding: 8px;
  border-radius: 8px;
  max-height: 180px;
  overflow-y: auto;
  font-size: 0.8rem;
}

.modal-close {
  margin-top: 14px;
  padding: 8px 14px;
  background: var(--purple-main);
  color: white;
  border: none;
  border-radius: 8px;
  width: 100%;
  cursor: pointer;
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

  .explain-list {
    padding-left: 18px;
    font-size: 0.85rem;
  }
}
</style>