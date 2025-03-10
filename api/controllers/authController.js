import User from "../models/User.js";
import jwt from "jsonwebtoken";
// token oluştur
const signToken = (id) => {
  // jwt token
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};
// kullanıcı kayıt
export const signup = async (req, res) => {
  // kullanıcı bilgilerini al
  const { name, email, password, age, gender, genderPreference } = req.body;
  try {
    // tüm imputların boş olup olmadığını kontrol et
    if (!name || !email || !password || !age || !gender || !genderPreference) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // yaş 18 olup olmadığını kontrol et
    if (age < 18) {
      return res.status(400).json({
        success: false,
        message: "You must at lest 18 years old",
      });
    }

    // şifrenin uzunlugunu kontrol et
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // kullanıcıyı veritabanına kaydet
    const newUser = await User.create({
      name,
      email,
      password,
      age,
      gender,
      genderPreference,
    });

    // token oluştur
    const token = signToken(newUser._id);

    // cookie oluştur
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün milisaniye cinsinden
      httpOnly: true, // XSS (Cross-Site Scripting) saldırılarına karşı bir güvenlik katmanı
      sameSite: "strict", // CSRF (Cross-Site Request Forgery) saldırılarına karşı bir güvenlik katmanı
      secure: process.env.NODE_ENV === "production", // Çerezin yalnızca HTTPS üzerinden gönderilip gönderilmeyeceğini belirler.
    });

    // kullanıcıyı dön
    res.status(201).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    console.log("Error in signup controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// kullanıcı giris
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // tüm imputların boş olup olmadığını kontrol et
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // kullanıcıyı veritabanından bul
    const user = await User.findOne({ email }).select("+password");

    // kullanıcı yoksa veya şifresi yanlışsa hata dön
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // token oluştur
    const token = signToken(user._id);

    // cookie oluştur
    res.cookie("jwt", token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 gün milisaniye cinsinden
      httpOnly: true, // XSS (Cross-Site Scripting) saldırılarına karşı bir güvenlik katmanı
      sameSite: "strict", // CSRF (Cross-Site Request Forgery) saldırılarına karşı bir güvenlik katmanı
      secure: process.env.NODE_ENV === "production", // Çerezin yalnızca HTTPS üzerinden gönderilip gönderilmeyeceğini belirler.
    });

    // kullanıcıyı dön
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.log("Error in login controller:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
// kullanıcı cıkıs
export const logout = async (req, res) => {
  res.clearCookie("jwt");
  res.status(200).json({ success: true, message: "Logged out successfully" });
};
