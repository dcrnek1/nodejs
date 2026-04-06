import { NavLink } from "react-router";
import { ChevronLeft } from "lucide-react";
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

export default function SignInPage() {
  const redirectToLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`
  }

  return (
    <div className="max-w-8xl mx-auto min-h-full padding-x py-6">
      {/* Heading */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.1 }}
      >
        <div className="flex flex-col flex-wrap justify-center gap-12 pb-6 mb-6 h-full">
          {/* Heading */}
          <div className="flex flex-col flex-wrap justify-center gap-6 pb-6 mb-6">
            <h1 className="text-nowrap font-inter font-semibold text-5xl tracking-wide">
              Welcome back!
            </h1>
            <div className="text-secondary/80">
              Step back into your space. Sign in using option(s) below.
            </div>
          </div>
          <div>
            <div className="flex flex-row gap-4 items-center justify-center">
                <button
                onClick={redirectToLogin}
                  className="secondary flex flex-row items-center gap-4"
                >
                  <img
                    src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s96-fcrop64=1,00000000ffffffff-rw"
                    alt="Google"
                    style={{ width: "20px" }}
                  />
                  <div>Sign in with Google</div>
                </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
