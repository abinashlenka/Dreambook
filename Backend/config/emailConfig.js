// require("dotenv").config();
// const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");
// const dns = require("dns");
// const admin = require("firebase-admin");

// // ✅ Initialize Firebase Admin
// // ✅ Connect to MongoDB
// mongoose.connect(process.env.MONGODB_URL, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }).then(() => console.log("✅ Connected to MongoDB"))
//   .catch(err => console.error("❌ MongoDB Connection Error:", err));

// process.on("SIGINT", async () => {
//   await mongoose.connection.close();
//   console.log("🔴 MongoDB connection closed.");
//   process.exit(0);
// });

// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   role: { type: String, enum: ["author", "employee"] },
//   welcomeEmailSent: { type: Boolean, default: false },
// }, { timestamps: true });

// const User = mongoose.models.User || mongoose.model("User", userSchema);

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT),
//   secure: true,
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS,
//   },
//   tls: {
//     rejectUnauthorized: false,
//   }
// });

// dns.resolveTxt("dreambookpublishing.com", (err, records) => {
//   if (err) {
//     console.error("❌ DNS lookup failed for SPF:", err);
//   } else {
//     const spfRecords = records.flat().filter(r => r.startsWith("v=spf1"));
//     console.log("🔍 SPF Record(s) found:", spfRecords);
//   }
// });

// async function generateResetPasswordLink(email) {
//     const actionCodeSettings = {
//         url: "http://localhost:3000/__/auth/action",
//         handleCodeInApp: true
//       };
//   return await admin.auth().generatePasswordResetLink(email, actionCodeSettings);
// }

// async function processNewUsers() {
//   try {
//     const newUsers = await User.find({
//       $or: [
//         { welcomeEmailSent: false },
//         { welcomeEmailSent: { $exists: false } }
//       ]
//     });

//     console.log(`🔍 Found ${newUsers.length} new users`);

//     for (const user of newUsers) {
//       await sendWelcomeEmail(user);
//     }

//     console.log("🎉 All emails processed");
//   } catch (err) {
//     console.error("❌ Error fetching users:", err.message);
//   }
// }

// async function sendWelcomeEmail(user) {
//   try {
//     const resetPasswordLink = await generateResetPasswordLink(user.email);

//     const mailOptions = {
//       from: `"DreamBookPublishing" <${process.env.SMTP_USER}>`,
//       to: user.email,
//       subject: "Welcome to DreamBookPublishing – Set Up Your Account",
//       html: `
//         <h1>Dear ${user.name},</h1>
//         <p>Welcome to <strong>DreamBookPublishing</strong>! Click below to set your password and log in:</p>
//         <p>
//           <a href="${resetPasswordLink}" style="background:#007bff;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">
//             🔐 Set Your Password
//           </a>
//         </p>
//         <p>If you need help, contact <a href="mailto:support@dreambookpublishing.com">support@dreambookpublishing.com</a></p>
//         <p>Best regards,<br><strong>Faiq Ansari</strong><br>CEO, DreamBookPublishing</p>
//       `,
//       text: `Dear ${user.name},\n\nSet your password here: ${resetPasswordLink}\n\n- Faiq Ansari, CEO`
//     };

//     console.log(`📨 Sending email to ${user.email}`);
//     const info = await transporter.sendMail(mailOptions);

//     if (info.rejected && info.rejected.length > 0) {
//       throw new Error(`Email rejected for ${user.email}`);
//     }

//     await User.updateOne({ _id: user._id }, { welcomeEmailSent: true });
//     console.log(`✅ Email sent to ${user.email}`);
//     return true;
//   } catch (error) {
//     if (error.message.includes("SPF Record") || error.message.includes("550")) {
//       console.error(`\n❌ SPF Record Error Detected!\nPlease ensure this DNS TXT record is active for your domain:\nType: TXT\nName: @\nValue: v=spf1 include:spf.titan.email ~all\n\nCheck: https://mxtoolbox.com/spf.aspx\n`);
//     }
//     console.error(`❌ Failed to send email to ${user.email}:`, error.message);
//     return false;
//   }
// }

