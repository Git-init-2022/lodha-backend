const User = require("../models/userModel");
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const sendToken = require("../utils/jwtToken");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const cloudinary = require("../utils/imageUpload");
const { idText } = require("typescript");
const { Complaint } = require("../models/complaintModel");
const bunyan = require('bunyan');
const log = bunyan.createLogger({
    name: 'users',
    streams: [
    {
        level: 'info',
        stream: process.stdout
    },
    {
        type: 'rotating-file',
        level: 'info',
        path: __dirname+'/logs/users.log',
        period: '1m',
        count: 12
    }
    ]
    });

// Create User
exports.createUser = catchAsyncErrors(async (req, res, next) => {
    const { FlatNo } = req.body;
    const user1 = await User.find({ FlatNo: FlatNo });
    if (user1 && Object.keys(user1).length) {
        res.status(201).json({
            success: false,
            message: "User Already Exists"
        })
    }
    else {
        const { Password, OwnerName, RegisteredName, Block, Mobile, ParkingSlot, Email, Role } = req.body;
        const user = await User.create({
            FlatNo: FlatNo,
            Email: Email,
            Password: Password,
            OwnerName: OwnerName,
            RegisteredName: RegisteredName,
            Block: Block,
            Mobile: Mobile,
            ParkingSlot: ParkingSlot,
            Role: Role
        });
        sendToken(user, 201, res)
    }
});

// login User
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
    const { FlatNo, Password } = req.body;
    
    const user1 = await User.find({ FlatNo: FlatNo, Password: Password })
    if (!user1 && Object.keys(user1).length) {
        return next(new ErrorHandler("User does not exists", 404));
    }

    const role = crypto
      .createHash("sha256")
      .update(user1[0].Role)
      .digest("hex");
    console.log("admin: ", crypto.createHash("sha256").update("admin").digest("hex"));
    console.log("user: ", crypto.createHash("sha256").update("user").digest("hex"));
    console.log("fm: ", crypto.createHash("sha256").update("fm").digest("hex"));
    console.log("am: ", crypto.createHash("sha256").update("am").digest("hex"));
    console.log("itsupport: ", crypto.createHash("sha256").update("itsupport").digest("hex"));
    
    const user = {
        FlatNo: user1[0].FlatNo,
        OwnerName: user1[0].OwnerName,
        RegisteredName: user1[0].RegisteredName,
        ParkingSlot: user1[0].ParkingSlot,
        Block: user1[0].Block,
        Mobile: user1[0].Mobile,
        Email: user1[0].Email,
        Dues: user1[0].Dues,
        Role: role, 
    }
    // sendToken(user, 201, res);
    res.status(200).json({
        success: true,
        user
    });
})


// Get Single User
exports.getUser = catchAsyncErrors(async (req, res, next) => {
    const FlatNo = req.query.FlatNo;

    const user1 = await User.find({ FlatNo: FlatNo })
    if (user1.length === 0) {
        return next(new ErrorHandler("User does not exists", 404));
    }
    res.status(200).json({
        success: true,
        user1
    });
});

// Get All users
exports.getAllusers = catchAsyncErrors(async (req, res) => {

    const data = await User.find()
    const users = data.map((ele) => {

        return (
            {
                FlatNo: ele.FlatNo,
                OwnerName: ele.OwnerName,
                RegisteredName: ele.RegisteredName,
                ParkingSlot: ele.ParkingSlot,
                Block: ele.Block,
                Mobile: ele.Mobile,
                Email: ele.Email,
                Dues: ele.Dues,
                Role: ele.Role, 
                ImageName: ele.ImageName,
                ImageToken: ele.ImageToken
            }
        );
    })
    res.status(200).json({
        success: true,
        users
    });

})

