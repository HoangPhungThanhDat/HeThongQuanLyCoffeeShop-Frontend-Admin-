// src/pages/dashboard/user/index.jsx
import { useState } from "react";
import { Card, CardHeader, CardBody, Typography } from "@material-tailwind/react";
import { UsersIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import "animate.css";

import { CoffeeLoader } from "@/widgets/loaders";
import {
  UserTable,
  UserHeader,
  UserStats,
  UserSearch,
} from "./components";
import Create from "./create";
import Edit from "./edit";
import Show from "./show";

import { useUsers } from "./hooks/useUsers";
import { useUserMutations } from "./hooks/useUserMutations";

export function User() {
  const {
    filteredUsers,
    stats,
    searchTerm,
    setSearchTerm,
    isLoading,
  } = useUsers();

  const { confirmAndDelete } = useUserMutations();

  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openShowDialog, setOpenShowDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ============ HANDLERS ============
  const handleShow = (user) => {
    setSelectedUser(user);
    setOpenShowDialog(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setOpenEditDialog(true);
  };

  const handleDelete = (id) => confirmAndDelete(id);

  // ============ LOADER ============
  if (isLoading) {
    return <CoffeeLoader />;
  }

  // ============ RENDER ============
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#faf6f1] via-[#fffaf5] to-[#f5ede3] py-6 lg:py-8 2xl:py-10">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-10 2xl:px-14 flex flex-col gap-6 lg:gap-8">
        {/* Page Header */}
        <UserHeader onCreate={() => setOpenCreateDialog(true)} />

        {/* Stats */}
        <UserStats stats={stats} />

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-full"
        >
          <Card className="w-full shadow-2xl rounded-3xl border border-amber-100 bg-white overflow-hidden">
            <CardHeader
              variant="gradient"
              className="m-0 p-4 lg:p-6 2xl:p-7 rounded-none bg-gradient-to-r from-[#8B5E3C] via-[#a4714b] to-[#C89F77] shadow-md"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 2xl:w-12 2xl:h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 flex-shrink-0">
                    <UsersIcon className="w-5 h-5 2xl:w-6 2xl:h-6 text-white" />
                  </div>
                  <div>
                    <Typography
                      variant="h6"
                      className="font-bold text-white tracking-wide text-base lg:text-lg 2xl:text-xl"
                    >
                      Danh Sách Người Dùng
                    </Typography>
                    <Typography className="text-xs 2xl:text-sm text-white/80 font-medium">
                      {filteredUsers.length} / {stats.totalUsers} tài khoản hiển thị
                    </Typography>
                  </div>
                </div>

                <UserSearch value={searchTerm} onChange={setSearchTerm} />
              </div>
            </CardHeader>

            <CardBody className="p-0">
              <UserTable
                users={filteredUsers}
                onShow={handleShow}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Dialogs */}
      <Create
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      />

      <Edit
        key={selectedUser?.id}
        open={openEditDialog}
        user={selectedUser}
        onClose={() => {
          setOpenEditDialog(false);
          setSelectedUser(null);
        }}
      />

      <Show
        open={openShowDialog}
        user={selectedUser}
        onClose={() => {
          setOpenShowDialog(false);
          setSelectedUser(null);
        }}
      />
    </div>
  );
}

export default User;