import { useState } from "react";

/**
 * پاپ‌اوور «بزودی» — برای بخش پیام‌ها و چت
 */
function ComingSoonModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-dark-0/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-sheypoor-xl shadow-2xl p-8 max-w-sm w-[90%] text-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-light-special flex items-center justify-center">
          <svg className="w-8 h-8 text-main" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </div>

        <h3 className="text-heading-4 text-dark-0 mb-2">پیام‌ها و چت آنلاین</h3>
        <p className="text-body-2 text-dark-3 mb-6 leading-7">
          این قابلیت به زودی در نسخه بعدی فعال خواهد شد. 🚀
        </p>

        <button onClick={onClose} className="btn-primary w-full">
          متوجه شدم
        </button>
      </div>
    </div>
  );
}

/**
 * Hook ساده برای استفاده از ComingSoonModal
 */
export function useComingSoon() {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  return { isOpen, open, close };
}

export default ComingSoonModal;
