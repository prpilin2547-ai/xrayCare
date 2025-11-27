<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-title">Analytical Dashboard</h2>

      <!-- 1) BAR CHART -->
      <div class="panel">
        <div class="panel-header">
          <h3>1. Bar Chart – เปรียบเทียบ Failure / QC / RFR รายเดือน</h3>
        </div>
        <div class="panel-body">
          <div class="panel-chart bar-chart">
            <div class="bars">
              <div
                v-for="(m, index) in monthlyData"
                :key="m.label"
                class="bar-group"
              >
                <!-- Failure Rate (ครั้ง/เดือน) -->
                <div
                  class="bar bar-failure"
                  :style="{ height: failureHeights[index] + '%' }"
                  :title="`Failure: ${failureRate[index]} ครั้ง`"
                ></div>

                <!-- QC Pass Rate (%) -->
                <div
                  class="bar bar-qc"
                  :style="{ height: qcHeights[index] + '%' }"
                  :title="`QC Pass: ${qcPassRate[index]}%`"
                ></div>

                <!-- Recurrent Failure Rate (%) -->
                <div
                  class="bar bar-rfr"
                  :style="{ height: rfrHeights[index] + '%' }"
                  :title="`RFR: ${rfrRate[index]}%`"
                ></div>

                <div class="bar-label">{{ m.label }}</div>
              </div>
            </div>

            <!-- Legend -->
            <div class="legend">
              <div class="legend-item">
                <span class="legend-dot failure"></span>
                <span>Failure Rate (ครั้ง/เดือน)</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot qc"></span>
                <span>QC Pass Rate (%)</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot rfr"></span>
                <span>Recurrent Failure Rate (RFR, %)</span>
              </div>
            </div>
          </div>

          <!-- explanation -->
          <div class="panel-explain">
            <p class="explain-title">สถิติที่ใช้ในกราฟนี้</p>
            <ul class="explain-list">
              <li>
                <strong>Failure Rate (ครั้ง/เดือน)</strong>
                = จำนวนครั้งที่เครื่องเอกซเรย์ <u>ขัดข้องหรือมีการแจ้งซ่อม</u> ในแต่ละเดือน
              </li>
              <li>
                <strong>QC Pass Rate (%)</strong>
                = (จำนวนครั้งที่ผลการทดสอบ QC <u>ผ่านเกณฑ์กรมวิทย์</u> ÷
                จำนวนการทดสอบ QC ทั้งหมดในเดือนนั้น) × 100
              </li>
              <li>
                <strong>Recurrent Failure Rate (RFR, %)</strong>
                = (จำนวนการเสียที่จัดเป็น <u>การเสียซ้ำ</u> ภายในช่วงเวลาสั้น (เช่น 3 เดือน)
                ÷ จำนวนการเสียทั้งหมดในช่วงเดียวกัน) × 100
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- 2) LINE CHART -->
      <div class="panel">
        <div class="panel-header">
          <h3>2. Line Chart – แนวโน้ม Failure / QC / RFR ตามช่วงเวลา</h3>
        </div>
        <div class="panel-body">
          <div class="panel-chart line-chart">
            <div class="line-chart-wrapper">
              <svg viewBox="0 0 100 40" class="line-svg">
                <!-- Failure line -->
                <polyline
                  :points="failureLinePoints"
                  class="line failure-line"
                />
                <!-- QC line -->
                <polyline
                  :points="qcLinePoints"
                  class="line qc-line"
                />
                <!-- RFR line -->
                <polyline
                  :points="rfrLinePoints"
                  class="line rfr-line"
                />
              </svg>
              <div class="line-x-labels">
                <span v-for="m in monthlyData" :key="m.label">
                  {{ m.label }}
                </span>
              </div>
            </div>

            <!-- Legend -->
            <div class="legend">
              <div class="legend-item">
                <span class="legend-dot failure"></span>
                <span>Failure Rate</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot qc"></span>
                <span>QC Pass Rate</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot rfr"></span>
                <span>RFR</span>
              </div>
            </div>
          </div>

          <!-- explanation -->
          <div class="panel-explain">
            <p class="explain-title">การตีความจากกราฟเส้น</p>
            <ul class="explain-list">
              <li>
                ใช้ดู <strong>แนวโน้ม</strong> ว่าจำนวนการเสีย (Failure) เพิ่มขึ้นหรือลดลงในแต่ละเดือน
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
          </div>
        </div>
      </div>

      <!-- 3) PIE CHART -->
      <div class="panel">
        <div class="panel-header">
          <h3>3. Pie Chart – สัดส่วนปัญหา Failure / QC / RFR รวม</h3>
        </div>
        <div class="panel-body">
          <div class="panel-chart">
            <div class="pie-chart">
              <div class="pie-circle" :style="pieStyle"></div>
            </div>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-dot failure"></span>
                <span>จำนวนการเสียทั้งหมด (Failure) : {{ totalFailure }} ครั้ง</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot qc"></span>
                <span>จำนวนครั้ง QC ไม่ผ่านเกณฑ์ : {{ totalQcFail }} ครั้ง</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot rfr"></span>
                <span>จำนวนการเสียซ้ำ (Recurrent Failure) : {{ totalRecurrent }} ครั้ง</span>
              </div>

              <div class="legend-extra">
                <p>
                  <strong>รวมเหตุการณ์ทั้งหมด</strong>
                  = {{ totalAllEvents }} ครั้ง
                </p>
              </div>
            </div>
          </div>

          <!-- explanation -->
          <div class="panel-explain">
            <p class="explain-title">สถิติที่ใช้ใน Pie Chart</p>
            <ul class="explain-list">
              <li>
                <strong>จำนวนการเสียทั้งหมด (Failure)</strong> =
                ผลรวมจำนวนครั้งที่เครื่องขัดข้องหรือมีการแจ้งซ่อมทุกเดือน
              </li>
              <li>
                <strong>จำนวนครั้ง QC ไม่ผ่านเกณฑ์</strong> =
                ผลรวมของ (จำนวนการทดสอบ QC ทั้งหมด − จำนวนที่ผ่านเกณฑ์) ทุกเดือน
              </li>
              <li>
                <strong>จำนวนการเสียซ้ำ (Recurrent Failure)</strong> =
                ผลรวมครั้งที่เครื่องเสียซ้ำภายในช่วงเวลาสั้น (เช่น 3 เดือนหลังจากซ่อม)
              </li>
              <li>
                สัดส่วนในวงกลม = (จำนวนของแต่ละประเภท ÷ จำนวนเหตุการณ์ทั้งหมด)
                × 100 แล้วนำมาสร้างเป็นส่วนโค้งของ Pie Chart
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- SUMMARY STRIP -->
      <div class="summary-strip">
        <span class="summary-label">สรุป :</span>
        <span class="summary-text">
          ตัวอย่างการใช้ข้อมูลจริงจากแบบบันทึกเพื่อวิเคราะห์
          1) ประสิทธิภาพเครื่องเอกซเรย์ (Failure Rate) 2) คุณภาพภาพและปริมาณรังสี (QC Pass Rate)
          และ 3) ความเสถียรของเครื่องจากการเสียซ้ำ (Recurrent Failure Rate; RFR)
          โดยแสดงทั้งในรูปกราฟแท่ง กราฟเส้น และแผนภูมิวงกลม
        </span>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { computed } from 'vue';
