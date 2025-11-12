import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory store for OTPs and request counts
let validOtps: Record<string, string> = {};

app.post("/generate-otp", (req, res) => {
  const email = req.body.email;
  if (!email) {
    return res.status(400).send("Email is required");
  }

  // Generate a simple OTP (for demonstration purposes)
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  validOtps[email] = otp;
  console.log(`Otp for ${email} is ${otp}`);

  res.json({
    message: "OTP generated and email sent",
  });
  console.log(validOtps)
});

app.post("/verify-otp", (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).send("Email, OTP, and new password are required");
  }

  if (validOtps[email] == otp) {
    console.log(`New Password ${newPassword} has been set for ${email}`);
  }
  else{
    // return res.status(400).json({ message: "Invalid OTP" });
  }

  return res.json({
    message: "If the OTP is correct, the password has been reset",
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
