const db = require("../config/dbconfig");
const { QueryTypes } = require("sequelize");
const User = require("../models/User");
const { hash, compare } = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

exports.getAllUsers = (req, res) => {
  // User.findAll({ where: db.literal("NOT") })
  db.query(
    `SELECT * FROM chat_app.users WHERE NOT mobile_number=${req.params.mobile_number};`,
    {
      type: QueryTypes.SELECT,
    }
  )
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => console.log(err));
};

exports.loginUser = async (req, res) => {
  if (
    req.body.mobile_number.length < 10 ||
    req.body.mobile_number.length > 10
  ) {
    return res.status(400).json({
      message: "Mobile Number Should Be Of 10 Digits Only !",
      status: false,
      user: {},
    });
  }

  const userExist = await User.findOne({
    where: { mobile_number: req.body.mobile_number },
    attributes: [
      "id",
      "name",
      "mobile_number",
      "device_id",
      "password",
      "loggedIn",
    ],
  });

  if (userExist) {
    if (userExist.loggedIn === 1) {
      return res.status(401).json({
        message: "User Logged In On Another Device",
        status: false,
        user: {},
      });
    }

    const verify = await compare(req.body.password, userExist.password);
    if (verify) {
      User.update(
        { loggedIn: 1 },
        { returning: true, where: { id: userExist.id } }
      );
      userExist.password = "";
      return res.status(200).json({
        message: "Login Success !",
        status: true,
        user: userExist,
      });
    }
    return res.status(400).json({
      message: "Invalid Credentials !",
      status: false,
      user: {},
    });
  }

  return res.status(400).json({
    message: "User Does Not Exist !",
    status: false,
    user: {},
  });
};

exports.registerUser = async (req, res) => {
  if (
    req.body.mobile_number.length < 10 ||
    req.body.mobile_number.length > 10
  ) {
    return res.status(400).json({
      message: "Mobile Number Should Be Of 10 Digits !",
      status: false,
    });
  }

  const userExist = await User.findOne({
    where: { mobile_number: parseInt(req.body.mobile_number) },
  });

  if (userExist) {
    return res.status(400).json({
      message: "User Already Exist !",
      status: false,
    });
  }

  const hashedPassword = await hash(req.body.password, 12);

  const user = await User.create({
    name: req.body.name,
    mobile_number: req.body.mobile_number,
    device_id: uuidv4(),
    password: hashedPassword,
    loggedIn: 0,
  }).catch((err) => console.log(err.message));

  if (!user) {
    return res.status(400).json({
      message: "Cannot Add User !",
      status: false,
    });
  }

  return res.status(200).json({
    message: "User Created Successfully !",
    status: true,
  });
};

exports.logoutUser = async (req, res) => {
  const mobile_number = req.body.mobile_number;
  const user = await User.update(
    { loggedIn: 0 },
    {
      where: { mobile_number: mobile_number, loggedIn: 1 },
    }
  );
  if (user[0] === 0) {
    return res.status(403).json({
      status: false,
      message: "Something Went Wrong !",
    });
  }
  return res.status(201).json({
    status: true,
    message: "User Logged Out Successfully!",
  });
};
