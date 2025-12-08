<template>
  <MainLayout>
    <div class="container-fluid p-4">
      <h1 class="mb-4">Analytical</h1>

      <!-- Filter Section -->
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

      <!-- Graph Section -->
      <div class="card shadow-sm" v-if="showGraph">
        <div class="card-header bg-white py-3">
          <h5 class="card-title m-0 text-primary">
            กราฟแสดงจำนวนครั้งที่เครื่องขัดข้อง (Failure Rate) เปรียบเทียบกับ อัตราการเสียซ้ำ (Recurrent Failure Rate)
            <span v-if="displayMonth && displayYear">
              ประจำเดือน {{ displayMonth }} ปี {{ displayYear }}
            </span>
            <span v-else>
              ประจำเดือน _____ ปี _____
            </span>
          </h5>
        </div>
        <div class="card-body">
          <div class="chart-container" style="position: relative; height: 400px; width: 100%;">
            <canvas id="analyticalChart"></canvas>
          </div>
        </div>
      </div>

      <!-- Initial Placeholder if not searched (Optional based on requirements, but user said "show header... but not month year until filled") -->
      <!-- The requirements said: "When entering this page first time... show header words but NOT month/year... shows month/year ONLY after filling form and clicking search" -->
      <!-- My implementation above handles this with v-if logic on the span texts. -->
      <div v-else class="card shadow-sm">
        <div class="card-header bg-white py-3">
          <h5 class="card-title m-0 text-primary">
            กราฟแสดงจำนวนครั้งที่เครื่องขัดข้อง (Failure Rate) เปรียบเทียบกับ อัตราการเสียซ้ำ (Recurrent Failure Rate)
            ประจำเดือน _____ ปี _____
          </h5>
        </div>
        <div class="card-body d-flex justify-content-center align-items-center"
          style="height: 400px; background-color: #f8f9fa;">
          <p class="text-muted">กรุณากรอกข้อมูลและกดปุ่มค้นหาเพื่อแสดงข้อมูล</p>
        </div>
      </div>

    </div>
  </MainLayout>
</template>

<script setup>
import { ref, onMounted, nextTick } from 'vue';
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
let myChart = null;

// Methods
const handleSearch = () => {
  // Always show the card/header when search is clicked
  showGraph.value = true;

  if (selectedMonth.value && selectedYear.value) {
    displayMonth.value = selectedMonth.value;
    displayYear.value = selectedYear.value;

    // Wait for DOM update to ensure canvas exists
    nextTick(() => {
      renderChart(selectedMonth.value, selectedYear.value);
    });
  } else {
    // Clear display values to show underscores
    displayMonth.value = '';
    displayYear.value = '';
  }
};

const renderChart = (month, year) => {
  const ctx = document.getElementById('analyticalChart');

  if (myChart) {
    myChart.destroy();
  }

  // Generate Mock Data based on selection (Random for demo)
  // In a real app, this would filter based on the standard monthly sequence
  // For this demo, we will show relevant data. 
  // Let's assume we show the breakdown for the specific month (Metrics vs Targets? or Comparison?)
  // Requirement: "Graph showing Failure Rate (Count) vs Recurrent Failure Rate (Rate)"

  // Since it's "For Month X Year Y", presenting a single data point is often dull.
  // However, specifically for "Analytical" dashboards, often you want to see the Trend LEADING up to that month.
  // OR you want to see the specific stats for that month compared to others?
  // Let's create a chart with 2 datasets: 
  // 1. Failure Count (Bar)
  // 2. Recurrent Failure Rate (Line)
  // We will display 12 months of the selected year for context, and highlight the selected month?
  // Or just display random data.

  const labels = thaiMonths;
  const failureData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 10)); // 0-10 failures
  const rfrData = Array.from({ length: 12 }, () => Math.floor(Math.random() * 30)); // 0-30 %

  myChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'จำนวนครั้งที่เครื่องขัดข้อง (Failure Rate)',
          data: failureData,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
          yAxisID: 'y',
        },
        {
          label: 'อัตราการเสียซ้ำ (Recurrent Failure Rate %)',
          data: rfrData,
          type: 'line',
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderWidth: 2,
          yAxisID: 'y1',
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          type: 'linear',
          position: 'left',
          title: {
            display: true,
            text: 'จำนวนครั้ง (Count)'
          }
        },
        y1: {
          beginAtZero: true,
          type: 'linear',
          position: 'right',
          grid: {
            drawOnChartArea: false, // only want the grid lines for one axis to show up
          },
          title: {
            display: true,
            text: 'อัตราการเสียซ้ำ (%)'
          },
          ticks: {
            callback: function (value) {
              return value + "%"
            }
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
                if (context.dataset.yAxisID === 'y1') {
                  label += '%';
                }
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
/* Optional: Ensure Bootstrap icons if not globally imported */
/* @import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.1/font/bootstrap-icons.css"); */

.page-title {
  color: #0d6efd;
}

.chart-container {
  position: relative;
  margin: auto;
  height: 400px;
}

/* Light gray color for placeholder text */
.form-select.placeholder-selected {
  color: #6c757d;
}

.form-select:not(.placeholder-selected) {
  color: #212529;
}
</style>