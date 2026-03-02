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
        <div class="pill">เวลา : {{ currentTime }}</div>
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
<th>1</th>
                <th>2</th>
                <th>3</th>
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
                  <input type="text" class="input-text" v-model="testData.imageUniformity.vertical1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.vertical2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.vertical3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.imageUniformity.horizontal1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.horizontal2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.horizontal3" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">Artifacts (y/n)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.artifactsBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.artifacts1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.artifacts2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageUniformity.artifacts3" placeholder="" />
                </td>
              </tr>
              
              <!-- Depth of Penetration Section -->
              <tr class="category-row">
                <td class="category-title">Depth of Penetration (cm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.depthPenetration.baseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.depthPenetration.col1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.depthPenetration.col2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.depthPenetration.col3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin131" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin132" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin133" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin351" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin352" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin353" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">(Pin 6-8) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin68Baseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin681" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin682" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.verticalDistance.pin683" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.horizontalDistance.near1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.horizontalDistance.near2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.horizontalDistance.near3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.horizontalDistance.far1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.horizontalDistance.far2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.horizontalDistance.far3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.lateralResolution.near1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.lateralResolution.near2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.lateralResolution.near3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.lateralResolution.mid1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.lateralResolution.mid2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.lateralResolution.mid3" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">(Far) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.lateralResolution.farBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.lateralResolution.far1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.lateralResolution.far2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.lateralResolution.far3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.axialResolution.near1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.axialResolution.near2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.axialResolution.near3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.axialResolution.mid1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.axialResolution.mid2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.axialResolution.mid3" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">(Far) Measured (mm)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.axialResolution.farBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.axialResolution.far1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.axialResolution.far2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.axialResolution.far3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.imageGeometry.nearCyst1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.nearCyst2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.nearCyst3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.imageGeometry.imageQuality1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.imageQuality2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.imageQuality3" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">(Mid) Cyst: Height / Width</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.midCystBaseline" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.midCyst1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.midCyst2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.midCyst3" placeholder="" />
                </td>
              </tr>
              
              <tr>
                <td class="test-label">Image quality (normal/noise)</td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.midImageQuality" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.midImageQuality1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.midImageQuality2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.midImageQuality3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.imageGeometry.farCyst1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.farCyst2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.farCyst3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.imageGeometry.farImageQuality1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.farImageQuality2" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.imageGeometry.farImageQuality3" placeholder="" />
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
                  <input type="text" class="input-text" v-model="testData.grayScale.deadZone1" placeholder="" />
                </td>
                <td>
                  <input type="text" class="input-text" v-model="testData.grayScale.deadZone2" placeholder="" />
                </td>
                <td rowspan="1" class="image-cell">
                  <input type="text" class="input-text" v-model="testData.grayScale.deadZone3" placeholder="" />
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import MainLayout from '../components/Layout/MainLayout.vue'

import { apiFetch } from '../api/client'

const props = defineProps({
  currentUserName: {
    type: String,
    default: ''
  }
})

const router = useRouter()

/* ---------- โหลดผู้ใช้จาก localStorage ---------- */
const userName = ref('')
const currentUserName = computed(() =>
  userName.value || props.currentUserName || 'Demo User'
)

const currentTime = ref('')
function updateTime() {
  const d = new Date()
  currentTime.value = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}:${String(d.getSeconds()).padStart(2, '0')}`
}
let timeInterval = null

onMounted(() => {
  try {
    const stored = JSON.parse(localStorage.getItem('xraycare-user') || '{}')
    if (stored.username) {
      userName.value = stored.username
      if (!deviceForm.value.tester) deviceForm.value.tester = stored.username
    }
  } catch (e) { /* ignore */ }
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval)
})

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
    verticalBaseline: '', vertical1: '', vertical2: '', vertical3: '',
    horizontalBaseline: '', horizontal1: '', horizontal2: '', horizontal3: '',
    artifactsBaseline: '', artifacts1: '', artifacts2: '', artifacts3: ''
  },
  depthPenetration: {
    baseline: '', col1: '', col2: '', col3: ''
  },
  verticalDistance: {
    actualDistance: '',
    pin13Baseline: '', pin131: '', pin132: '', pin133: '',
    pin35Baseline: '', pin351: '', pin352: '', pin353: '',
    pin68Baseline: '', pin681: '', pin682: '', pin683: ''
  },
  horizontalDistance: {
    actualDistance: '',
    nearBaseline: '', near1: '', near2: '', near3: '',
    farBaseline: '', far1: '', far2: '', far3: ''
  },
  lateralResolution: {
    pinDepthNear: '', pinDepthMid: '', pinDepthFar: '',
    nearBaseline: '', near1: '', near2: '', near3: '',
    midBaseline: '', mid1: '', mid2: '', mid3: '',
    farBaseline: '', far1: '', far2: '', far3: ''
  },
  axialResolution: {
    nearBaseline: '', near1: '', near2: '', near3: '',
    midBaseline: '', mid1: '', mid2: '', mid3: '',
    farBaseline: '', far1: '', far2: '', far3: ''
  },
  imageGeometry: {
    actualDiameter: '',
    nearCystBaseline: '', nearCyst1: '', nearCyst2: '', nearCyst3: '',
    imageQualityBaseline: '', imageQuality1: '', imageQuality2: '', imageQuality3: '',
    midCystBaseline: '', midCyst1: '', midCyst2: '', midCyst3: '',
    midImageQuality: '', midImageQuality1: '', midImageQuality2: '', midImageQuality3: '',
    farCystBaseline: '', farCyst1: '', farCyst2: '', farCyst3: '',
    farImageQuality: '', farImageQuality1: '', farImageQuality2: '', farImageQuality3: ''
  },
  grayScale: {
    deadZone: '', deadZone1: '', deadZone2: '', deadZone3: ''
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
    testDates: { date1: '', date2: '', date3: '' },
    imageUniformity: {
      verticalBaseline: '', vertical1: '', vertical2: '', vertical3: '',
      horizontalBaseline: '', horizontal1: '', horizontal2: '', horizontal3: '',
      artifactsBaseline: '', artifacts1: '', artifacts2: '', artifacts3: ''
    },
    depthPenetration: { baseline: '', col1: '', col2: '', col3: '' },
    verticalDistance: {
      actualDistance: '',
      pin13Baseline: '', pin131: '', pin132: '', pin133: '',
      pin35Baseline: '', pin351: '', pin352: '', pin353: '',
      pin68Baseline: '', pin681: '', pin682: '', pin683: ''
    },
    horizontalDistance: {
      actualDistance: '',
      nearBaseline: '', near1: '', near2: '', near3: '',
      farBaseline: '', far1: '', far2: '', far3: ''
    },
    lateralResolution: {
      pinDepthNear: '', pinDepthMid: '', pinDepthFar: '',
      nearBaseline: '', near1: '', near2: '', near3: '',
      midBaseline: '', mid1: '', mid2: '', mid3: '',
      farBaseline: '', far1: '', far2: '', far3: ''
    },
    axialResolution: {
      nearBaseline: '', near1: '', near2: '', near3: '',
      midBaseline: '', mid1: '', mid2: '', mid3: '',
      farBaseline: '', far1: '', far2: '', far3: ''
    },
    imageGeometry: {
      actualDiameter: '',
      nearCystBaseline: '', nearCyst1: '', nearCyst2: '', nearCyst3: '',
      imageQualityBaseline: '', imageQuality1: '', imageQuality2: '', imageQuality3: '',
      midCystBaseline: '', midCyst1: '', midCyst2: '', midCyst3: '',
      midImageQuality: '', midImageQuality1: '', midImageQuality2: '', midImageQuality3: '',
      farCystBaseline: '', farCyst1: '', farCyst2: '', farCyst3: '',
      farImageQuality: '', farImageQuality1: '', farImageQuality2: '', farImageQuality3: ''
    },
    grayScale: { deadZone: '', deadZone1: '', deadZone2: '', deadZone3: '' }
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
const saveForm = async () => {
  if (!validateForm()) return

  const payload = {
    formType: 'F13',
    machineName: deviceForm.value.machineName || '',
    room: '',
    checkDate: `${todayText.value} ${currentTime.value}`,
    tester: currentUserName.value,
    jsonData: JSON.stringify({
      deviceForm: deviceForm.value,
      testData: testData.value,
      summary: summary.value
    })
  }

  try {
    await apiFetch('/SaveChecklist', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
  } catch (e) {
    console.error('SaveChecklist error:', e)
  }

  router.push('/dashboard')
}
</script>

<style scoped>
/* Page wrapper */
.checklist-page {
  padding: 0;
}

/* Page title */
.page-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--text-main, #0f172a);
  letter-spacing: -0.02em;
  margin-bottom: 20px;
}

/* Info pills */
.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 24px;
}

.pill {
  background: #f1f5f9;
  color: var(--text-secondary, #475569);
  padding: 6px 16px;
  border-radius: var(--radius-full, 9999px);
  font-size: 0.82rem;
  font-weight: 500;
  white-space: nowrap;
  border: 1px solid var(--border-soft, #e2e8f0);
}

/* Content panel */
.content-panel {
  background: var(--bg-card, #ffffff);
  padding: 24px;
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--border-card, rgba(0,0,0,0.06));
  box-shadow: var(--shadow-card, 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.06));
}

/* Table wrapper */
.table-wrapper {
  border-radius: var(--radius-md, 12px);
  overflow: hidden;
  border: 1px solid var(--border-soft, #e2e8f0);
}

/* Check table */
.check-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.check-table td,
.check-table th {
  padding: 10px 14px;
  vertical-align: top;
  border-bottom: 1px solid #f1f5f9;
}

.row-header-main td {
  font-weight: 700;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-size: 0.85rem;
}

.row-header-columns td {
  font-weight: 600;
  background: #f8fafc;
  color: #64748b;
  font-size: 0.78rem;
  letter-spacing: 0.03em;
}

.check-table tr:nth-child(odd):not(.row-header-main):not(.row-header-columns) {
  background: #ffffff;
}
.check-table tr:nth-child(even):not(.row-header-main):not(.row-header-columns) {
  background: #f8fafc;
}

.cell-label {
  width: 25%;
  color: var(--text-secondary, #475569);
}

.text-center {
  text-align: center;
}

/* Text inputs */
.input-text,
.input-select {
  width: 100%;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 8px 12px;
  font-size: 0.85rem;
  transition: border-color 200ms, box-shadow 200ms;
}

.input-text:focus,
.input-select:focus {
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
  outline: none;
}

.input-textarea {
  width: 100%;
  min-height: 80px;
  resize: vertical;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 10px 12px;
  font-size: 0.85rem;
  transition: border-color 200ms, box-shadow 200ms;
}

.input-textarea:focus {
  border-color: var(--purple-soft, #0EA5E9);
  box-shadow: 0 0 0 3px rgba(14,165,233,0.1);
  outline: none;
}

/* Required field indicator */
.required {
  color: #ef4444;
}

.mb-16 {
  margin-bottom: 16px;
}

.mt-8 {
  margin-top: 8px;
}

/* Main test table (F13 B-mode QC) */
.main-test-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.85rem;
}

.main-test-table thead {
  border-bottom: 2px solid var(--border-soft, #e2e8f0);
}

.header-row td,
.header-row th {
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #ffffff;
  font-weight: 700;
  padding: 10px 14px;
  border: 1px solid rgba(255,255,255,0.2);
}

.category-row td {
  background: #f8fafc;
  font-weight: 600;
  color: #64748b;
  padding: 8px 14px;
  border: 1px solid var(--border-soft, #e2e8f0);
}

.test-label {
  color: var(--text-secondary, #475569);
  font-weight: 500;
}

.header-row th:nth-child(2),
.header-row th:nth-child(3),
.header-row th:nth-child(4),
.header-row th:nth-child(5) {
  width: 15%;
}

.main-test-table tbody td {
  padding: 6px 8px;
  border: 1px solid var(--border-soft, #e2e8f0);
  vertical-align: middle;
}

.action-cell,
.defect-cell {
  text-align: center;
  font-size: 0.80rem;
  line-height: 1.4;
  background: #f8fafc;
  font-weight: 500;
  border-left: 2px solid var(--border-soft, #e2e8f0);
}

.action-header,
.defect-header {
  font-weight: 700;
}

.image-cell {
  text-align: center;
  padding: 8px;
  background: #f8fafc;
  min-width: 100px;
}

.criteria-cell {
  font-size: 0.78rem;
  line-height: 1.5;
  padding: 6px 8px;
  background: #f8fafc;
  color: var(--text-secondary, #475569);
}

.criteria-cell[colspan="2"] {
  text-align: center;
}

.input-inline {
  display: inline-block;
  border-radius: var(--radius-sm, 8px);
  border: 1px solid var(--border-soft, #e2e8f0);
  padding: 4px 8px;
  font-size: 0.82rem;
}

.main-test-table .input-text {
  font-size: 0.82rem;
  padding: 4px 6px;
  min-height: auto;
}

/* Action buttons */
.actions {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-save {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 28px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(16,185,129,0.3);
  transition: all var(--transition-fast, 150ms);
}

.btn-save:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(16,185,129,0.4);
}

.btn-remark {
  border: none;
  border-radius: var(--radius-sm, 8px);
  padding: 10px 24px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  background: linear-gradient(135deg, #f43f5e, #e11d48);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(244,63,94,0.3);
  transition: all var(--transition-fast, 150ms);
}

.btn-remark:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(244,63,94,0.4);
}

@media (max-width: 1024px) {
  .table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; }
  .check-table { min-width: 500px; }
}
@media (max-width: 640px) {
  .checklist-page { padding: 0; }
  .pill-row { gap: 6px; }
  .pill { font-size: 0.75rem; padding: 5px 12px; }
  .content-panel { padding: 12px; border-radius: 12px; }
  .actions { flex-wrap: wrap; }
  .btn-save { padding: 8px 16px; font-size: 0.8rem; width: 100%; }
  .btn-remark { padding: 8px 16px; font-size: 0.8rem; }
  .btn-add { padding: 7px 14px; font-size: 0.78rem; }
  .input-text, .input-select { font-size: 0.8rem; padding: 6px 8px; }
}
</style>
