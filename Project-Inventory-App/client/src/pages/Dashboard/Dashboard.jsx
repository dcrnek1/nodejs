// eslint-disable-next-line no-unused-vars
import { useFetchUsers } from "@/hooks/useDashboard";
import { motion } from "motion/react";
import { div } from "motion/react-client";

export default function Dashboard() {
  const users = useFetchUsers();

  return (
    <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        {users.isSuccess &&
          users?.data.map((user) => (
            <div key={user.id}>
              <div>{user.id}</div>
              <div>{user.email}</div>
              <div>{user.session_count}</div>
              <br></br>
            </div>
          ))}
      </motion.div>
    </div>
  );
}
