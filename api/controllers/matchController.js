import User from "../models/User.js";

export const swipeRight = async (req, res) => {
  try {
    const { likedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);
    const likedUser = await User.findById(likedUserId);

    if (!likedUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (!currentUser.likes.includes(likedUserId)) {
      currentUser.dislikes.push(dislikedUserId);
      // veritabanına kaydet
      await currentUser.save();
    }

    res
      .status(200)
      .json({ success: true, user: currentUser, message: "User liked" });
  } catch (error) {
    console.log("Error in swipeRight:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// dislike
export const swipeLeft = async (req, res) => {
  try {
    //URL'den gelen dislikedUserId'yi al
    const { dislikedUserId } = req.params;
    const currentUser = await User.findById(req.user.id);

    // dislikedUserId currentUser'ın dislikes dizisinde yoksa
    if (!currentUser.dislikes.includes(dislikedUserId)) {
      // dislikedUserId'yi currentUser'ın dislikes dizisine ekle
      currentUser.dislikes.push(dislikedUserId);
      // veritabanına kaydet
      await currentUser.save();
    }

    res
      .status(200)
      .json({ success: true, user: currentUser, message: "User disliked" });
  } catch (error) {
    console.log("Error in swipeLeft:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// eşleşmeleri getir
export const getMatches = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate(
      "matches",
      "name age image"
    );

    res.status(200).json({ success: true, matches: user.matches });
  } catch (error) {
    console.log("Error in getMatches:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/*
kullanıcıların profillerini getir
! currentUser'ın profil bilgilerini dahil etme
! eşleşilen kullanıcıların profil bilgilerini dahil etme
! sağa ve sola kaydırılan kullanıcıların profil bilgilerini dahil etme
* tercihlere uygun olan kullanıcıların profil bilgilerini dahil et
*/
export const getUserProfiles = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    const users = await User.find({
      $and: [
        { _id: { $ne: currentUser._id } },
        { _id: { $nin: currentUser.likes } },
        { _id: { $nin: currentUser.dislikes } },
        { _id: { $nin: currentUser.matches } },
        {
          gender:
            currentUser.genderPreference === "both"
              ? { $in: ["male", "female"] }
              : currentUser.genderPreference,
        },
        {
          genderPreference: {
            $in: [currentUser.gender, "both"],
          },
        },
      ],
    });

    res.status(200).json({ success: true, users });
  } catch (error) {
    console.log("Error in getUserProfiles:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
