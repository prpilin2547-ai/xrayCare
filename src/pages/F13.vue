```vue
<template>
  <!-- ใช้ MainLayout ครอบหน้าเหมือนตัวอย่างเดิม -->
  <MainLayout>
    <div class="checklist-page">
      <!-- หัวข้อหน้า -->
      <h1 class="page-title">
        แบบบันทึก F13 : แบบบันทึกการตรวจสอบคุณภาพเครื่องอัลตราซาวด์ : B-mode QC Test
      </h1>

      <!-- แคปซูลด้านบน -->
      <div class="pill-row">
        <div class="pill">วันที่ : {{ todayText }}</div>
        <div class="pill">ผู้บันทึก : {{ currentUserName }}</div>
      </div>

      <!-- กล่องเนื้อหาหลัก -->
      <div class="content-panel">
        <!-- =============== ส่วนที่ 1 : ข้อมูลเครื่องและการตั้งค่า =============== -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center">
                 ข้อมูลเครื่องและการตั้งค่า
                </td>
              </tr>

              <tr>
                <td class="cell-label">
                  วันที่ทดสอบ <span class="required">*</span>
                </td>
                <td>
                  <input
                    type="date"
                    class="input-text"
                    v-model="deviceForm.testDate"
                  />
                </td>
                <td class="cell-label">
                  ผู้ตรวจสอบ <span class="required">*</span>
                </td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.tester"
                    placeholder="กรอกชื่อผู้ตรวจสอบ"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">
                  ชื่อเครื่องอัลตราซาวด์ <span class="required">*</span>
                </td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.machineName"
                    placeholder="เช่น US-1 ห้อง ER"
                  />
                </td>
                <td class="cell-label">รุ่น</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.model"
                    placeholder="เช่น LOGIQ P9"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">เลขเครื่อง / Asset ID</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.assetId"
                    placeholder="ถ้ามี"
                  />
                </td>
                <td class="cell-label">แผนก / กลุ่มงาน</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.department"
                    placeholder="เช่น รังสีวิทยา"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">อายุเครื่อง (ปี)</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    class="input-text"
                    v-model.number="deviceForm.ageYear"
                  />
                </td>
                <td class="cell-label">Probe</td>
                <td>
                  <select class="input-text" v-model="deviceForm.probeType">
                    <option value="">-- เลือกชนิด Probe --</option>
                    <option value="Convex">Convex</option>
                    <option value="Linear">Linear</option>
                    <option value="Endocavitary">Endocavitary</option>
                    <option value="อื่น ๆ">อื่น ๆ</option>
                  </select>
                  <input
                    v-if="deviceForm.probeType === 'อื่น ๆ'"
                    type="text"
                    class="input-text mt-8"
                    v-model="deviceForm.probeOther"
                    placeholder="ระบุชนิด Probe"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">Phantom</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.phantom"
                    placeholder="ยี่ห้อ/รุ่น Phantom"
                  />
                </td>
                <td class="cell-label">ความถี่ที่ใช้ (MHz)</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    step="0.1"
                    class="input-text"
                    v-model.number="deviceForm.frequencyMHz"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">Power</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.power"
                  />
                </td>
                <td class="cell-label">TGC</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.tgc"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">Gain</td>
                <td>
                  <input
                    type="text"
                    class="input-text"
                    v-model="deviceForm.gain"
                  />
                </td>
                <td></td>
                <td></td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- =============== ส่วนที่ 2 : ผลการทดสอบ B-mode QC (ตารางแบบรวม) =============== -->
        <div class="table-wrapper mb-16">
          <table class="check-table main-test-table">
            <thead>
              <tr class="header-row">
                <th class="test-header">Test Date</th>
                <th class="baseline-header">baseline</th>
<th></th>
                <th></th>
                <th></th>
                <th class="action-header">Action level</th>
                <th class="defect-header">Defect level</th>
              </tr>
            </thead>
            <tbody>
              <!-- Image Uniformity Section -->
              <tr class="category-row">
                <td colspan="7" class="category-title">Image Uniformity</td>
              </tr>
              
              <tr>
                <td class="test-label">Vertical band (y/n)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td rowspan="3" class="action-cell">
                  ≥ 4 dB or any change<br/>from baseline
                </td>
                <td rowspan="3" class="defect-cell">
                  ≥ 6 dB or any change<br/>from baseline
                </td>
              </tr>
              
              <tr>
                <td class="test-label">Horizontal band (y/n)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.horizontalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">Artifacts (y/n)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.artifactsBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
              </tr>
              
              <!-- Depth of Penetration Section -->
              <tr class="category-row">
                <td class="category-title">Depth of Penetration (cm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td class="action-cell">± 6 mm</td>
                <td class="defect-cell">± 10 mm</td>
              </tr>
              
              <!-- <tr>
                <td class="test-label"></td>
                <td>
                  <input type="text" class="input-text" v-model="testData.depthPenetration.baseline" placeholder="" />
                </td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
               -->
              <!-- Vertical Distance Accuracy Section -->
              <tr class="category-row">
                <td class="category-title">Vertical Distance Accuracy</td>
                <td colspan="2">Actual distance <input type="text" class="input-inline" v-model="testData.verticalDistance.actualDistance" placeholder="" style="width: 60px;" /> mm</td>
                <td></td>
                <td></td>
                <td class="action-header">± 1.5 mm or 1.5%</td>
                <td class="defect-header">± 2.0 mm or 2%</td>
              </tr>
              
              <tr>
                <td class="test-label">(Pin 1-3) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin13Baseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td rowspan="3" class="action-cell">± 1.5 mm or 1.5%</td>
                <td rowspan="3" class="defect-cell">± 2.0 mm or 2%</td>
              </tr>
              
              <tr>
                <td class="test-label">(Pin 3-5) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin35Baseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">(Pin 6-8) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin68Baseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
              </tr>
              
              <!-- Horizontal Distance Accuracy Section -->
              <tr class="category-row">
                <td class="category-title">Horizontal Distance Accuracy</td>
                <td colspan="2">Actual distance <input type="text" class="input-inline" v-model="testData.horizontalDistance.actualDistance" placeholder="" style="width: 60px;" /> mm</td>
                <td></td>
                <td></td>
                <td class="action-header">± 2.0 mm or 2%</td>
                <td class="defect-header">± 3.0 mm or 3%</td>
              </tr>
              
              <tr>
                <td class="test-label">(Near) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.horizontalDistance.nearBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td rowspan="2" class="action-cell">± 2.0 mm or 2%</td>
                <td rowspan="2" class="defect-cell">± 3.0 mm or 3%</td>
              </tr>
              
              <tr>
                <td class="test-label">(Far) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.horizontalDistance.farBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
              </tr>
              
              <!-- Lateral Resolution Section -->
              <tr class="category-row">
                <td class="category-title">Lateral Resolution</td>
                <td colspan="3">
                  Pin depth: Near=<input type="text" class="input-inline" v-model="testData.lateralResolution.pinDepthNear" placeholder="" style="width: 50px;" /> mm, 
                  Mid=<input type="text" class="input-inline" v-model="testData.lateralResolution.pinDepthMid" placeholder="" style="width: 50px;" /> mm, 
                  Far=<input type="text" class="input-inline" v-model="testData.lateralResolution.pinDepthFar" placeholder="" style="width: 50px;" /> mm
                </td>
                <td></td>
                <td colspan="2"></td>
              </tr>
              
              <tr>
                <td class="test-label">(Near) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.lateralResolution.nearBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td rowspan="3" colspan="2" class="criteria-cell">
                  width &lt;1.5 mm, freq ≥ 5 MHz<br/>
                  width &lt;3 mm, 3.5 ≤ freq≤ 5 MHz<br/>
                  width &lt;4 mm, freq &lt; 3.5 MHz
                </td>
              </tr>
              
              <tr>
                <td class="test-label">(Mid) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.lateralResolution.midBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">(Far) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.lateralResolution.farBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
              </tr>
              
              <!-- Axial Resolution Section -->
              <tr class="category-row">
                <td colspan="7" class="category-title">Axial Resolution</td>
              </tr>
              
              <tr>
                <td class="test-label">(Near) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.axialResolution.nearBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td rowspan="3" colspan="2" class="criteria-cell">
                  Action level: 1 mm<br/>
                  or 2 mm if freq &lt; 4 MHz<br/>
                  Defect level >1 mm
                </td>
              </tr>
              
              <tr>
                <td class="test-label">(Mid) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.axialResolution.midBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">(Far) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.axialResolution.farBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
              </tr>
              
              <!-- Image Geometry (Cyst Imaging) Section -->
              <tr class="category-row">
                <td class="category-title">Image Geometry (Cyst Imaging)</td>
                <td colspan="2">Actual diameter <input type="text" class="input-inline" v-model="testData.imageGeometry.actualDiameter" placeholder="" style="width: 60px;" /> mm</td>
                <td></td>
                <td></td>
                <td colspan="2"></td>
              </tr>
              
              <tr>
                <td class="test-label">(Near) Cyst: Height / Width</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.nearCystBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td rowspan="3" colspan="2" class="criteria-cell">
                  Major distortion or any change from baseline<br/>
                  Height/Width ≥20%
                </td>
              </tr>
              
              <tr>
                <td class="test-label">Image quality (normal/noise)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.imageQualityBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">(Mid) Cyst: Height / Width</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.midCystBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">Image quality (normal/noise)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.midImageQuality" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td></td>
                <td></td>
              </tr>
              
              <tr>
                <td class="test-label">(Far) Cyst: Height / Width</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.farCystBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td></td>
                <td></td>
              </tr>
              
              <tr>
                <td class="test-label">Image quality (normal/noise)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.farImageQuality" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td></td>
                <td></td>
              </tr>
              
              <!-- No. of Gray Scale Objects -->
              <tr class="category-row">
                <td colspan="7" class="category-title">No. of Gray Scale Objects</td>
              </tr>
              
              <tr>
                <td class="test-label">Dead zone (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.grayScale.deadZone" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td rowspan="1" class="image-cell">
                  <input type="text" class="input-text" v-model="testData.imageUniformity.verticalBaseline" placeholder="" />
                </td>
                <td colspan="2" class="criteria-cell">
                  7 mm, freq 3 MHz<br/>
                  5 mm, 3 MHz&lt;freq&lt;7 MHz<br/>
                  3 mm, freq 7 MHz
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- =============== ส่วนที่ 3 : สรุปผล =============== -->
        <div class="table-wrapper mb-16">
          <table class="check-table">
            <tbody>
              <tr class="row-header-main">
                <td colspan="4" class="text-center"> สรุปผล</td>
              </tr>

              <tr>
                <td class="cell-label">ผลสรุปการทดสอบ</td>
                <td>
                  <select class="input-text" v-model="summary.result">
                    <option value="">-- เลือกผลสรุป --</option>
                    <option value="ผ่าน">ผ่าน</option>
                    <option value="เฝ้าระวัง">เฝ้าระวัง</option>
                    <option value="ไม่ผ่าน">ไม่ผ่าน</option>
                  </select>
                </td>
                <td class="cell-label">เวลาเริ่มทดสอบ</td>
                <td>
                  <input
                    type="time"
                    class="input-text"
                    v-model="summary.startTime"
                  />
                </td>
              </tr>

              <tr>
                <td class="cell-label">ข้อเสนอแนะ</td>
                <td>
                  <textarea
                    class="input-textarea"
                    v-model="summary.recommendation"
                  ></textarea>
                </td>
                <td class="cell-label">เวลาสิ้นสุดทดสอบ</td>
                <td>
                  <input
                    type="time"
                    class="input-text"
                    v-model="summary.endTime"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- ปุ่มด้านล่าง -->
        <div class="actions">
          <button type="button" class="btn-remark" @click="resetForm">
            ล้างแบบฟอร์ม
          </button>
          <button type="button" class="btn-save" @click="saveForm">
            บันทึกข้อมูล
          </button>
        </div>
      </div>
    </div>
  </MainLayout>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

const props = defineProps({
  currentUserName: {
    type: String,
    default: 'Demo User'
  }
})

const router = useRouter()

const todayText = computed(() => {
  const d = new Date()
  return d.toLocaleDateString('th-TH', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
})

/* ---------- ส่วนที่ 1 : ข้อมูลเครื่อง ---------- */
const deviceForm = ref({
  testDate: '',
  machineName: '',
  model: '',
  assetId: '',
  department: '',
  ageYear: null,
  probeType: '',
  probeOther: '',
  phantom: '',
  frequencyMHz: null,
  power: '',
  tgc: '',
  gain: '',
  tester: ''
})

/* ---------- ส่วนที่ 2 : ผลการทดสอบแบบรวม (ตามตารางในรูป) ---------- */
const testData = ref({
  testDates: {
    date1: '',
    date2: '',
    date3: ''
  },
  imageUniformity: {
    verticalBaseline: '',
    horizontalBaseline: '',
    artifactsBaseline: ''
  },
  depthPenetration: {
    baseline: ''
  },
  verticalDistance: {
    actualDistance: '',
    pin13Baseline: '',
    pin35Baseline: '',
    pin68Baseline: ''
  },
  horizontalDistance: {
    actualDistance: '',
    nearBaseline: '',
    farBaseline: ''
  },
  lateralResolution: {
    pinDepthNear: '',
    pinDepthMid: '',
    pinDepthFar: '',
    nearBaseline: '',
    midBaseline: '',
    farBaseline: ''
  },
  axialResolution: {
    nearBaseline: '',
    midBaseline: '',
    farBaseline: ''
  },
  imageGeometry: {
    actualDiameter: '',
    nearCystBaseline: '',
    imageQualityBaseline: '',
    midCystBaseline: '',
    midImageQuality: '',
    farCystBaseline: '',
    farImageQuality: ''
  },
  grayScale: {
    deadZone: ''
  }
})

/* ---------- ส่วนที่ 3 : สรุปผล ---------- */
const summary = ref({
  result: '',
  recommendation: '',
  startTime: '',
  endTime: ''
})

/* ---------- ฟังก์ชันช่วย ---------- */
const resetForm = () => {
  deviceForm.value = {
    testDate: '',
    machineName: '',
    model: '',
    assetId: '',
    department: '',
    ageYear: null,
    probeType: '',
    probeOther: '',
    phantom: '',
    frequencyMHz: null,
    power: '',
    tgc: '',
    gain: '',
    tester: ''
  }

  testData.value = {
    testDates: {
      date1: '',
      date2: '',
      date3: ''
    },
    imageUniformity: {
      verticalBaseline: '',
      horizontalBaseline: '',
      artifactsBaseline: ''
    },
    depthPenetration: {
      baseline: ''
    },
    verticalDistance: {
      pin13Baseline: '',
      pin35Baseline: '',
      pin68Baseline: ''
    },
    horizontalDistance: {
      nearBaseline: '',
      farBaseline: ''
    },
    lateralResolution: {
      nearBaseline: '',
      midBaseline: '',
      farBaseline: ''
    },
    axialResolution: {
      nearBaseline: '',
      midBaseline: '',
      farBaseline: ''
    },
    imageGeometry: {
      nearCystBaseline: '',
      imageQualityBaseline: '',
      midCystBaseline: '',
      midImageQuality: '',
      farCystBaseline: '',
      farImageQuality: ''
    },
    grayScale: {
      deadZone: ''
    }
  }

  summary.value = {
    result: '',
    recommendation: '',
    startTime: '',
    endTime: ''
  }
}

/* ตรวจ field จำเป็นแบบง่าย ๆ */
const validateForm = () => {
  const errors = []

  if (!deviceForm.value.testDate) errors.push('กรุณากรอกวันที่ทดสอบ')
  if (!deviceForm.value.machineName)
    errors.push('กรุณากรอกชื่อเครื่องอัลตราซาวด์')
  if (!deviceForm.value.tester) errors.push('กรุณากรอกชื่อผู้ตรวจสอบ')

  if (errors.length) {
    alert(errors.join('\n'))
    return false
  }
  return true
}

/* บันทึกแล้วไปหน้า Dashboard */
const saveForm = () => {
  if (!validateForm()) return

  const payload = {
    deviceForm: deviceForm.value,
    testData: testData.value,
    summary: summary.value
  }

  console.log('F13 payload :', payload)

  router.push('/dashboard')
}
</script>

<style scoped>
/* พื้นที่ทำงานหลักของหน้า (content ใน MainLayout) */
.checklist-page {
  background: #ffffff;
  min-height: calc(100vh - 56px);
  padding: 24px 32px 32px;
}

/* หัวข้อหลัก */
.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: #000000;
  letter-spacing: 0.12em;
  margin-bottom: 16px;
}

/* แถวแคปซูลด้านบน */
.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 24px;
}

.pill {
  background: #ffb480;
  color: #111827;
  padding: 8px 18px;
  border-radius: 999px;
  font-size: 0.9rem;
  font-weight: 500;
  white-space: nowrap;
}

/* กล่องเนื้อหากลาง */
.content-panel {
  background: #ffffff;
  padding: 20px 24px 28px;
  box-shadow: 0 0 0 1px #e5e5e5;
}

/* ตาราง */
.table-wrapper {
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
  border: 1px solid #d4d4d4;
}

.check-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.check-table td {
  padding: 10px 12px;
  vertical-align: top;
  border-bottom: 1px solid #e5e7eb;
}

/* แถวหัวข้อใหญ่สีน้ำเงิน */
.row-header-main td {
  font-weight: 700;
  background: #55b4ff;
  color: #ffffff;
}

/* หัวคอลัมน์ */
.row-header-columns td {
  font-weight: 600;
  background: #f3f4f6;
}

/* สีพื้นสลับแถว */
.check-table tr:nth-child(odd):not(.row-header-main):not(.row-header-columns) {
  background: #f9fafb;
}
.check-table tr:nth-child(even):not(.row-header-main):not(.row-header-columns) {
  background: #e5e7eb;
}

.cell-label {
  width: 25%;
}

.text-center {
  text-align: center;
}

/* Input พื้นฐาน */
.input-text {
  width: 100%;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 6px 8px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.input-textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  border-radius: 6px;
  border: 1px solid #d1d5db;
  padding: 6px 8px;
  font-size: 0.9rem;
  box-sizing: border-box;
}

.required {
  color: #dc2626;
  margin-left: 2px;
}

.mb-16 {
  margin-bottom: 16px;
}

/* สไตล์เฉพาะสำหรับตารางหลักแบบรวม */
.main-test-table {
  font-size: 0.85rem;
}

.main-test-table thead {
  background: #ffffff;
  border-bottom: 2px solid #000;
}

.header-row th {
  padding: 8px 10px;
  border: 1px solid #000;
  font-weight: 600;
  text-align: center;
  background: #ffffff;
  color: #000;
}

/* กำหนดความกว้างคอลัมน์ 2-5 ให้เท่ากัน */
.header-row th:nth-child(2),
.header-row th:nth-child(3),
.header-row th:nth-child(4),
.header-row th:nth-child(5) {
  width: 15%;
}

.main-test-table tbody td:nth-child(2),
.main-test-table tbody td:nth-child(3),
.main-test-table tbody td:nth-child(4),
.main-test-table tbody td:nth-child(5) {
  width: 15%;
}

.test-header {
  background: #ffffff !important;
}

.baseline-header {
  background: #ffffff !important;
}

.action-header,
.defect-header {
  background: #ffffff !important;
  font-weight: 700;
}

.main-test-table tbody tr {
  background: #ffffff;
}

.category-row {
  background: #f3f4f6 !important;
  font-weight: 700;
}

.category-title {
  padding: 8px 10px !important;
  border: 1px solid #000;
  font-weight: 700;
  background: #f3f4f6 !important;
}

.main-test-table tbody td {
  padding: 6px 8px;
  border: 1px solid #000;
  vertical-align: middle;
}

.test-label {
  font-weight: 500;
  background: #ffffff;
}

.action-cell,
.defect-cell {
  text-align: center;
  font-size: 0.80rem;
  line-height: 1.4;
  background: #ffffff;
  font-weight: 500;
}

.action-cell {
  border-left: 2px solid #000;
}

.defect-cell {
  border-left: 2px solid #000;
}

.image-cell {
  text-align: center;
  padding: 4px !important;
  background: #fafafa;
  min-width: 100px;
}

.placeholder-image {
  border: 1px dashed #ccc;
  background: #f9f9f9;
  min-height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.criteria-cell {
  font-size: 0.78rem;
  line-height: 1.5;
  padding: 6px 8px !important;
  background: #ffffff;
}

/* จัดข้อความตรงกลางสำหรับ criteria cells ที่ผสานคอลัมน์ */
.criteria-cell[colspan="2"] {
  text-align: center;
}

/* ปรับ input ในตารางให้เล็กลง */
.main-test-table .input-text {
  font-size: 0.82rem;
  padding: 4px 6px;
  min-height: auto;
}

.mt-8 {
  margin-top: 8px;
}

/* ปุ่มด้านล่าง */
.actions {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-remark,
.btn-save {
  border: none;
  border-radius: 4px;
  padding: 8px 24px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-remark {
  background: #ff6b81;
  color: #ffffff;
}

.btn-remark:hover {
  background: #e0556a;
}

.btn-save {
  background: #65d46e;
  color: #ffffff;
}

.btn-save:hover {
  background: #4fb759;
}

/* responsive เล็กน้อย */
@media (max-width: 768px) {
  .checklist-page {
    padding: 16px;
  }
  .pill-row {
    gap: 8px;
  }
  .pill {
    font-size: 0.8rem;
  }
}
</style>
```
