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

        <div class="col-lg-8">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white py-3">
              <h5 class="card-title m-0 text-primary">
                <i class="bi bi-bar-chart-line-fill me-2"></i>
                กราฟแสดงจำนวนครั้งที่เครื่องขัดข้อง (Failure Rate) เปรียบเทียบกับ อัตราการเสียซ้ำ (Recurrent Failure
                Rate)
                <small class="text-muted d-block mt-1" style="font-size: 0.8em;">
                  ประจำเดือน {{ displayMonth }} ปี {{ displayYear }}
                </small>
              </h5>
            </div>
            <div class="card-body">
              <div class="chart-container" style="position: relative; height: 400px; width: 100%;">
                <canvas id="analyticalChart"></canvas>
              </div>
            </div>
          </div>
        </div>

        <div class="col-lg-4">
          <div class="card shadow-sm h-100">
            <div class="card-header bg-white py-3">
              <h5 class="card-title m-0 text-success">
                <i class="bi bi-pie-chart-fill me-2"></i>
                ผลการทดสอบ QC & Dose
              </h5>
            </div>
            <div class="card-body d-flex flex-column justify-content-center align-items-center">
              <div class="chart-container" style="position: relative; height: 300px; width: 100%;">
                <canvas id="qcChart"></canvas>
              </div>
              <div class="mt-3 text-center text-muted small">
                สัดส่วนการผ่านเกณฑ์มาตรฐานกรมวิทย์ฯ
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

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, nextTick } from 'vue';
import MainLayout from '../components/Layout/MainLayout.vue';
import Chart from 'chart.js/auto';

// Constants
const thaiMonths = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// State
const selectedMonth = ref('');
const selectedYear = ref('');
const displayMonth = ref('');
const displayYear = ref('');
const showGraph = ref(false);

// Chart Instances
let performanceChart = null;
let qcChart = null;

// Methods
const handleSearch = () => {
  if (selectedMonth.value && selectedYear.value) {
    showGraph.value = true;
    displayMonth.value = selectedMonth.value;
    displayYear.value = selectedYear.value;

    nextTick(() => {
      renderPerformanceChart();
      renderQCChart();
    });
  } else {
    showGraph.value = false;
  }
};

// 1. Render Combo Chart (Failure Count + RFR) -> ปรับปรุงข้อมูลตามรูปภาพ
const renderPerformanceChart = () => {
  const ctx = document.getElementById('analyticalChart');
  if (performanceChart) performanceChart.destroy();

  // ปรับ Label ให้สื่อความหมายตาม Case ในรูป (หรือใช้ชื่อเครื่องปกติก็ได้)
  const labels = [
    'X-Ray (BrandA/ModelX)',
    'X-Ray (BrandB/ModelY)',
    'X-Ray (BrandC/ModelZ)',
    'X-Ray (BrandD/ModelW)'
  ];

  // DATA MAPPING ตามรูปภาพ:
  // 1. แท่งสูง + จุดต่ำ = Aging/Overused
  // 2. แท่งสูง + จุดสูง = Critical
  // 3. แท่งเตี้ย + จุดสูง = Poor Repair
  // 4. แท่งเตี้ย + จุดต่ำ = Healthy

  const failureData = [15, 12, 3, 1];      // Bar (แกนซ้าย): สูง, สูง, ต่ำ, ต่ำ
  const rfrData = [5, 85, 60, 0];     // Line (แกนขวา): ต่ำ, สูง, สูง, ต่ำ

  performanceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'จำนวนแจ้งซ่อม (ครั้ง)',
          data: failureData,
          backgroundColor: 'rgba(54, 162, 235, 0.7)', // สีฟ้า (Blue Bar)
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          order: 2,
          yAxisID: 'y'
        },
        {
          label: 'อัตราการเสียซ้ำ (RFR %)',
          data: rfrData,
          type: 'line',
          borderColor: 'rgba(255, 99, 132, 1)',     // สีแดง (Red Dot/Line)
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 3,
          pointBackgroundColor: '#fff',
          pointBorderColor: 'rgba(255, 99, 132, 1)',
          pointRadius: 6,           // ขนาดจุด
          pointHoverRadius: 8,
          order: 1,
          yAxisID: 'y1',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          beginAtZero: true,
          title: { display: true, text: 'จำนวนครั้ง (Count)' },
          grid: { drawOnChartArea: true }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 0,
          max: 100, // ล็อกแกนขวาไว้ที่ 0-100%
          title: { display: true, text: 'อัตราการเสียซ้ำ (%)' },
          grid: { drawOnChartArea: false },
          ticks: {
            callback: function (value) { return value + "%" }
          }
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || '';
              if (label) {
                label += ': ';
              }
              if (context.parsed.y !== null) {
                label += context.parsed.y;
                if (context.dataset.type === 'line') label += '%';
              }
              return label;
            }
          }
        }
      }
    }
  });
};

// 2. Render Donut Chart (QC Pass/Fail)
const renderQCChart = () => {
  const ctx = document.getElementById('qcChart');
  if (qcChart) qcChart.destroy();

  const qcData = [95, 5];

  qcChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Pass (ผ่านเกณฑ์)', 'Fail (ไม่ผ่านเกณฑ์)'],
      datasets: [{
        data: qcData,
        backgroundColor: ['#28a745', '#dc3545'],
        hoverOffset: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              return ` ${context.label}: ${context.parsed}%`;
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