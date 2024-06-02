import User from "../models/UserModel.js";
import argon2 from "argon2";

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll({
      attributes: ["uuid", "name", "nip", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      attributes: ["uuid", "name", "nip", "role", "isTGR", "amountTGR"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createUser = async (req, res) => {
  const {
    name,
    nip,
    password,
    confirmPassword,
    role,
    isTGR,
    amountTGR,
    status,
    skpdId,
  } = req.body;

  if (password === "" || password === null) {
    return res.status(400).json({ msg: "Password harus diisi" });
  }

  if (password !== confirmPassword)
    return res
      .status(400)
      .json({ msg: "Password dan Confirm Password tidak cocok" });
  const hashPassword = await argon2.hash(password);
  try {
    await User.create({
      name: name,
      nip: nip,
      isTGR: isTGR,
      amountTGR: amountTGR,
      password: hashPassword,
      status: status,
      skpdId: skpdId,
      role: role,
    });
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });

  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  const { name, nip, password, amountTGR, role, isTGR, status } = req.body;

  // Mengecek apakah password berubah
  let hashPassword;
  if (password && password !== "") {
    hashPassword = await argon2.hash(password);
  } else {
    hashPassword = user.password;
  }

  // Mengecek apakah isTGR berubah
  const isTGRChanged = isTGR !== undefined && user.isTGR !== isTGR;

  try {
    const updatedData = {
      name: name !== undefined ? name : user.name,
      nip: nip !== undefined ? nip : user.nip,
      password: hashPassword,
      role: role !== undefined ? role : user.role,
      amountTGR : amountTGR !== undefined ? amountTGR : user.amountTGR,
      isTGR: isTGRChanged ? isTGR : user.isTGR,
      status : status
    };

    await User.update(updatedData, {
      where: {
        uuid: req.params.id,
      },
    });

    res.status(200).json({ msg: "User Updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


export const deleteUser = async (req, res) => {
  const user = await User.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  try {
    await User.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
