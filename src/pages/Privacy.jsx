import React from "react";

export const PrivacyPolicy = () => {
  const lastUpdated = "31 ตุลาคม 2025 / 31 October 2025";

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-12 space-y-12 text-gray-800">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[#8C6239]">
          นโยบายความเป็นส่วนตัว (Privacy Policy)
        </h1>
        <p className="text-sm text-gray-500">ปรับปรุงล่าสุด / Last Updated: {lastUpdated}</p>
        <p className="text-base md:text-lg">
          CondoSwift ให้ความสำคัญกับการคุ้มครองข้อมูลส่วนบุคคล นโยบายนี้อธิบายประเภทข้อมูลที่เราเก็บรวบรวม
          วัตถุประสงค์ วิธีจัดเก็บ การเปิดเผย และสิทธิของเจ้าของข้อมูล โปรดอ่านอย่างละเอียด
          การใช้งานแพลตฟอร์มถือว่าคุณยอมรับนโยบายนี้
        </p>
      </header>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8C6239]">1. ข้อมูลที่เราเก็บรวบรวม</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            <strong>ข้อมูลบัญชีผู้ใช้:</strong> ชื่อ-นามสกุล อีเมล หมายเลขโทรศัพท์ รหัสผ่านที่เข้ารหัส
            และรายละเอียดการยืนยันตัวตน
          </li>
          <li>
            <strong>ข้อมูลประกาศทรัพย์:</strong> รายละเอียดโครงการ ภาพถ่าย ราคา เงื่อนไขการเช่าหรือขาย
            เอกสารสิทธิ์ที่เกี่ยวข้อง
          </li>
          <li>
            <strong>ข้อมูลธุรกรรมและการติดต่อ:</strong> ประวัติการสนทนา การส่งข้อความ การชำระค่าบริการเสริม
            (หากมี)
          </li>
          <li>
            <strong>ข้อมูลเทคนิค:</strong> ที่อยู่ IP ชนิดอุปกรณ์ เบราว์เซอร์ cookie/SDK และข้อมูลการใช้งานแบบรวม
            เพื่อปรับปรุงประสบการณ์
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8C6239]">2. วัตถุประสงค์การใช้ข้อมูล</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>ให้บริการ สร้างบัญชี และจัดการประกาศทรัพย์</li>
          <li>ยืนยันตัวตน ป้องกันการทุจริต และรักษาความปลอดภัยของแพลตฟอร์ม</li>
          <li>นำเสนอคุณสมบัติที่เหมาะสม ปรับปรุงประสบการณ์ผู้ใช้ และพัฒนาฟีเจอร์ใหม่</li>
          <li>สื่อสาร ข่าวสาร การสนับสนุนลูกค้า และการตลาดภายใต้กฎหมายที่เกี่ยวข้อง</li>
          <li>ปฏิบัติตามข้อกำหนดทางกฎหมาย หรือคำสั่งของหน่วยงานราชการ</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8C6239]">3. การเปิดเผยและการโอนข้อมูล</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>พันธมิตรหรือผู้ประมวลผลที่จำเป็นต่อการให้บริการ เช่น ผู้ให้บริการโฮสติ้ง การยืนยันตัวตน การชำระเงิน</li>
          <li>คู่สัญญาหรือผู้ใช้ปลายทางที่ได้รับสิทธิ์เข้าถึงข้อมูล เช่น ผู้สนใจเช่าซื้อที่ติดต่อผู้ลงประกาศ</li>
          <li>หน่วยงานกำกับดูแลเมื่อมีกฎหมาย คำสั่งศาล หรือข้อกำหนดที่บังคับใช้</li>
          <li>
            การโอนข้อมูลระหว่างประเทศ (หากมี) จะดำเนินการภายใต้กลไกที่กฎหมายคุ้มครองข้อมูลส่วนบุคคลกำหนดและมีระบบป้องกันที่เหมาะสม
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8C6239]">4. การเก็บรักษาข้อมูล</h2>
        <p>
          CondoSwift จะเก็บข้อมูลเท่าที่จำเป็นต่อวัตถุประสงค์การให้บริการและตามที่กฎหมายกำหนด เมื่อหมดความจำเป็น
          ข้อมูลจะถูกลบหรือทำให้ไม่สามารถระบุตัวตนได้ เว้นแต่จำเป็นต้องเก็บไว้เพื่อปกป้องสิทธิเรียกร้อง
          ปฏิบัติตามกฎหมาย หรือจัดทำรายงานเชิงสถิติที่ไม่ระบุตัวบุคคล
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8C6239]">5. สิทธิของเจ้าของข้อมูล</h2>
        <p>คุณมีสิทธิตามกฎหมายคุ้มครองข้อมูลส่วนบุคคล เช่น</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>สิทธิขอเข้าถึงและรับสำเนาข้อมูล</li>
          <li>สิทธิขอแก้ไข หรืออัปเดตข้อมูลที่ไม่ถูกต้อง</li>
          <li>สิทธิขอให้ลบหรือทำลายข้อมูลเมื่อหมดความจำเป็นหรือถอนความยินยอม</li>
          <li>สิทธิคัดค้านหรือจำกัดการประมวลผลข้อมูลบางประเภท</li>
          <li>
            สิทธิในการเพิกถอนความยินยอม โดยไม่กระทบต่อการประมวลผลก่อนการเพิกถอน
          </li>
        </ul>
        <p>
          สามารถส่งคำขอได้ที่{" "}
          <a href="mailto:privacy@condoswift.com" className="text-[#8C6239] underline">
            privacy@condoswift.com
          </a>{" "}
          เราจะดำเนินการภายในระยะเวลาที่กฎหมายกำหนด
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8C6239]">6. การใช้คุกกี้และเทคโนโลยีติดตาม</h2>
        <p>
          เว็บไซต์ของเราใช้คุกกี้และเทคโนโลยีคล้ายคลึงเพื่อจดจำการตั้งค่า วิเคราะห์การใช้งาน และนำเสนอคอนเทนต์ที่เกี่ยวข้อง
          คุณสามารถตั้งค่าบราว์เซอร์เพื่อปฏิเสธคุกกี้บางประเภทได้ แต่อาจทำให้ฟีเจอร์บางส่วนทำงานไม่สมบูรณ์
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8C6239]">7. ความปลอดภัยของข้อมูล</h2>
        <p>
          เราใช้มาตรการทางเทคนิคและองค์กร เช่น การเข้ารหัส การควบคุมการเข้าถึง และการตรวจสอบระบบ เพื่อปกป้องข้อมูลจากการเข้าถึง
          การเปลี่ยนแปลง หรือการเปิดเผยโดยไม่ได้รับอนุญาต อย่างไรก็ตามการส่งข้อมูลผ่านอินเทอร์เน็ตมีความเสี่ยง
          ผู้ใช้ควรใช้วิจารณญาณและปกป้องข้อมูลของตนอยู่เสมอ
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8C6239]">8. การปรับปรุงนโยบาย</h2>
        <p>
          CondoSwift อาจปรับปรุงนโยบายนี้เพื่อให้สอดคล้องกับบริการหรือกฎหมายที่เปลี่ยนแปลง
          หากมีการเปลี่ยนแปลงครั้งสำคัญจะประกาศผ่านหน้าเว็บไซต์ หรือช่องทางที่เหมาะสม
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8C6239]">9. ช่องทางติดต่อ</h2>
        <p>
          หากมีคำถามหรือข้อกังวลเกี่ยวกับข้อมูลส่วนบุคคล ติดต่อ{" "}
          <a href="mailto:privacy@condoswift.com" className="text-[#8C6239] underline">
            privacy@condoswift.com
          </a>{" "}
          หรือ โทรศัพท์ +66-2-123-4567 (ในเวลาทำการ)
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8C6239]">English Version</h2>
        <p>
          The following English summary is provided for international users. In the event of conflict,
          the Thai version governs under Thai law.
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Data We Collect.</strong> Account details, property listings, communications, payments, and technical
            usage data.
          </li>
          <li>
            <strong>Purposes.</strong> To provide services, verify identities, secure the platform, improve user
            experience, communicate updates, and comply with legal obligations.
          </li>
          <li>
            <strong>Sharing.</strong> With service providers, transaction counterparts, or regulators where legally
            required. Cross-border transfers will follow protective safeguards.
          </li>
          <li>
            <strong>Retention.</strong> Data is retained only as necessary for the stated purposes or legal
            requirements, then deleted or anonymised.
          </li>
          <li>
            <strong>Your Rights.</strong> Access, rectification, deletion, objection, restriction, and withdrawal of
            consent by contacting{" "}
            <a href="mailto:privacy@condoswift.com" className="text-[#8C6239] underline">
              privacy@condoswift.com
            </a>
            .
          </li>
          <li>
            <strong>Cookies.</strong> We use cookies to personalise and analyse usage. You may disable them via your
            browser, acknowledging potential feature limitations.
          </li>
          <li>
            <strong>Security.</strong> We adopt reasonable safeguards but cannot guarantee absolute security over the
            internet.
          </li>
          <li>
            <strong>Updates.</strong> Material changes will be communicated via the platform or other appropriate
            channels.
          </li>
          <li>
            <strong>Contact.</strong> Reach out via{" "}
            <a href="mailto:privacy@condoswift.com" className="text-[#8C6239] underline">
              privacy@condoswift.com
            </a>{" "}
            or +66-2-123-4567.
          </li>
        </ol>
      </section>
    </div>
  );
};

export default PrivacyPolicy;

