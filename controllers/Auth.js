import SuperAdmin from "../models/SuperAdminModels.js";
import User from "../models/UserModel.js";
import argon2 from "argon2";

export const login = async (req, res) => {
  let user;
  
  const userBiasa = await User.findOne({
    where: {
      nip: req.body.nip,
    },
  });

  const SuperAdmin = await SuperAdmin.findOne({
    where: {
      nip: req.body.nip,
    },
  });

  if(userBiasa) {
    user = userBiasa;
  } else if (SuperAdmin) {
    user = SuperAdmin
  }

  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });

  const match = await argon2.verify(user.password, req.body.password);
  if (!match) return res.status(400).json({ msg: "Kata sandi salah" });
  req.session.userId = user.uuid;
  const uuid = user.uuid;
  const name = user.name;
  const nip = user.nip;
  const role = user.role;
  const isTGR = user.isTGR;
  const amountTGR = user.amountTGR;
  res.status(200).json({ uuid, name, nip, role, isTGR, amountTGR });
};

export const me = async (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ msg: "Mohon login ke akun Anda!" });
  }

  let user;

  const userBiasa = await User.findOne({
    attributes: ["id", "status", "uuid", "name", "nip", "role", "isTGR", "amountTGR"],
    where: {
      uuid: req.session.userId,
    },
  });
  const superAdmin = await User.findOne({
    attributes: ["id", "uuid", "name", "nip", "role"],
    where: {
      uuid: req.session.userId,
    },
  });

  if(userBiasa) {
    user = userBiasa
  } else if (SuperAdmin) {
    user = superAdmin
  }

  if (!user) return res.status(404).json({ msg: "User tidak ditemukan" });
  res.status(200).json(user);
};

export const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(400).json({ msg: "Tidak dapat logout" });
    res.status(200).json({ msg: "Anda telah logout" });
  });
};