import MainLayout from '../components/Layout/MainLayout.vue';

/**
 * ข้อมูลดิบ (สมมติจากแบบบันทึกจริง)
 * - failures     = จำนวนครั้งที่เครื่องเสีย/มีการแจ้งซ่อม ในเดือนนั้น
 * - qcTotal      = จำนวนการทดสอบ QC ทั้งหมด
 * - qcPassed     = จำนวนการทดสอบ QC ที่ผ่านเกณฑ์กรมวิทย์
 * - recurrent    = จำนวนครั้งการเสียที่นับเป็น "การเสียซ้ำ" ภายในช่วงเวลาสั้น (เช่น 3 เดือน)
 */
const monthlyData = [
  { label: 'Jan', failures: 5, qcTotal: 50, qcPassed: 46, recurrent: 1 },
  { label: 'Feb', failures: 3, qcTotal: 45, qcPassed: 40, recurrent: 1 },
  { label: 'Mar', failures: 4, qcTotal: 48, qcPassed: 44, recurrent: 2 },
  { label: 'Apr', failures: 6, qcTotal: 52, qcPassed: 47, recurrent: 2 }
];

// --- series สำหรับแสดงในกราฟ ---
const failureRate = computed(() =>
  monthlyData.map((m) => m.failures) // Failure Rate (ครั้ง/เดือน)
);

const qcPassRate = computed(() =>
  monthlyData.map((m) =>
    m.qcTotal > 0 ? Math.round((m.qcPassed / m.qcTotal) * 100) : 0
  )
);

const rfrRate = computed(() =>
  monthlyData.map((m) =>
    m.failures > 0 ? Math.round((m.recurrent / m.failures) * 100) : 0
  )
);

// ค่ามากสุด เพื่อ normalise ความสูงของ bar / จุดกราฟ
const maxValue = computed(() => {
  return Math.max(
    ...failureRate.value,
    ...qcPassRate.value,
    ...rfrRate.value
  );
});

// ปรับเป็น % สำหรับเอาไปใช้เป็นความสูง bar
const failureHeights = computed(() =>
  failureRate.value.map((v) => (maxValue.value ? (v / maxValue.value) * 100 : 0))
);
const qcHeights = computed(() =>
  qcPassRate.value.map((v) => (maxValue.value ? (v / maxValue.value) * 100 : 0))
);
const rfrHeights = computed(() =>
  rfrRate.value.map((v) => (maxValue.value ? (v / maxValue.value) * 100 : 0))
);

