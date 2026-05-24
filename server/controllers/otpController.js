const otpController = {};

otpController.sendOtp = async (req, res) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    res.status(200).json({
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export default otpController;
