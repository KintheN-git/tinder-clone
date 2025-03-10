import React, { useState } from "react";
import Header from "../../components/Header";
import { useAuthStore } from "../../store/useAuthStore";

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
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      ProfilePage
    </div>
  );
};

export default ProfilePage;
