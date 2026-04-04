"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Shield,
  Edit2,
  Save,
  X,
  Camera,
  Lock,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { DashboardAccount } from "@/lib/admin-dashboard";

function getInitials(account: DashboardAccount) {
  const firstName = account.first_name || "";
  const lastName = account.last_name || "";
  const initials = `${firstName[0] ?? ""}${lastName[0] ?? ""}`.trim();
  return initials || "AD";
}

interface AccountOverviewPageProps {
  account: DashboardAccount;
  isEditable?: boolean;
  onSave?: (data: Partial<DashboardAccount>) => Promise<void>;
}

export default function AccountOverviewPage({ 
  account: initialAccount, 
  isEditable = true,
  onSave 
}: AccountOverviewPageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [account, setAccount] = useState(initialAccount);
  const [formData, setFormData] = useState({
    first_name: initialAccount.first_name,
    last_name: initialAccount.last_name,
    email: initialAccount.email,
    role: initialAccount.role,
    avatar: initialAccount.avatar,
  });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState(false);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);

  // Update local state when prop changes
  useEffect(() => {
    if (initialAccount) {
      setAccount(initialAccount);
      setFormData({
        first_name: initialAccount.first_name,
        last_name: initialAccount.last_name,
        email: initialAccount.email,
        role: initialAccount.role,
        avatar: initialAccount.avatar,
      });
      setAvatarError(false);
    }
  }, [initialAccount]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    if (onSave) {
      try {
        await onSave(formData);
        setAccount({
          ...account,
          ...formData,
        });
        setIsEditing(false);
      } catch (error) {
        console.error("Failed to save:", error);
      }
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: account.first_name,
      last_name: account.last_name,
      email: account.email,
      role: account.role,
      avatar: account.avatar,
    });
    setIsEditing(false);
  };

  const handleAvatarUpload = async (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      alert("Avatar file size must be less than 10MB");
      return;
    }
    setUploadingAvatar(true);
    try {
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, avatar: fakeUrl });
      setAvatarError(false);
    } catch (error) {
      console.error("Failed to upload avatar:", error);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const buildFileUrl = (filePath?: string | null) => {
    if (!filePath) return null;
    if (/^(https?:\/\/|blob:|data:)/i.test(filePath)) return filePath;
    
    const baseUrl = process.env.NEXT_PUBLIC_FILE_URL;
    if (!baseUrl) {
      return filePath.startsWith("/") ? filePath : `/${filePath}`;
    }
    
    const safeBase = baseUrl.replace(/\/+$/, "");
    const safePath = filePath.replace(/^\/+/, "");
    return `${safeBase}/${safePath}`;
  };

  const avatarUrl = formData.avatar ? buildFileUrl(formData.avatar) : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full bg-white dark:bg-transparent rounded-sm overflow-hidden border border-gray-200 dark:border-white/10"
    >
      {/* Header Section */}
      <div className="px-4 sm:px-6 py-5 sm:py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-sm" style={{ backgroundColor: "#033a6d" }}>
                <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
                Account Information
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                Review current administrator details
              </p>
            </div>
          </div>

          {isEditable && !isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200"
            >
              <Edit2 className="w-3 h-3 sm:w-4 sm:h-4" />
              Edit Profile
            </button>
          )}

          {isEditing && (
            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-white/5 rounded-sm hover:bg-gray-200 dark:hover:bg-white/10 transition-all duration-200"
              >
                <X className="w-3 h-3 sm:w-4 sm:h-4" />
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-white rounded-sm transition-all duration-200"
                style={{ backgroundColor: "#033a6d" }}
              >
                <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* User Avatar Section */}
      <div className="px-4 sm:px-6 py-5 sm:py-6 border-b border-gray-200 dark:border-white/10">
        <div className="flex items-center gap-4">
          <div className="relative">
            {avatarUrl && !avatarError ? (
              <Image
                src={avatarUrl}
                alt="Avatar"
                width={80}
                height={80}
                unoptimized
                className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full border-2 border-gray-200 dark:border-white/10 object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full" style={{ backgroundColor: "#033a6d" }}>
                <span className="text-xl sm:text-2xl font-bold text-white">
                  {getInitials(account)}
                </span>
              </div>
            )}
            {isEditable && (
              <button
                onClick={() => avatarInputRef.current?.click()}
                className="absolute -bottom-1 -right-1 p-1 sm:p-1.5 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
                disabled={uploadingAvatar}
              >
                <Camera className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-gray-600 dark:text-gray-400" />
              </button>
            )}
            <input
              ref={avatarInputRef}
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleAvatarUpload(file);
                  e.target.value = "";
                }
              }}
              className="hidden"
            />
          </div>
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              {account.first_name || "First"} {account.last_name || "Name"}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <Shield className="w-3 h-3 text-gray-400" />
              <span className="text-xs text-gray-500 dark:text-gray-400 capitalize">
                {account.role || "User"}
              </span>
            </div>
            {uploadingAvatar && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                Uploading avatar...
              </p>
            )}
          </div>
        </div>
      </div>

      {/* User Details Section */}
      <div className="px-4 sm:px-6 py-5 sm:py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* First Name */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: "#033a6d" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                First Name
              </p>
              {isEditing ? (
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name || ""}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 dark:border-white/10 rounded-sm bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#033a6d]"
                  placeholder="First Name"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {account.first_name || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Last Name */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <User className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: "#033a6d" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                Last Name
              </p>
              {isEditing ? (
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name || ""}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 dark:border-white/10 rounded-sm bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#033a6d]"
                  placeholder="Last Name"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                  {account.last_name || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <Mail className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: "#033a6d" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                Email Address
              </p>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="mt-1 w-full px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm border border-gray-200 dark:border-white/10 rounded-sm bg-white dark:bg-transparent text-gray-900 dark:text-white focus:outline-none focus:border-[#033a6d]"
                  placeholder="Email"
                />
              ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-white break-all">
                  {account.email || "Not provided"}
                </p>
              )}
            </div>
          </div>

          {/* Role */}
          <div className="flex items-start gap-3 pb-4 border-b border-gray-200 dark:border-white/10">
            <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
              <Shield className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: "#033a6d" }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 tracking-wider">
                Role
              </p>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {account.role || "Not provided"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Account Actions Section */}
      <div className="px-4 sm:px-6 py-5 sm:py-6 border-t border-gray-200 dark:border-white/10">
        <div className="flex items-center space-x-3 mb-4">
          <div className="flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-sm bg-gray-100 dark:bg-white/5">
            <Lock className="h-3.5 w-3.5 sm:h-4 sm:w-4" style={{ color: "#033a6d" }} />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-white">
              Account Actions
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
              Manage your account settings
            </p>
          </div>
        </div>

        <div className="grid gap-3">
          <Button asChild type="button" className="rounded-sm py-5 text-white" style={{ backgroundColor: "#033a6d" }}>
            <Link href="/dashboard/account/edit">Edit account details</Link>
          </Button>
          <Button asChild type="button" variant="outline" className="rounded-sm py-5">
            <Link href="/dashboard/account/password">Change password</Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
