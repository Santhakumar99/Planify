import User from "../models/user.model.js";
import sendEmail from "../../config/Mail.Config.js";

export const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });
    const user = await User.create({ name, email, password, role });
    const token = user.generateJWT();
    // email

    var useremail = user?.email;
    const subject = "Welcome aboard! 🎉";
    const html = `
     <p>Hi ${user.name},</p>
     <p>
    Welcome to <strong>Project Management Tool</strong> — we’re excited to have you on board!
    </p>

    <p>
    You can now create projects, assign tasks, and collaborate with your team
    all in one place.
   </p>

   <p>
    🚀 Let’s get started!
  </p>

  <p>
    Cheers,<br/>
    <strong>Project Management Tool Team</strong>
  </p>
`;

    const emailSend = await sendEmail(useremail, subject, html);
    // response

    res.status(200).json({
      success:true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing Email or Password" });
    const user = await User.findOne({ email }).select("+password");
    if (!user) return res.status(401).json({ message: "Invalid User" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid Password" });
    const token = user.generateJWT();
    user.password = undefined;
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({ message: err.message });
  }
};
export const getallusers = async(req,res)=>{
  try {
    let allUsers = await User.find({})
    res.status(200).json({message:"all users list", allUsers})
  } catch (error) {
    res.status(400).json({message:error.message})
  }
}
// export const createUsers=async(req,res)=>{
//   try {
//     const {}
//   } catch (error) {
    
//   }
// }