// if (require.main === module) {
//   processNewUsers().then(() => {
//     console.log("✅ Done.");
//     process.exit(0);
//   }).catch((err) => {
//     console.error("❌ Error in script:", err.message);
//     process.exit(1);
//   });
// }

// module.exports = {
//   sendWelcomeEmail,
//   processNewUsers,
//   User,
// };
require("dotenv").config();
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");
const admin = require("firebase-admin");

// ✅ Initialize Firebase Admin SDK (Prevent Reinitialization)
if (!admin.apps.length) {
    try {
        admin.initializeApp({
            credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SECRET))
        });
        console.log("✅ Firebase initialized");
    } catch (error) {
        console.error("❌ Error initializing Firebase:", error);
    }
}

// ✅ Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL, {  // Changed from MONGO_URI to MONGODB_URL
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

  // // ✅ Connect to MongoDB
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }).then(() => console.log("✅ Connected to MongoDB"))
//   .catch(err => console.error("❌ MongoDB Connection Error:", err));

// ✅ Handle MongoDB Connection Close
process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("🔴 MongoDB connection closed.");
    process.exit(0);
});

// ✅ Define User Schema (Prevent Overwrite)
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    role: { type: String, enum: ["author", "employee"] },
    welcomeEmailSent: { type: Boolean, default: false }, // Ensure default is false for new users
}, { timestamps: true });

// Add a pre-save middleware to ensure welcomeEmailSent is false for new users
userSchema.pre('save', function(next) {
    if (this.isNew) {
        this.welcomeEmailSent = false;
    }
    next();
});

// Update processNewUsers to properly handle the welcomeEmailSent flag
async function processNewUsers() {
    console.log("🔍 Starting email check process...");
    
    try {
        // Find users where welcomeEmailSent is false
        const users = await User.find({
            role: { $in: ["author", "employee"] },
            welcomeEmailSent: { $ne: true }  // Changed to find all users where welcomeEmailSent is not true
        });

        console.log(`Found ${users.length} users needing welcome emails`);

        for (const user of users) {
            try {
                console.log(`Processing email for ${user.email} (${user.role})`);
                await sendWelcomeEmail(user);
                
                // Update user status only if email was sent successfully
                await User.findByIdAndUpdate(
                    user._id, 
                    { welcomeEmailSent: true },
                    { new: true }
                );
                console.log(`✅ Welcome email sent and status updated for ${user.email}`);
            } catch (error) {
                console.error(`❌ Failed to process user ${user.email}:`, error.message);
                // Log detailed error for debugging
                console.error('Detailed error:', error);
            }
        }
    } catch (error) {
        console.error("❌ Error in processNewUsers:", error.message);
        throw error;
    }
}
const User = mongoose.models.User || mongoose.model("User", userSchema);

// ✅ Setup Nodemailer Transporter
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT),
    secure: true, // Changed to true for SSL
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

// Add immediate verification
transporter.verify(function(error, success) {
    if (error) {
        console.error('❌ SMTP Verification Error:', error);
    } else {
        console.log('✅ SMTP Server is ready to send emails');
    }
});

// ✅ Function to Generate Reset Password Link
async function generateResetPasswordLink(userEmail) {
    try {
        const actionCodeSettings = {
            url: 'https://dreambookpublishing.com/auth/reset-password',  // Updated to production URL
            handleCodeInApp: true
        };
        console.log(`Generating reset link for ${userEmail}`);
        const resetLink = await admin.auth().generatePasswordResetLink(userEmail, actionCodeSettings);
        console.log("✅ Reset link generated successfully");
        return resetLink;
    } catch (error) {
        console.error(`❌ Error generating reset password link for ${userEmail}:`, error.message);
        throw error; // Propagate error for better handling
    }
}