// Update User
exports.updateUser = catchAsyncErrors(async (req, res, next) => {
    let user1 = await User.find({ FlatNo: req.query.user.FlatNo });
    if (!user1) {
        return next(new ErrorHandler("User not found", 404));
    }
    let message = "";

    const user2 = user1;
    // console.log(user1[0].Role, req.query.user.Role);
    // console.log(user1[0].Dues, req.query.user.Dues);
    if (user1[0].Email !== req.query.user.Email) {
        message =  "Email has been changed \n Previous Email:" + `${user1[0].Email}` + "\n\n" + `Current Email: ${req.query.user.Email}` + "\n\n",
        sendEmail({
            email: req.query.user.Email,
            message: "Email has been changed \n Previous Email:" + `${user1[0].Email}` + "\n\n" + `Current Email: ${req.query.user.Email}` + "\n\n",
            subject: "Your Email has been Changed"
        }) 
    }
    else {
        if (user1[0].Dues !== Number(req.query.user.Dues)) {
            message += `Dues has been changed\n Previous Dues: ${user1[0].Dues} \n\n Current Dues: ${req.query.user.Dues}\n\n`;
        }
        if (user1[0].FlatNo !== req.query.user.FlatNo) {
            message += `Flat Number has been changed\n Previous Flat Number: ${user1[0].FlatNo} \n\n Current Flat Number: ${req.query.user.FlatNo}\n\n`;
        }
        if (user1[0].Mobile !== req.query.user.Mobile) {
            message += `Mobile Number has been changed\n Previous Mobile Number: ${user1[0].Mobile} \n\n Current Mobile Number: ${req.query.user.Mobile}\n\n`;
        }
        if (user1[0].ParkingSlot !== req.query.user.ParkingSlot) {
            message += `Parking Slot has been changed\n Previous Parking Slot: ${user1[0].ParkingSlot} \n\n Current Parking Slot: ${req.query.user.ParkingSlot}\n\n`;
        } if (user1[0].OwnerName !== req.query.user.OwnerName) {
            message += `Owner Name has been changed\n Previous Owner Name: ${user1[0].OwnerName} \n\n Current Owner Name: ${req.query.user.OwnerName}\n\n`;
        }
        if (user1[0].RegisteredName !== req.query.user.RegisteredName) {
            message += `Property Register Name has been changed\n Previous Property Register Name: ${user1[0].RegisteredName} \n\n Current Property Register Name: ${req.query.user.RegisteredName}\n\n`;
        }
        if (user1[0].Block !== req.query.user.Block) {
            message += `Block Name has been changed\n Previous Block Name: ${user1[0].Block} \n\n Current Block Name: ${req.query.user.Block}\n\n`;
        }
        if (user1[0].Role !== req.query.user.Role) {
            message += `Your Role has been changed\n Previous Role: ${user1[0].Role} \n\n Current Role: ${req.query.user.Role}\n\n`;
        }
        if (message !== '') {
            
            sendEmail({
                email: user1[0].Email,
                message: message,
                subject: "Your Details have been Changed"
            });
            
         
        }
    }
    user1[0].FlatNo = req.query.user.FlatNo;
    user1[0].Email = req.query.user.Email;
    user1[0].Mobile = req.query.user.Mobile;
    user1[0].Block = req.query.user.Block;
    user1[0].Dues = req.query.user.Dues;
    user1[0].ParkingSlot = req.query.user.ParkingSlot;
    user1[0].OwnerName = req.query.user.OwnerName;
    user1[0].RegisteredName = req.query.user.RegisteredName;
    user1[0].Role = req.query.user.Role;

    user1[0].save();
    log.info(`${req.query.Admin} has changed details of ${user1[0].FlatNo} : ${message}`);
    user1 = await User.find({ FlatNo: req.query.user.FlatNo });
    res.status(200).json({
        success: true,
        message: message, 
        subject: "Details Have Been Changed"

    })
});

// Delete User

exports.deleteUser = catchAsyncErrors(async (req, res, next) => {
    const user1 = await User.find({ FlatNo: req.query.FlatNo });
    if (!user1) {
        return next(new ErrorHandler("User not found", 404));
    }
    const complaintsByUser = await Complaint.find({ FlatNo: req.query.FlatNo });

    for (let complaints of complaintsByUser) {
        complaints.remove();
    }
    sendEmail({
        email: user1[0].Email,
        message: "Your Profile data is deleted from Lodha Meridian Community",
        subject: "User Profile Deletion"
    });
    log.info(`${req.query.Admin} has deleted profile of ${user1}`);
    await user1[0].remove();
    res.status(200).json({
        success: true,
        message: "User Deletion successful"
    })
});

exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
    const {FlatNo, cid, name} = req.body;
    const user1 = await User.find({ FlatNo: FlatNo });
    if (!user1 || user1.length==0) {
        return next(new ErrorHandler("User not found", 404));
    }
    console.log(name, cid);
    user1[0].ImageName = name;
    user1[0].ImageToken = cid;
    user1[0].save();
    res.status(200).json({
        success: true,
        message: "User Profile Update successful"
    })
});