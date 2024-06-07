import SlipModel from "../models/SlipModel.js";
import path from "path";
import fs from "fs";
import Users from "../models/UserModel.js";

// Get all slips
export const getSlip = async (req, res) => {
  try {
    const slips = await SlipModel.findAll({
      include: {
        model: Users,
      },
    });
    res.json(slips);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to retrieve slips" });
  }
};
export const getSlipByUser = async (req, res) => {
  try {
    const response = await SlipModel.findAll({
      where: {
        userId: req.params.id,
      },
      include: {
        model: Users,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Failed to retrieve slips" });
  }
};

export const getSlipById = async (req, res) => {
  try {
    const slip = await SlipModel.findOne({
      where: {
        uuid: req.params.id,
      },
      include : {
        model : Users
      },
    });
    if (!slip) {
      res.status(404).json({ message: "Slip not found" });
    } else {
      res.json(slip);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error retrieving slip" });
  }
};

export const createSlip = async (req, res) => {
  if (!req.files || !req.files.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const file = req.files.file;
  const fileSize = file.data.length;
  const ext = path.extname(file.name);
  const fileName = file.md5 + ext;
  const url = `${req.protocol}://${req.get("host")}/slip/${fileName}`;
  const allowedType = [".pdf"];

  if (!allowedType.includes(ext.toLowerCase())) {
    return res
      .status(422)
      .json({ message: "Invalid file type, only PDF files are allowed" });
  }

  if (fileSize > 10000000) {
    return res.status(422).json({ message: "PDF must be less than 10 MB" });
  }

  file.mv(`./public/slip/${fileName}`, async (err) => {
    if (err) {
      return res.status(500).json({ message: err.message });
    }

    try {
      await SlipModel.create({
        fileName: fileName,
        url: url,
        status: "Diproses",
        userId: req.userId,
      });
      res.status(201).json({ message: "Slip created successfully with PDF" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json({ message: "Failed to create slip" });
    }
  });
};

//Reject slip
export const rejectSlip = async (req, res) => {
  try {
    const slip = await SlipModel.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!slip) {
      return res.status(404).json({ message: "Slip not found" });
    }
    await slip.update({ status: "Ditolak" });
    res.json({ message: "Slip rejected successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to reject slip" });
  }
};

//Acc Slip
export const accSlip = async (req, res) => {
  const { id } = req.body;
  try {
    const slip = await SlipModel.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!slip) {
      return res.status(404).json({ message: "Slip not found" });
    }
    const user = await Users.findOne({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.update({
      amountTGR: 0,
      isTGR : true,
      status: "BELUM MELAKUKAN PENGAJUAN",
    });

    await slip.update({ status: "Diterima" });

    res.json({ message: "Slip accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to accept slip" });
  }
};

export const deleteSlip = async(req, res) => {
  const slip = await SlipModel.findOne({
    where : {
      id : req.params.id
    }
  })

  if (!slip) {
    res.status(404).json({msg : "data tidak ditemukan"})
  }
  try {
      const filepath = `./public/slip/${slip.fileName}`;
      fs.unlinkSync(filepath);
      await slip.destroy();
      res.status(200).json({ msg: "Lisensi Deleted Successfuly" });
    } catch (error) {
      console.log(error.message);
    }
}