// ✅ Function to Send Welcome Email with Reset Password Link
async function sendWelcomeEmail(user) {
    const resetPasswordLink = await generateResetPasswordLink(user.email);

    if (!resetPasswordLink) {
        console.error(`❌ Could not generate reset password link for ${user.email}`);
        return;
    }

    const mailOptions = {
        from: process.env.SMTP_USER,
        to: user.email,
        subject: "Welcome to DreamBookPublishing – Set Up Your Account",
        html: `
            <h1>Dear ${user.name},</h1>
            <p>We’re thrilled to welcome you to <strong>DreamBookPublishing</strong>! As a valued author, you now have access to our platform, where you can manage your books, track sales, and connect with our publishing team.</p>
            
            <p>To get started, please set up your password and activate your account by clicking the link below:</p>
            
            <p><a href="${resetPasswordLink}" style="background-color:#007bff;color:#ffffff;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;">🔗 Set Your Password</a></p>
            
            <p>Once your password is set, you can log in and explore your dashboard:</p>

            <p><a href="https://www.dreambookpublishing.com/login" style="background-color:#28a745;color:#ffffff;padding:10px 20px;text-decoration:none;border-radius:5px;display:inline-block;">🌐 Login to DreamBookPublishing</a></p>

            <p>If you have any questions or need assistance, feel free to reach out to our support team at <a href="mailto:support@dreambookpublishing.com">support@dreambookpublishing.com</a>.</p>

            <p>Welcome aboard! We’re excited to be part of your publishing journey.</p>

            <p>Best Regards,</p>
            <p><strong>Faiq Ansari</strong><br>CEO, DreamBookPublishing<br>
            <a href="https://www.dreambookpublishing.com">www.dreambookpublishing.com</a></p>
        `,
        text: `Dear ${user.name},

We’re thrilled to welcome you to DreamBookPublishing! As a valued author, you now have access to our platform, where you can manage your books, track sales, and connect with our publishing team.

To get started, please set up your password and activate your account by clicking the link below:

🔗 Set Your Password: ${resetPasswordLink}

Once your password is set, you can log in and explore your dashboard:

🌐 Login to DreamBookPublishing: https://www.dreambookpublishing.com/login

If you have any questions or need assistance, feel free to reach out to our support team at support@dreambookpublishing.com.

Welcome aboard! We’re excited to be part of your publishing journey.

Best Regards,
Faiq Ansari
DreamBookPublishing CEO
www.dreambookpublishing.com`
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${user.email}`);
        await User.updateOne({ _id: user._id }, { $set: { welcomeEmailSent: true } });
    } catch (error) {
        console.error(`❌ Error sending email to ${user.email}:`, error);
    }
}

// ✅ Function to Check for New Users and Send Emails
// async function processNewUsers() {
//     console.log("🔍 Checking for new users...");
//     const users = await User.find({ 
//         role: { $in: ["author", "employee"] }, 
//         $or: [{ welcomeEmailSent: false }, { welcomeEmailSent: { $exists: false } }] 
//     });

//     if (users.length === 0) {
//         console.log("ℹ️ No new users found.");
//         return;
//     }

//     for (const user of users) {
//         await sendWelcomeEmail(user);
//     }
// }

async function processNewUsers() {
    console.log("🔍 Checking for new users...");
    
    // Fetch users who haven't received the welcome email
    const users = await User.find({
        role: { $in: ["author", "employee"] },
        welcomeEmailSent: false // Only select users who haven't received an email
    });

    if (users.length === 0) {
        console.log("ℹ️ No new users found.");
        return;
    }

    for (const user of users) {
        try {
            await sendWelcomeEmail(user);

            // ✅ Mark user as email sent immediately after sending
            await User.updateOne({ _id: user._id }, { $set: { welcomeEmailSent: true } });

            console.log(`✅ Email status updated for ${user.email}`);
        } catch (error) {
            console.error(`❌ Error processing ${user.email}:`, error);
        }
    }
}


// Export the necessary functions and models
module.exports = {
    processNewUsers,
    sendWelcomeEmail,
    User
};

// Start the auto-fetch after exports
setInterval(() => {
    processNewUsers();
}, 30000);

console.log("🚀 Auto-fetching users every 30 seconds...");