// -------- LINE CHART (สร้าง polyline points สำหรับ SVG) --------
const makeLinePoints = (values) => {
  const n = values.length;
  if (n === 0) return '';
  return values
    .map((v, i) => {
      const x = (i / (n - 1 || 1)) * 100;
      // y ยิ่งมาก ยิ่งอยู่ต่ำลง (ใน SVG 0 = บนสุด)
      const norm = maxValue.value ? v / maxValue.value : 0;
      const y = 40 - norm * 35 - 2; // กันไม่ให้ชนขอบบน/ล่างมากไป
      return `${x},${y}`;
    })
    .join(' ');
};

const failureLinePoints = computed(() => makeLinePoints(failureRate.value));
const qcLinePoints = computed(() => makeLinePoints(qcPassRate.value));
const rfrLinePoints = computed(() => makeLinePoints(rfrRate.value));

// -------- PIE CHART (รวมเหตุการณ์ทั้งหมด) --------
const totalFailure = computed(() =>
  monthlyData.reduce((sum, m) => sum + m.failures, 0)
);
const totalQcFail = computed(() =>
  monthlyData.reduce((sum, m) => sum + (m.qcTotal - m.qcPassed), 0)
);
const totalRecurrent = computed(() =>
  monthlyData.reduce((sum, m) => sum + m.recurrent, 0)
);

const totalAllEvents = computed(
  () => totalFailure.value + totalQcFail.value + totalRecurrent.value
);

// สร้าง style ของ conic-gradient ตามสัดส่วนจริง
const pieStyle = computed(() => {
  const total = totalAllEvents.value;
  if (!total) {
    return {
      background: '#e5e7eb'
    };
  }

  const fPerc = (totalFailure.value / total) * 100;
  const qcPerc = (totalQcFail.value / total) * 100;
  const rfrPerc = 100 - fPerc - qcPerc;

  return {
    background: `conic-gradient(
      #f97316 0 ${fPerc}%,
      #10b981 ${fPerc}% ${fPerc + qcPerc}%,
      #ec4899 ${fPerc + qcPerc}% 100%
    )`
  };
});
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-title {
  margin: 0;
}

/* PANEL BASE */
.panel {
  background: #f3f4f6;
  border-radius: 16px;
  overflow: hidden;
}

.panel-header {
  background: var(--purple-main);
  color: white;
  padding: 8px 14px;
}

.panel-header h3 {
  margin: 0;
  font-size: 0.98rem;
}

.panel-body {
  padding: 14px;
}

.panel-chart {
  display: flex;
  gap: 16px;
  align-items: center;
}

/* LEGEND */
.legend {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.88rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 999px;
}

.legend-dot.failure {
  background: #f97316;
}

.legend-dot.qc {
  background: #10b981;
}

.legend-dot.rfr {
  background: #ec4899;
}

.legend-extra {
  margin-top: 6px;
  font-size: 0.82rem;
  color: #4b5563;
}

/* 1) BAR CHART */
.bar-chart {
  align-items: flex-end;
}

.bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 18px;
  padding: 10px 0 4px;
}

.bar-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 40px;
}

.bar {
  width: 12px;
  border-radius: 6px 6px 0 0;
  transition: height 0.2s ease;
}

.bar-failure {
  background: #f97316;
}

.bar-qc {
  background: #10b981;
}

.bar-rfr {
  background: #ec4899;
}

.bar-label {
  font-size: 0.7rem;
  color: #6b7280;
}

/* 2) LINE CHART */
.line-chart {
  align-items: center;
}

.line-chart-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.line-svg {
  width: 100%;
  height: 160px;
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 4px;
}

.line {
  fill: none;
  stroke-width: 1.8;
}

.failure-line {
  stroke: #f97316;
}

.qc-line {
  stroke: #10b981;
}

.rfr-line {
  stroke: #ec4899;
}

.line-x-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  color: #6b7280;
  padding: 0 4px;
}

/* 3) PIE CHART */
.pie-chart {
  flex: 1;
  display: flex;
  justify-content: center;
}

.pie-circle {
  width: 140px;
  height: 140px;
  border-radius: 999px;
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.16);
}

/* EXPLANATION BLOCK */
.panel-explain {
  margin-top: 10px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #f9fafb;
  font-size: 0.86rem;
  color: #374151;
}

.explain-title {
  margin: 0 0 4px;
  font-weight: 600;
}

.explain-list {
  margin: 0;
  padding-left: 18px;
}

.explain-list li + li {
  margin-top: 3px;
}

/* SUMMARY STRIP */
.summary-strip {
  margin-top: 4px;
  padding: 10px 12px;
  border-radius: 12px;
  background: #fee2e2;
  display: flex;
  gap: 8px;
  font-size: 0.9rem;
}

.summary-label {
  font-weight: 600;
}

.summary-text {
  flex: 1;
}

@media (max-width: 900px) {
  .panel-chart {
    flex-direction: column;
    align-items: stretch;
  }

  .bars {
    gap: 10px;
  }
}
</style>