
import { Typography } from "@material-tailwind/react";
import { UserCircleIcon, CameraIcon, XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Avatar upload dùng chung create/edit
 */
export function UserAvatarUpload({
  imagePreview,
  onImageChange,
  onRemove,
  isActive,
  disabled = false,
}) {
  return (
    <>
      <div className="relative group">
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#8B5E3C] to-[#C89F77] blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-300" />

        <div className="relative w-40 h-40 lg:w-48 lg:h-48 rounded-3xl overflow-hidden border-4 border-white shadow-2xl bg-gradient-to-br from-[#f5ede3] to-[#e8d9c7]">
          {imagePreview ? (
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2">
              <UserCircleIcon className="h-20 w-20 text-[#C89F77]" />
              <Typography className="text-xs text-[#8B5E3C] font-semibold">
                Chưa có ảnh
              </Typography>
            </div>
          )}
        </div>

        {imagePreview ? (
          <button
            type="button"
            onClick={onRemove}
            disabled={disabled}
            className="absolute -top-2 -right-2 p-2 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-full shadow-lg transition-all duration-200 hover:scale-110 active:scale-95 border-2 border-white disabled:opacity-50"
          >
            <XMarkIcon className="h-4 w-4" strokeWidth={2.5} />
          </button>
        ) : (
          <label
            className={`absolute -bottom-2 -right-2 p-3 bg-gradient-to-br from-[#8B5E3C] to-[#6d4c41] hover:from-[#6d4c41] hover:to-[#4e342e] text-white rounded-full shadow-lg cursor-pointer transition-all duration-300 hover:scale-110 active:scale-95 border-2 border-white ${
              disabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <CameraIcon className="h-5 w-5" strokeWidth={2.5} />
            <input
              type="file"
              accept="image/*"
              onChange={onImageChange}
              className="hidden"
              disabled={disabled}
            />
          </label>
        )}
      </div>

      <div className="mt-4 text-center">
        <Typography className="text-sm font-bold text-[#4e342e]">
          Ảnh Đại Diện
        </Typography>
        <Typography className="text-xs text-gray-500 mt-1">
          JPG, PNG, GIF (tối đa 5MB)
        </Typography>
      </div>

      {/* Status preview */}
      <div
        className={`mt-4 w-full p-3 rounded-2xl border-2 transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200"
            : "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200"
        }`}
      >
        <div className="flex items-center gap-2 justify-center">
          <span
            className={`w-2 h-2 rounded-full ${
              isActive ? "bg-green-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          <Typography
            className={`text-xs font-bold ${
              isActive ? "text-green-700" : "text-gray-600"
            }`}
          >
            {isActive ? "Đang hoạt động" : "Vô hiệu hóa"}
          </Typography>
        </div>
      </div>
    </>
  );
}

export default UserAvatarUpload;