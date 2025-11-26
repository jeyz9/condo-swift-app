import React from "react";

export const TermsOfService = () => {
  const lastUpdated = "31 ตุลาคม 2025 / 31 October 2025";

  return (
    <div className="px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40 py-12 space-y-12 text-gray-800">
      <header className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold text-[#8C6239]">
          ข้อกำหนดการใช้บริการ (Terms of Service)
        </h1>
        <p className="text-sm text-gray-500">ปรับปรุงล่าสุด / Last Updated: {lastUpdated}</p>
        <p className="text-base md:text-lg">
          เอกสารฉบับนี้อธิบายข้อกำหนดที่ใช้บังคับต่อการใช้งานแพลตฟอร์ม CondoSwift รวมถึงเว็บไซต์
          แอปพลิเคชัน และบริการที่เกี่ยวข้องทั้งหมด (“บริการ”) โปรดอ่านอย่างละเอียด
          การเข้าถึงหรือใช้บริการถือว่าคุณยอมรับข้อกำหนดเหล่านี้
        </p>
      </header>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#8C6239]">1. การยอมรับและการแก้ไขข้อกำหนด</h2>
        <p>
          การใช้บริการหมายความว่าคุณยอมรับข้อกำหนดฉบับนี้ CondoSwift อาจปรับปรุงข้อกำหนดได้ตามความเหมาะสม
          โดยจะแจ้งเตือนผ่านหน้าเว็บไซต์หรือช่องทางอื่นที่เหมาะสม การใช้งานอย่างต่อเนื่องหลังการปรับปรุงถือเป็นการยอมรับข้อกำหนดฉบับล่าสุด
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#8C6239]">2. บัญชีผู้ใช้และความปลอดภัย</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>ผู้ใช้ต้องให้ข้อมูลที่ถูกต้อง ครบถ้วน และเป็นปัจจุบันเมื่อสมัครสมาชิก</li>
          <li>คุณมีหน้าที่รับผิดชอบในการรักษาความปลอดภัยของบัญชี รวมถึงรหัสผ่าน</li>
          <li>หากสงสัยว่ามีการใช้บัญชีโดยไม่ได้รับอนุญาต ต้องแจ้ง CondoSwift ทันที</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#8C6239]">3. การลงประกาศและการทำธุรกรรม</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>ผู้ลงประกาศรับรองว่าข้อมูลทรัพย์สินถูกต้องตามความเป็นจริงและมีสิทธิ์ในการลงประกาศ</li>
          <li>ต้องระบุรายละเอียด ประเภททรัพย์ ราคา เงื่อนไขการเช่าหรือขาย และเอกสารประกอบที่จำเป็นอย่างชัดเจน</li>
          <li>CondoSwift เป็นแพลตฟอร์มตัวกลาง ไม่ใช่ผู้ซื้อ ผู้ขาย หรือผู้เช่าโดยตรง และไม่รับผิดชอบต่อข้อพิพาทที่เกิดจากธุรกรรม</li>
          <li>ห้ามลงประกาศที่ฝ่าฝืนกฎหมาย ละเมิดสิทธิบุคคลอื่น หรือมีเนื้อหาที่ไม่เหมาะสม</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#8C6239]">4. พฤติกรรมต้องห้าม</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>ห้ามใช้บริการในทางที่ผิดทุจริต ขัดต่อกฎหมาย หรือสร้างความเสียหายให้แก่บุคคลอื่น</li>
          <li>ห้ามเผยแพร่ไวรัส ซอฟต์แวร์ไม่พึงประสงค์ หรือดำเนินการที่รบกวนระบบ</li>
          <li>ห้ามรวบรวมข้อมูลผู้ใช้งานอื่นโดยไม่ได้รับความยินยอม</li>
          <li>CondoSwift อาจระงับหรือยกเลิกบัญชีที่ฝ่าฝืนข้อกำหนดทันทีโดยไม่ต้องแจ้งล่วงหน้า</li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#8C6239]">5. ค่าธรรมเนียมและบริการเสริม</h2>
        <p>
          การใช้งานพื้นฐานของแพลตฟอร์มอาจไม่มีค่าใช้จ่าย อย่างไรก็ตาม CondoSwift
          อาจมีบริการเสริมที่คิดค่าธรรมเนียม ซึ่งจะแจ้งรายละเอียดตามความเหมาะสม
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#8C6239]">6. ทรัพย์สินทางปัญญา</h2>
        <p>
          เนื้อหา โลโก้ เครื่องหมายการค้า และองค์ประกอบทางภาพหรือข้อความที่ปรากฏบนบริการเป็นกรรมสิทธิ์ของ CondoSwift
          หรือผู้ให้สิทธิ์ของเรา ผู้ใช้ต้องไม่คัดลอก ดัดแปลง เผยแพร่ หรือใช้เพื่อวัตถุประสงค์ทางการค้าโดยไม่ได้รับอนุญาต
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#8C6239]">7. ข้อจำกัดความรับผิด</h2>
        <ul className="list-disc pl-6 space-y-2">
          <li>
            CondoSwift ให้บริการในลักษณะ “ตามที่เป็น” (as-is) ไม่รับประกันความถูกต้อง ครบถ้วน
            หรือความพร้อมใช้งานอย่างต่อเนื่องของข้อมูลหรือระบบ
          </li>
          <li>
            CondoSwift ไม่รับผิดชอบต่อความสูญเสียหรือความเสียหายอันเกิดจากการใช้งานแพลตฟอร์ม
            การตัดสินใจซื้อ/ขาย/เช่าเป็นความรับผิดชอบของคู่สัญญา
          </li>
        </ul>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#8C6239]">8. กฎหมายที่บังคับใช้และการระงับข้อพิพาท</h2>
        <p>
          ข้อกำหนดนี้อยู่ภายใต้กฎหมายไทย ข้อพิพาทที่ไม่สามารถตกลงกันได้จะถูกพิจารณาโดยศาลไทยที่มีเขตอำนาจ
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-semibold text-[#8C6239]">9. ช่องทางติดต่อ</h2>
        <p>
          หากมีคำถามเกี่ยวกับข้อกำหนดการใช้บริการ สามารถติดต่อได้ที่{" "}
          <a href="mailto:support@condoswift.com" className="text-[#8C6239] underline">
            support@condoswift.com
          </a>
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[#8C6239]">English Version</h2>
        <p>
          This section provides an English summary of the Terms of Service. In case of discrepancy,
          the Thai version shall prevail under Thai law.
        </p>
        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Acceptance.</strong> Using CondoSwift means you agree to these Terms. We may update them and will
            post the latest version on our platform.
          </li>
          <li>
            <strong>Accounts.</strong> Provide accurate information and keep your credentials secure. Notify us if you
            suspect unauthorised access.
          </li>
          <li>
            <strong>Listings & Transactions.</strong> Listers must ensure property data is accurate and lawful. CondoSwift
            is a marketplace facilitator only and is not a party to any sale or lease agreement.
          </li>
          <li>
            <strong>Prohibited Conduct.</strong> Do not use the platform for unlawful, fraudulent, harmful, or disruptive
            activities. We may suspend or terminate accounts that breach these Terms.
          </li>
          <li>
            <strong>Fees.</strong> Core features are free, but optional premium services may incur fees which will be
            disclosed before purchase.
          </li>
          <li>
            <strong>Intellectual Property.</strong> All marks, logos, and content remain the property of CondoSwift or its
            licensors. Do not reproduce or exploit them without permission.
          </li>
          <li>
            <strong>Disclaimer.</strong> Services are provided “as-is”. CondoSwift is not liable for losses arising from
            platform use or user decisions.
          </li>
          <li>
            <strong>Governing Law.</strong> These Terms are governed by Thai law; disputes are subject to Thai courts.
          </li>
          <li>
            <strong>Contact.</strong> Reach us at{" "}
            <a href="mailto:support@condoswift.com" className="text-[#8C6239] underline">
              support@condoswift.com
            </a>
            .
          </li>
        </ol>
      </section>
    </div>
  );
};

export default TermsOfService;

