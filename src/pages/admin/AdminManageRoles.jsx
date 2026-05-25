import React, { useEffect, useState, useCallback } from "react";
import Swal from "sweetalert2";
import { extractErrorMessage } from "../../utils/errorUtils";
import UserService from "../../services/UserService";
import ProvinceService from "../../services/ProvinceService";
import { TableSkeleton } from "../../components/TableSkeleton";
import Pagination from "../../components/filter/Pagination";

export default function AdminManageRoles() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedRole, setSelectedRole] = useState("");

  const loadData = useCallback(async (page = 0, searchKeyword = "") => {
    try {
      setLoading(true);
      const [userRes, rolesRes] = await Promise.all([
        UserService.showAllUser(searchKeyword, page, 10),
        ProvinceService.showAllRoles(),
      ]);

      if (userRes.data && Array.isArray(userRes.data.data)) {
        setUsers(userRes.data.data);
        setTotalPages(Math.ceil(userRes.data.total / userRes.data.size));
      } else {
        console.error("User API response is not in the expected format:", userRes.data);
        setUsers([]);
        setTotalPages(0);
      }

      if (rolesRes.data && Array.isArray(rolesRes.data)) {
        setRoles(rolesRes.data);
      } else {
        console.error("Roles API response is not in the expected format:", rolesRes.data);
        setRoles([]);
      }
    } catch (e) {
      console.error("Failed to load data:", e);
      Swal.fire(
        "Error",
        extractErrorMessage(e, "โหลดข้อมูลไม่สำเร็จ"),
        "error"
      );
      setUsers([]);
      setRoles([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData(currentPage, keyword);
  }, [currentPage, loadData]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(0);
    loadData(0, keyword);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) {
      Swal.fire("โปรดเลือก", "โปรดเลือก Role ที่ต้องการจะเพิ่ม", "warning");
      return;
    }

    try {
      const response = await UserService.addUserRole({
        userId: selectedUserId,
        roleId: parseInt(selectedRole, 10),
      });

      if (response.status === 201) {
        await Swal.fire({
          title: "สำเร็จ!",
          text: "เพิ่ม Role เรียบร้อย",
          icon: "success",
          confirmButtonText: "OK",
        });
        setSelectedUserId(null);
        loadData(currentPage, keyword);
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: extractErrorMessage(error, "เพิ่ม Role ไม่สำเร็จ"),
        icon: "error",
      });
    }
  };

  const handleDeleteRole = async (userId, roleId) => {
    const result = await Swal.fire({
      title: "คุณแน่ใจหรือไม่?",
      text: "คุณต้องการลบ Role นี้ใช่ไหม",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ลบเลย!",
      cancelButtonText: "ยกเลิก",
    });

    if (result.isConfirmed) {
      try {
        const response = await UserService.deleteUserRole({
          userId,
          roleId,
        });
        if (response.status === 200) {
          await Swal.fire({
            title: "ลบเรียบร้อย!",
            text: "Role ถูกลบเรียบร้อย",
            icon: "success",
          });
          loadData(currentPage, keyword);
        }
      } catch (error) {
        Swal.fire({
          title: "Error",
          text: extractErrorMessage(error, "ลบ Role ไม่สำเร็จ"),
          icon: "error",
        });
      }
    }
  };

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <div className="p-5 space-y-6">
      <h1 className="text-2xl font-bold">จัดการบทบาทผู้ใช้</h1>

      <form onSubmit={handleSearch} className="flex gap-3 items-end">
        <div className="flex flex-col w-1/3">
          <label className="text-sm font-semibold">ค้นหา</label>
          <input
            type="text"
            className="input input-bordered"
            placeholder="ค้นหา..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn bg-[#8C6239] text-white">
          ค้นหา
        </button>
      </form>

      <div className="overflow-x-auto bg-white rounded-xl shadow">
        <table className="table w-full">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Roles</th>
              <th>Credit</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableSkeleton rows={10} cols={7} />
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <div key={role.id} className="badge badge-outline gap-2">
                          {role.roleName.replace("ROLE_", "")}
                          <button
                            onClick={() => handleDeleteRole(user.id, role.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td>{user.creditBalance}</td>
                  <td>
                    <button
                      className="btn btn-sm bg-[#8C6239] text-white"
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setSelectedRole("");
                      }}
                    >
                      เพิ่ม role
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        pageCount={totalPages}
        onPageChange={handlePageChange}
      />

      {selectedUserId && selectedUser && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 space-y-4">
            <h2 className="text-lg font-semibold">
              เพิ่ม Role ให้: {selectedUser.name}
            </h2>

            <select
              className="select select-bordered w-full"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option disabled value="">
                เลือก Role
              </option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.roleName.replace("ROLE_", "")}
                </option>
              ))}
            </select>

            <div className="flex justify-end gap-3">
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedUserId(null)}
              >
                ยกเลิก
              </button>
              <button
                className="btn bg-[#8C6239] text-white"
                onClick={handleUpdateRole}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
