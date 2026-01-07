<template>
  <MainLayout>
    <div class="container-fluid p-4">
      <h1 class="mb-4">Analytical Report</h1>

      <!-- ================== กราฟแสดงจำนวนครั้งที่เสียรายเดือน (แสดงทันทีเมื่อเข้าหน้า) ================== -->
      <div class="row g-4">
        <div class="col-12">
          <div class="card shadow-sm">
            <div class="card-header bg-white py-3">
              <div class="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <h5 class="card-title m-0 text-primary">
                  <i class="bi bi-bar-chart-fill me-2"></i>กราฟแสดงจำนวนครั้งที่เครื่องขัดข้อง (Failure Rate)
                  ชนิดการตรวจแบบ Daily Check ประจำปี {{ selectedMonthlyYear }}
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

        <!-- ================== RFR Summary Cards ================== -->
        <div class="col-12 mt-3">
          <div class="row g-3">
            <!-- Card 1: ภาพรวม RFR ทั้งปี -->
            <div class="col-md-4">
              <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #0d6efd !important;">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                      <i class="bi bi-graph-up-arrow text-primary fs-4"></i>
                    </div>
                    <div>
                      <h6 class="text-muted mb-0" style="font-size: 0.85rem;">ภาพรวม RFR ทั้งปี</h6>
                      <small class="text-muted" style="font-size: 0.75rem;">อัตราการเสียซ้ำรวมปี {{ selectedMonthlyYear
                      }}</small>
                    </div>
                  </div>
                  <div class="text-center py-3">
                    <h2 class="display-4 fw-bold text-primary mb-1">{{ averageYearlyRFR }}</h2>
                    <p class="text-muted mb-0">%</p>
                  </div>
                  <div class="border-top pt-3 mt-3">
                    <div class="d-flex justify-content-between align-items-center">
                      <span class="text-muted" style="font-size: 0.85rem;">
                        <i class="bi bi-info-circle me-1"></i>เฉลี่ยต่อเดือน
                      </span>
                      <span class="fw-bold text-dark">{{ averageYearlyRFR }}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 2: หมวดหมู่ที่ต้องโฟกัส (RFR สูงสุด) -->
            <div class="col-md-4">
              <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #dc3545 !important;">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-danger bg-opacity-10 p-3 me-3">
                      <i class="bi bi-exclamation-triangle-fill text-danger fs-4"></i>
                    </div>
                    <div>
                      <h6 class="text-muted mb-0" style="font-size: 0.85rem;">หมวดหมู่ที่ต้องโฟกัส</h6>
                      <small class="text-muted" style="font-size: 0.75rem;">พบปัญหาซ้ำบ่อยที่สุด</small>
                    </div>
                  </div>
                  <div class="text-center py-3">
                    <h5 class="fw-bold text-dark mb-2">{{ highestRFRCategory.name }}</h5>
                    <div class="d-flex justify-content-center align-items-baseline">
                      <h3 class="display-6 fw-bold text-danger mb-0">{{ highestRFRCategory.rfr }}</h3>
                      <span class="text-muted ms-2">%</span>
                    </div>
                  </div>
                  <div class="border-top pt-3 mt-3">
                    <small class="text-muted d-block text-center" style="font-size: 0.8rem;">
                      <i class="bi bi-info-circle me-1"></i>ควรตรวจสอบและแก้ไขปัญหาเชิงลึก
                    </small>
                  </div>
                </div>
              </div>
            </div>

            <!-- Card 3: ประสิทธิภาพการซ่อม -->
            <div class="col-md-4">
              <div class="card border-0 shadow-sm h-100" style="border-left: 4px solid #ffc107 !important;">
                <div class="card-body">
                  <div class="d-flex align-items-center mb-3">
                    <div class="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                      <i class="bi bi-calendar-event text-warning fs-4"></i>
                    </div>
                    <div>
                      <h6 class="text-muted mb-0" style="font-size: 0.85rem;">ประสิทธิภาพการซ่อม</h6>
                      <small class="text-muted" style="font-size: 0.75rem;">เดือนที่มี RFR สูงสุด</small>
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
                      <i class="bi bi-lightbulb me-1"></i>ตรวจสอบคุณภาพการซ่อมในช่วงนี้
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ================== กราฟ RFR และสรุปสถานะเครื่อง (ย้ายมาด้านล่าง) ================== -->
      <div class="row g-3 align-items-end mt-4 mb-3">
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
const showGraph = ref(false); // RFR chart visibility

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
        const year = parseInt(yearMatch[1])
        // กรองเฉพาะปี พ.ศ. 2568 และ 2569 เท่านั้น
        if (year === 2568 || year === 2569) {
          years.add(year)
        }
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

  // หมวดหมู่การตรวจ
  const inspectionCategories = [
    'สายไฟ',
    'ระบบล็อกและเบรก',
    'เตียง หลอดเอกซเรย์ และบักกี้',
    'X-ray tube warm-up'
  ]

  // สร้างโครงสร้างข้อมูลสำหรับแต่ละชนิดเครื่อง (Bar charts)
  const barDatasets = equipmentTypes.map((equipment, index) => {
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
      stack: 'stack' + index,  // แยก stack ให้แต่ละเครื่องไม่ซ้อนกัน
      yAxisID: 'y'
    }
  })

  // คำนวณ RFR สำหรับแต่ละหมวดหมู่ในแต่ละเดือน
  const rfrDatasets = inspectionCategories.map((category, categoryIndex) => {
    const rfrData = new Array(12).fill(0)

    // สำหรับแต่ละเดือน
    for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
      let categoryCount = 0
      let totalCount = 0

      // นับจำนวนครั้งที่เสียในหมวดหมู่นี้และทั้งหมดในเดือนนี้
      repairItems.value.forEach(item => {
        if (item.requestDate && item.detail) {
          const match = item.requestDate.match(/(\d+)\s+([^\s]+)\s+(\d{4})/)
          if (match) {
            const monthStr = match[2]
            const year = parseInt(match[3])
            const itemMonthIndex = thaiMonthToNumber(monthStr)

            if (year === selectedMonthlyYear.value && itemMonthIndex === monthIndex) {
              totalCount++
              if (item.detail === category) {
                categoryCount++
              }
            }
          }
        }
      })

      // คำนวณ RFR %
      rfrData[monthIndex] = totalCount > 0 ? parseFloat(((categoryCount / totalCount) * 100).toFixed(1)) : 0
    }

    // กำหนดสีและ point style ตามหมวดหมู่
    const rfrColors = ['#dc3545', '#ffc107', '#6f42c1', '#198754']
    const pointStyles = ['circle', 'triangle', 'rect', 'rectRot']
    const rfrLabels = [
      'RFR : สายไฟ',
      'RFR : ระบบล็อกและเบรก',
      'RFR : การเคลื่อนที่ (เตียง/หลอด/บักกี้)',
      'RFR : Tube Warm-up'
    ]

    return {
      label: rfrLabels[categoryIndex],
      data: rfrData,
      type: 'line',
      borderColor: rfrColors[categoryIndex],
      backgroundColor: rfrColors[categoryIndex],
      borderWidth: 2,
      pointStyle: pointStyles[categoryIndex],
      pointRadius: 5,
      tension: 0.3,
      yAxisID: 'y1',
      order: categoryIndex + 1
    }
  })

  return {
    labels: monthNames,
    datasets: [...barDatasets, ...rfrDatasets]
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

// หมวดหมู่ที่มี RFR สูงสุด
const highestRFRCategory = computed(() => {
  const categories = [
    { name: 'สายไฟ', displayName: 'สายไฟ' },
    { name: 'ระบบล็อกและเบรก', displayName: 'ระบบล็อกและเบรก' },
    { name: 'เตียง หลอดเอกซเรย์ และบักกี้', displayName: 'การเคลื่อนที่' },
    { name: 'X-ray tube warm-up', displayName: 'Tube Warm-up' }
  ]

  let maxRFR = 0
  let topCategory = categories[0]

  categories.forEach(category => {
    let categoryCount = 0
    let totalCount = 0

    repairItems.value.forEach(item => {
      if (item.requestDate && item.detail) {
        const yearMatch = item.requestDate.match(/(\d{4})/)
        const year = yearMatch ? parseInt(yearMatch[1]) : 0

        if (year === selectedMonthlyYear.value) {
          totalCount++
          if (item.detail === category.name) {
            categoryCount++
          }
        }
      }
    })

    const rfr = totalCount > 0 ? (categoryCount / totalCount) * 100 : 0
    if (rfr > maxRFR) {
      maxRFR = rfr
      topCategory = category
    }
  })

  return {
    name: topCategory.displayName,
    rfr: maxRFR.toFixed(1)
  }
})

// ค่าเฉลี่ย RFR ของปี
const averageYearlyRFR = computed(() => {
  const categories = [
    'สายไฟ',
    'ระบบล็อกและเบรก',
    'เตียง หลอดเอกซเรย์ และบักกี้',
    'X-ray tube warm-up'
  ]

  let totalRFR = 0
  let validMonths = 0

  // คำนวณ RFR เฉลี่ยของแต่ละเดือน
  for (let monthIndex = 0; monthIndex < 12; monthIndex++) {
    let monthTotal = 0

    repairItems.value.forEach(item => {
      if (item.requestDate && item.detail) {
        const match = item.requestDate.match(/(\d+)\s+([^\s]+)\s+(\d{4})/)
        if (match) {
          const monthStr = match[2]
          const year = parseInt(match[3])
          const itemMonthIndex = thaiMonthToNumber(monthStr)

          if (year === selectedMonthlyYear.value && itemMonthIndex === monthIndex) {
            monthTotal++
          }
        }
      }
    })

    if (monthTotal > 0) {
      // คำนวณ RFR เฉลี่ยของเดือนนี้
      let monthRFRSum = 0
      categories.forEach(category => {
        let categoryCount = 0

        repairItems.value.forEach(item => {
          if (item.requestDate && item.detail) {
            const match = item.requestDate.match(/(\d+)\s+([^\s]+)\s+(\d{4})/)
            if (match) {
              const monthStr = match[2]
              const year = parseInt(match[3])
              const itemMonthIndex = thaiMonthToNumber(monthStr)

              if (year === selectedMonthlyYear.value && itemMonthIndex === monthIndex && item.detail === category) {
                categoryCount++
              }
            }
          }
        })

        monthRFRSum += (categoryCount / monthTotal) * 100
      })

      totalRFR += monthRFRSum / categories.length
      validMonths++
    }
  }

  return validMonths > 0 ? (totalRFR / validMonths).toFixed(1) : '0.0'
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
          position: 'bottom',
          labels: {
            usePointStyle: true,
            padding: 15,
            font: {
              family: 'Sarabun, sans-serif',
              size: 11
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
              let label = context.dataset.label || ''
              if (label) label += ': '
              if (context.parsed.y !== null) {
                label += context.parsed.y
                // ถ้าเป็น line dataset (RFR) ให้แสดง %
                if (context.dataset.type === 'line') {
                  label += '%'
                } else {
                  label += ' ครั้ง'
                }
              }
              return label
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
          type: 'linear',
          display: true,
          position: 'left',
          stacked: false,
          beginAtZero: true,
          title: {
            display: true,
            text: 'จำนวนครั้งที่เสีย (Count)',
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
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          min: 0,
          max: 100,
          title: {
            display: true,
            text: 'อัตราการเสียซ้ำ (RFR %)',
            font: {
              family: 'Sarabun, sans-serif',
              size: 14
            }
          },
          grid: {
            drawOnChartArea: false
          },
          ticks: {
            callback: function (value) {
              return value + '%'
            },
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
  createMonthlyChart()
})

// โหลดข้อมูลเมื่อ component mount
onMounted(() => {
  loadRepairItems()

  // สร้างกราฟรายเดือนทันทีเมื่อโหลดหน้า
  nextTick(() => {
    createMonthlyChart()
  })

  // Listen for storage changes
  window.addEventListener('storage', (event) => {
    if (event.key === STORAGE_KEY) {
      loadRepairItems()
      if (monthlyChartCanvas.value) {
        createMonthlyChart()
      }
    }
  })

  window.addEventListener('storage-local-update', () => {
    loadRepairItems()
    if (monthlyChartCanvas.value) {
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