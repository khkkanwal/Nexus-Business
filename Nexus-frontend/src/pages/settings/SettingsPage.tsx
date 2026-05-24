import React, { useState } from "react";
import { User, Lock, Bell, Globe, Palette, CreditCard } from "lucide-react";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Badge } from "../../components/ui/Badge";
import { Avatar } from "../../components/ui/Avatar";
import { useAuth } from "../../context/AuthContext";

export const SettingsPage: React.FC = () => {
  const { user, updateProfile } = useAuth();

  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    location: user?.profile?.location || "",
    bio: user?.profile?.bio || "",
    avatar: user?.profile?.avatar || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  if (!user) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const imageUrl = URL.createObjectURL(file);

    setFormData({
      ...formData,
      avatar: imageUrl,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);

      await updateProfile({
        name: formData.name,
        email: formData.email,
        profile: {
          ...user.profile,
          location: formData.location,
          avatar: formData.avatar,
          bio: formData.bio,
        },
      });

      alert("Profile updated successfully");
    } catch (error: any) {
      console.log(error);
      alert(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdatePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      setPasswordLoading(true);

      const token = localStorage.getItem("token");

      const res = await fetch(
        "http://localhost:5000/api/auth/change-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message);
      }

      alert("Password updated successfully");

      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      console.log(error);
      alert(error.message || "Failed to update password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences and settings
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <Card className="lg:col-span-1">
          <CardBody className="p-2">
            <nav className="space-y-1">
              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-primary-700 bg-primary-50 rounded-md">
                <User size={18} className="mr-3" />
                Profile
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Lock size={18} className="mr-3" />
                Security
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Bell size={18} className="mr-3" />
                Notifications
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Globe size={18} className="mr-3" />
                Language
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <Palette size={18} className="mr-3" />
                Appearance
              </button>

              <button className="flex items-center w-full px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">
                <CreditCard size={18} className="mr-3" />
                Billing
              </button>
            </nav>
          </CardBody>
        </Card>

        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Profile Settings
              </h2>
            </CardHeader>

            <CardBody className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar src={formData.avatar} alt={user.name} size="xl" />

                <div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("photo-input")?.click()
                    }
                  >
                    Change Photo
                  </Button>

                  <input
                    id="photo-input"
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="hidden"
                  />

                  <p className="mt-2 text-sm text-gray-500">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />

                <Input
                  label="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />

                <Input label="Role" value={user.role} disabled />

                <Input
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bio
                </label>

                <textarea
                  name="bio"
                  rows={4}
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 p-3"
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() =>
                    setFormData({
                      name: user.name,
                      email: user.email,
                      location: user.profile?.location || "",
                      bio: user.profile?.bio || "",
                      avatar: user.profile?.avatar || "",
                    })
                  }
                >
                  Cancel
                </Button>

                <Button onClick={handleSave} isLoading={loading}>
                  Save Changes
                </Button>
              </div>
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-lg font-medium text-gray-900">
                Security Settings
              </h2>
            </CardHeader>

            <CardBody className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Two-Factor Authentication
                </h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>

                    <Badge variant="error" className="mt-1">
                      Not Enabled
                    </Badge>
                  </div>

                  <Button variant="outline">Enable</Button>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                  Change Password
                </h3>

                <div className="space-y-4">
                  <Input
                    label="Current Password"
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                  />

                  <Input
                    label="New Password"
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                  />

                  <Input
                    label="Confirm New Password"
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                  />

                  <div className="flex justify-end">
                    <Button
                      onClick={handleUpdatePassword}
                      isLoading={passwordLoading}
                    >
                      Update Password
                    </Button>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
};
