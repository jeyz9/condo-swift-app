import React, { useEffect, useState } from "react";
import UserService from "../services/UserService";
import CardFilter from "../components/filter/CardFilter";
import { CondoCardSkeleton } from "../components/CondoCardSkeleton";
import Swal from "sweetalert2";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        const response = await UserService.showAllAnnounceBookmark();
        if (response.data) {
          setBookmarks(response.data);
        }
      } catch (error) {
        Swal.fire({
          icon: "error",
          title: "เกิดข้อผิดพลาด",
          text: "ไม่สามารถโหลดรายการโปรดได้",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">รายการโปรด</h1>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <CondoCardSkeleton key={i} />
          ))}
        </div>
      ) : bookmarks.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {bookmarks.map((announce) => (
            <CardFilter key={announce.id} announce={announce} />
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500">
          <p>คุณยังไม่มีรายการโปรด</p>
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
