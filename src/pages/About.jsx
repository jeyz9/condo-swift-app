import React from "react";
import { motion } from "framer-motion";
import { FaHome, FaUsers, FaHandshake, FaMapMarkedAlt } from "react-icons/fa";

export const About = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="w-full bg-white min-h-screen py-16 px-4 sm:px-8 md:px-16 lg:px-24 xl:px-40">
      <motion.div
        className="text-center mb-14"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h1 className="text-4xl sm:text-5xl font-bold text-[#8C6239] mb-4">
          เกี่ยวกับเรา
        </h1>
        <p className="text-gray-600 text-lg sm:text-xl max-w-2xl mx-auto leading-relaxed">
          เราคือแพลตฟอร์มอสังหาริมทรัพย์ที่มุ่งมั่นให้คุณค้นหาและลงประกาศซื้อ-ขาย-เช่าคอนโดได้ง่าย
          สะดวก และปลอดภัยที่สุดในประเทศไทย
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-20"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div>
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80"
            alt="mission"
            className="rounded-2xl shadow-lg object-cover w-full h-[320px]"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-[#8C6239] mb-4">พันธกิจของเรา</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            เรามุ่งเน้นในการพัฒนาแพลตฟอร์มที่ใช้งานง่าย
            พร้อมระบบค้นหาที่ตอบโจทย์และข้อมูลประกาศที่โปร่งใส
            เพื่อให้ผู้ซื้อและผู้ขายเชื่อมต่อกันได้อย่างมั่นใจและรวดเร็ว
          </p>
        </div>
      </motion.div>

      <motion.div
        className="text-center mb-14"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-[#8C6239] mb-10">
          ค่านิยมของเรา
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            {
              icon: <FaUsers className="text-4xl mb-3 text-[#8C6239]" />,
              title: "ใส่ใจผู้ใช้",
              desc: "เรารับฟังและพัฒนาอย่างต่อเนื่อง เพื่อมอบประสบการณ์ที่ดีที่สุดให้คุณ",
            },
            {
              icon: <FaHandshake className="text-4xl mb-3 text-[#8C6239]" />,
              title: "ความน่าเชื่อถือ",
              desc: "ประกาศทุกชิ้นได้รับการตรวจสอบ เพื่อให้ข้อมูลที่คุณเห็นเป็นความจริง",
            },
            {
              icon: <FaHome className="text-4xl mb-3 text-[#8C6239]" />,
              title: "ง่ายและครบในที่เดียว",
              desc: "ค้นหา ลงประกาศ หรือจัดการทรัพย์ของคุณได้ครบ จบในเว็บเดียว",
            },
            {
              icon: <FaMapMarkedAlt className="text-4xl mb-3 text-[#8C6239]" />,
              title: "ข้อมูลรอบด้าน",
              desc: "เรารวบรวมข้อมูลพื้นที่และสิ่งอำนวยความสะดวก เพื่อช่วยคุณตัดสินใจได้ดียิ่งขึ้น",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              className="bg-[#fdf8f4] rounded-2xl shadow-md p-6 hover:shadow-lg transition-all duration-300"
              variants={fadeUp}
            >
              {item.icon}
              <h3 className="text-xl font-semibold text-[#8C6239] mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600 text-base leading-relaxed">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        className="text-center mt-16"
        initial="hidden"
        animate="visible"
        variants={fadeUp}
      >
        <h2 className="text-3xl font-bold text-[#8C6239] mb-3">
          ติดต่อเรา
        </h2>
        <p className="text-gray-700 text-lg mb-6">
          หากคุณต้องการร่วมมือ หรือต้องการสอบถามข้อมูลเพิ่มเติม  
          เรายินดีให้คำปรึกษาและตอบกลับโดยเร็วที่สุด
        </p>
        <a
          href="mailto:support@condoswift.com"
          className="btn bg-[#8C6239] text-white px-8 py-2 rounded-md hover:bg-[#704c2c]"
        >
          ✉️ ติดต่อทีมงาน
        </a>
      </motion.div>
    </div>
  );
};
