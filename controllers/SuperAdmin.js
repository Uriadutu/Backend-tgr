import SuperAdmin from "../models/SuperAdminModels.js";
import argon2 from "argon2";

export const getSuperAdmin = async (req, res) => {
  try {
    const response = await SuperAdmin.findAll({
      attributes: ["uuid", "name", "nip", "role"],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};


export const getSuperAdminById = async (req, res) => {
  try {
    const response = await SuperAdmin.findOne({
      attributes: ["uuid", "name", "nip", "role"],
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createSuperAdmin = async (req, res) => {
  const {
    name,
    nip,
    password,
    confirmPassword,
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
    await SuperAdmin.create({
      name: name,
      nip: nip,
      password: hashPassword,
      role: "superAdmin",
    });
    res.status(201).json({ msg: "Register Berhasil" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};


export const deleteUser = async (req, res) => {
  const user = await SuperAdmin.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  try {
    await SuperAdmin.destroy({
      where: {
        id: user.id,
      },
    });
    res.status(200).json({ msg: "User Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
