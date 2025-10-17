
import React from 'react'
import { useAuthContext } from '../context/AuthContext'
import Swal from "sweetalert2";
const UserProfile = () => {
    const { logout } = useAuthContext()
    const { user } = useAuthContext();
    const handleLogout = () => {
        logout()
        Swal.fire({
            position: "center",
            icon: "success",
            title: "logout สำเร็จ!",
            text: "ออกจากระบบแล้ว",
            showConfirmButton: false,
            timer: 1500
        })
    }
    return (
        <div className="flex gap-2">
            <div className="dropdown dropdown-end">
                <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                    <div className="w-10 rounded-full">
                        <img
                            alt="Profile"
                            src={`https://ui-avatars.com/api/?name=${user?.userInfo?.name}&background=0D8ABC&color=fff`} />
                    </div>
                </div>
                <ul
                    tabIndex={0}
                    className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                    <li>
                        <a href = "/profile" className="justify-between">
                            Profile
                            <span className="badge">New</span>
                        </a>
                    </li>
                    <li><a>Settings</a></li>
                    <li><a onClick={handleLogout}>Logout</a></li>
                </ul>
            </div>
        </div>
    )
}

export default UserProfile
