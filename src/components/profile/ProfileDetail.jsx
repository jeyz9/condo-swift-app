import React from "react";


const formatJoinedAgo = (joinDate) => {
  if (!joinDate) return "-";
  const joined = new Date(joinDate);
  if (Number.isNaN(joined.getTime())) return "-";

  const now = new Date();
  const diffMs = now.getTime() - joined.getTime();
  if (diffMs <= 0) return "วันนี้";

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffYears = Math.floor(diffDays / 365);
  const diffMonths = Math.floor((diffDays % 365) / 30);

  if (diffYears > 0) {
    return diffMonths > 0
      ? `${diffYears} ปี ${diffMonths} เดือน`
      : `${diffYears} ปี`;
  }
  if (diffMonths > 0) {
    return `${diffMonths} เดือน`;
  }
  return `${diffDays} วัน`;
};

const formatJoinDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) return "-";

  const thaiMonths = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  const day = date.getDate();
  const month = thaiMonths[date.getMonth()];
  const year = date.getFullYear() + 543;
  return `${day} ${month} ${year}`;
};

const buildStats = (profile = {}) => {
  const rent = Number(profile.announceRentCount ?? 0);
  const sell = Number(profile.announceSellCount ?? 0);
  const total = rent + sell;

  return [
    {
      label: "ประกาศทั้งหมด",
      value: total,
    },
    {
      label: "ประกาศให้เช่า",
      value: rent,
    },
    {
      label: "ประกาศขาย",
      value: sell,
    },
    {
      label: "เป็นสมาชิกมาแล้ว",
      value: formatJoinedAgo(profile.joinAt),
      sub: `เข้าร่วมเมื่อ ${formatJoinDate(profile.joinAt)}`,
    },
  ];
};



export const ProfileDetail = ({ profile }) => {
  const normalizedRoles = Array.isArray(profile?.roles)
    ? profile.roles.map((role) => `${role}`.replace(/^ROLE_/i, "").toUpperCase())
    : [];
  const isAgentOrOwner = normalizedRoles.includes("AGENT") || normalizedRoles.includes("OWNER");

  if (isAgentOrOwner) {
    const stats = buildStats(profile);
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-y-8 sm:gap-x-20 w-full max-w-6xl rounded-3xl bg-white p-8 border border-gray-100 ">
          {stats.map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center text-center gap-2"
            >
              <span className="text-[36px] font-semibold text-gray-900">
                {item.value}
              </span>
              <span className="text-[16px] text-gray-600">{item.label}</span>
              {item.sub && (
                <span className="text-[13px] text-gray-400 mt-[-2px]">
                  {item.sub}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  const joinAt = profile?.joinAt;
  const formatJoinedAgo = (joinDate) => {
    if (!joinDate) return "-";
    const joined = new Date(joinDate);
    if (Number.isNaN(joined.getTime())) return "-";
    const now = new Date();
    const diffMs = now.getTime() - joined.getTime();
    if (diffMs <= 0) return "วันนี้";
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffYears = Math.floor(diffDays / 365);
    const diffMonths = Math.floor((diffDays % 365) / 30);
    if (diffYears > 0) {
      return diffMonths > 0
        ? `${diffYears} ปี ${diffMonths} เดือน`
        : `${diffYears} ปี`;
    }
    if (diffMonths > 0) {
      return `${diffMonths} เดือน`;
    }
    return `${diffDays} วัน`;
  };
  const formatJoinDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "-";
    const thaiMonths = [
      "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
      "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
    ];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = date.getFullYear() + 543;
    return `${day} ${month} ${year}`;
  };

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="flex flex-col items-center w-full max-w-6xl rounded-3xl bg-white p-8 border border-gray-100 ">
        <div className="flex flex-col items-center text-center gap-2">
          <span className="text-[36px] font-semibold text-gray-900">
            {formatJoinedAgo(joinAt)}
          </span>
          <span className="text-[16px] text-gray-600">เข้าร่วมเมื่อ</span>
          <span className="text-[13px] text-gray-400 mt-[-2px]">
            {formatJoinDate(joinAt)}
          </span>
        </div>
      </div>
    </div>
  );
};
