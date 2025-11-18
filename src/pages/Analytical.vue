<template>
  <MainLayout>
    <div class="page">
      <h2 class="page-title">Analytical2</h2>

      <div class="panel">
        <div class="panel-header">
          <h3>สรุปสถานะการแจ้งซ่อม</h3>
        </div>
        <div class="panel-body">
          <div class="panel-chart">
            <div class="pie-chart">
              <div class="pie-circle"></div>
            </div>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-dot failure"></span>
                <span>Failure Rate</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot qc"></span>
                <span>QC Pass/Fail Rate</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot rfr"></span>
                <span>Recurrent Failure Rate (RFR)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="panel">
        <div class="panel-header">
          <h3>สรุปสถานะการแจ้งซ่อม</h3>
        </div>
        <div class="panel-body">
          <div class="panel-chart bar-chart">
            <div class="bars">
              <div class="bar bar-failure"></div>
              <div class="bar bar-qc"></div>
              <div class="bar bar-rfr"></div>
            </div>
            <div class="legend">
              <div class="legend-item">
                <span class="legend-dot failure"></span>
                <span>Failure Rate</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot qc"></span>
                <span>QC Pass/Fail Rate</span>
              </div>
              <div class="legend-item">
                <span class="legend-dot rfr"></span>
                <span>Recurrent Failure Rate (RFR)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="summary-strip">
        <span class="summary-label">สรุป :</span>
        <span class="summary-text">
          แสดงตัวอย่างพื้นที่สำหรับสรุปผลวิเคราะห์ เช่น อัตราการเกิดปัญหา, แนวโน้มคุณภาพ QC และ RFR
        </span>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import MainLayout from '../components/Layout/MainLayout.vue'
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

.pie-chart {
  flex: 1;
  display: flex;
  justify-content: center;
}

.pie-circle {
  width: 140px;
  height: 140px;
  border-radius: 999px;
  background: conic-gradient(
    #f97316 0 35%,
    #10b981 35% 75%,
    #ec4899 75% 100%
  );
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.16);
}

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

/* Bar chart mock */
.bar-chart {
  align-items: flex-end;
}

.bars {
  flex: 1;
  display: flex;
  align-items: flex-end;
  gap: 14px;
  padding: 10px 0 4px;
}

.bar {
  width: 32px;
  border-radius: 8px 8px 0 0;
}

.bar-failure {
  height: 80px;
  background: #f97316;
}

.bar-qc {
  height: 120px;
  background: #10b981;
}

.bar-rfr {
  height: 60px;
  background: #ec4899;
}

.summary-strip {
  margin-top: 4px;
  padding: 10px 14px;
  border-radius: 12px;
  background: #fee2e2;
  display: flex;
  gap: 8px;
  font-size: 0.9rem;
}

.summary-label {
  font-weight: 600;
}
</style>