/* eslint-disable react/prop-types */
import { useState } from "react";

/**
 * مدال مدرن تایید حذف آگهی — جایگزین window.confirm
 */
function DeleteAdModal({ isOpen, onClose, onConfirm, adTitle, isLoading, error }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-dark-0/40 backdrop-blur-sm"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
    >
      <div
        className="bg-white rounded-sheypoor-xl shadow-2xl p-8 max-w-sm w-[90%] text-center animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Danger Icon */}
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-accent-red-bg flex items-center justify-center">
          <svg className="w-8 h-8 text-accent-red" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>

        <h3 className="text-heading-4 text-dark-0 mb-2">حذف آگهی</h3>
        <p className="text-body-2 text-dark-3 mb-1 leading-7">
          آیا از حذف آگهی زیر اطمینان دارید؟
        </p>
        {adTitle && (
          <p className="text-body-2 font-semibold text-dark-1 mb-5 line-clamp-2">
            «{adTitle}»
          </p>
        )}

        {error && (
          <div className="mb-4 p-3 bg-accent-red-bg text-accent-red text-body-3 rounded-sheypoor">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 btn-outline !border-light-0 !text-dark-2"
          >
            انصراف
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="flex-1 h-12 px-6 rounded-full bg-accent-red text-white font-semibold hover:bg-red-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>در حال حذف...</span>
              </>
            ) : (
              "حذف آگهی"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteAdModal;
