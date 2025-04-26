import React, { useRef, useState } from "react";
import Header from "../../components/Header";
import { useAuthStore } from "../../store/useAuthStore";
import { useUserStore } from "../../store/useUserStore";

const ProfilePage = () => {
  const { authUser } = useAuthStore();
  const [userData, setUserData] = useState({
    name: authUser.name || "",
    bio: authUser.bio || "",
    age: authUser.age || "",
    gender: authUser.gender || "",
    genderPreference: authUser.genderPreference || [],
    image: authUser.image || "",
  });

  const { loading, updateProfile } = useUserStore();
  const fileInputRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.keys(userData).forEach((key) => {
      if (key === "imageFile") {
        formData.append("image", userData[key]); // Dosyayı ekle
      } else {
        formData.append(key, userData[key]);
      }
    });

    updateProfile(formData);
  };
  const inputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const imageUrl = URL.createObjectURL(file); // Dosya için geçici URL oluştur
      setUserData({ ...userData, image: imageUrl, imageFile: file });
    }
  };
  console.log("image", userData.image);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <div className="flex-grow flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 ">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Your Profile
          </h2>
        </div>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* NAME */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Name
                </label>
                <div className="mt-1">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={userData.name}
                    onChange={inputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* AGE */}
              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700"
                >
                  Age
                </label>
                <div className="mt-1">
                  <input
                    id="age"
                    name="age"
                    type="text"
                    required
                    value={userData.age}
                    onChange={inputChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Your Gender
                </label>
                <div className="mt-2 flex gap-2">
                  <div className="flex items-center">
                    <input
                      id="male"
                      name="gender"
                      type="radio"
                      value="male"
                      checked={userData.gender === "male"}
                      onChange={inputChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <label
                      htmlFor="male"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Male
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="female"
                      name="gender"
                      type="radio"
                      value="female"
                      checked={userData.gender === "female"}
                      onChange={inputChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <label
                      htmlFor="female"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Female
                    </label>
                  </div>
                </div>
              </div>
              {/* GENDER PREFERENCE */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Gender Preference
                </label>
                <div className="mt-2 space-x-2 flex items-center ">
                  <div className="flex items-center">
                    <input
                      id="prefer-male"
                      name="genderPreference"
                      type="radio"
                      value="male"
                      checked={userData.genderPreference === "male"}
                      onChange={inputChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <label
                      htmlFor="prefer-male"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Male
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="prefer-female"
                      name="genderPreference"
                      type="radio"
                      value="female"
                      checked={userData.genderPreference === "female"}
                      onChange={inputChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <label
                      htmlFor="prefer-female"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Female
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="prefer-both"
                      name="genderPreference"
                      type="radio"
                      value="both"
                      checked={userData.genderPreference === "both"}
                      onChange={inputChange}
                      className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300"
                    />
                    <label
                      htmlFor="prefer-both"
                      className="ml-2 block text-sm text-gray-900"
                    >
                      Both
                    </label>
                  </div>
                </div>
              </div>
              {/* BIO */}
              <div>
                <label
                  htmlFor="bio"
                  className="block text-sm font-medium text-gray-600"
                >
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={userData.bio}
                    onChange={inputChange}
                    className=" appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-pink-500 focus:border-pink-500 sm:text-sm"
                  />
                </div>
              </div>
              {/* IMAGE */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Cover Image
                </label>
                <div className="mt-1 flex items-center">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                  >
                    Upload Image
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </div>
              {/* IMAGE PREVIEW */}
              {userData.image && (
                <div className="mt-4 ">
                  <img
                    src={userData.image || ""}
                    alt="user image"
                    className="w-48 h-full object-cover rounded-md"
                  />
                </div>
              )}
              {/* SAVE */}
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-pink-600 hover:bg-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-500"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
