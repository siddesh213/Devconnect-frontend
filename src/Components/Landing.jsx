"use client";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useEffect } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);

  // ✅ Auto-redirect logged in users to Feed
  useEffect(() => {
    if (user) navigate("/feed");
  }, [user, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col items-center text-center text-white px-6 py-12">
      {/* 🌟 Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl mt-12"
      >
        <h1 className="text-5xl sm:text-6xl font-extrabold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-lg">
          DevConnect 💻
        </h1>

        <p className="text-gray-300 text-lg sm:text-xl mt-4 leading-relaxed">
          A platform built for developers to{" "}
          <span className="text-blue-400 font-semibold">connect</span>,{" "}
          <span className="text-purple-400 font-semibold">collaborate</span>, and{" "}
          <span className="text-pink-400 font-semibold">grow together</span>.
        </p>

        <div className="flex justify-center mt-8">
          <button
            onClick={() => navigate("/login")}
            className="btn bg-gradient-to-r from-blue-500 to-purple-600 border-none text-white px-8 py-3 rounded-lg font-semibold hover:scale-105 transition-all shadow-lg hover:shadow-purple-700/30"
          >
            🚀 Get Started
          </button>
        </div>
      </motion.div>

      {/* 👨‍💻 Illustration */}
      <motion.img
        src="https://cdni.iconscout.com/illustration/premium/thumb/developer-community-7304072-5955000.png"
        alt="Developers connecting"
        className="w-80 sm:w-96 mt-12 drop-shadow-2xl"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      />

      {/* 💭 Why I Built This Section */}
      <motion.section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        viewport={{ once: true }}
        className="mt-20 mb-16 text-center max-w-3xl"
      >
        <h2 className="text-3xl sm:text-4xl font-extrabold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          💭 Why I Built This
        </h2>

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed italic">
          “When I first started learning development, I struggled to find guidance, real-world collaboration, and
          developers to grow with. That’s when I realized developers don’t just need tutorials — they need connection.”
        </p>

        <p className="text-gray-300 text-base sm:text-lg leading-relaxed mt-4 italic">
          “I built <span className="text-purple-400 font-semibold">DevConnect</span> to bridge that gap —  
          a place where developers can collaborate, learn, and build meaningful projects together.” 💡
        </p>

        <div className="mt-8 text-gray-400 text-sm">
          <p>— <span className="font-semibold text-white">Siddesh S K</span></p>
          <p className="mt-1">Founder & Developer of <span className="text-purple-400 font-semibold">DevConnect</span></p>
        </div>

        {/* 🌐 Social Links */}
        <div className="flex justify-center gap-6 mt-6">
          <a
            href="https://www.linkedin.com/in/siddeshsk"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-500 text-2xl transition-all"
          >
            <FaLinkedin />
          </a>
          <a
            href="mailto:siddusiddesh551@gmail.com?subject=Hello%20Siddesh!%20Let's%20Connect"
            target="_blank"
            rel="noopener noreferrer"
            className="text-red-400 hover:text-red-500 text-2xl transition-all"
          >
            <FaEnvelope />
          </a>
        </div>
      </motion.section>

      {/* 📜 Footer */}
      <footer className="border-t border-slate-700 pt-6 text-gray-500 text-sm">
        © {new Date().getFullYear()} DevConnect — Built with ❤️ by Siddesh S K
      </footer>
    </div>
  );
};

export default Landing;
