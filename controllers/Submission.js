import Submission from "../models/SubmissionModel.js";
import Users from "../models/UserModel.js";
import path from "path";
import fs from "fs";

// Get all submissions
export const getAllSubmissions = async (req, res) => {
  try {
    const submissions = await Submission.findAll({ include: Users });
    res.json(submissions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve submissions" });
  }
};

// Get submission by ID
export const getSubmissionById = async (req, res) => {
  try {
    const response = await Submission.findOne({
      where: {
        id_user: req.params.id,
      }, 
      include : {
        model : Users
      }
      
    });
    if (!response) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve submission" });
  }
};
export const getSubmissionByUser = async (req, res) => {
  try {
    const response = await Submission.findAll({
      where: {
        id_user: req.params.id,
      },
      
    });
    if (!response) {
      return res.status(404).json({ message: "Submission not found" });
    }
    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to retrieve submission" });
  }
};

export const createSubmission = async (req, res) => {
  try {
    if (
      !req.files ||
      !req.files.ktpFileName ||
      !req.files.recommendationLetterFileName ||
      !req.files.applicationLetterFileName
    ) {
      return res.status(400).json({ msg: "Tidak Ada File Dipilih" });
    }

    const fileKTP = req.files.ktpFileName;
    const fileRecommendationLetter = req.files.recommendationLetterFileName;
    const fileApplicationLetter = req.files.applicationLetterFileName;

    // Get file extension
    const extKTP = path.extname(fileKTP.name);
    const extRecommendationLetter = path.extname(fileRecommendationLetter.name);
    const extApplicationLetter = path.extname(fileApplicationLetter.name);

    const allowedTypes = [".png", ".jpg", ".jpeg", ".pdf", ".docx"];

    if (
      !allowedTypes.includes(extKTP.toLowerCase()) ||
      !allowedTypes.includes(extRecommendationLetter.toLowerCase()) ||
      !allowedTypes.includes(extApplicationLetter.toLowerCase())
    ) {
      return res.status(400).json({ msg: "File Tidak Valid" });
    }

    const fileSize =
      fileKTP.size + fileRecommendationLetter.size + fileApplicationLetter.size;

    if (fileSize > 5000000) {
      return res.status(422).json({ msg: "File Tidak Bisa Lebih Dari 5 MB" });
    }

    const namaKtp = `ktp_${fileKTP.md5}${extKTP}`;
    const namaRecommendationLetter = `rekom_${fileRecommendationLetter.md5}${extRecommendationLetter}`;
    const namaApplicationLetter = `app_${fileApplicationLetter.md5}${extApplicationLetter}`;

    const urlKtp = `${req.protocol}://${req.get(
      "host"
    )}/uploads/ktp/${namaKtp}`;
    const urlRecommendationLetter = `${req.protocol}://${req.get(
      "host"
    )}/uploads/rekom/${namaRecommendationLetter}`;
    const urlApplicationLetter = `${req.protocol}://${req.get(
      "host"
    )}/uploads/app/${namaApplicationLetter}`;

    fileKTP.mv(`./public/uploads/ktp/${namaKtp}`);
    fileRecommendationLetter.mv(
      `./public/uploads/rekom/${namaRecommendationLetter}`
    );
    fileApplicationLetter.mv(`./public/uploads/app/${namaApplicationLetter}`);

    await Submission.create({
      id_user: req.userId,
      ktpUrl: urlKtp,
      ktpFileName: namaKtp,
      recommendationLetterUrl: urlRecommendationLetter,
      recommendationLetterFileName: namaRecommendationLetter,
      applicationLetterUrl: urlApplicationLetter,
      applicationLetterFileName: namaApplicationLetter,
      status: "Diproses",

      userId: req.userId,
    });

    res.status(201).json({
      msg: "Submission Created",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to Create Submission" });
  }
};

// Create a new submission with file upload
// export const createSubmission = async (req, res) => {
//   const { userId } = req.body;

//   // Check if files are included in request
//   if (!req.files || Object.keys(req.files).length === 0) {
//     return res.status(400).json({ message: "No files were uploaded" });
//   }

//   try {
//     const ktpFile = req.files.ktpFile;
//     const recommendationLetterFile = req.files.recommendationLetterFile;
//     const applicationLetterFile = req.files.applicationLetterFile;

//     // Move files to upload directory
//     const uploadPath = path.join("./public/uploads");

//     ktpFile.mv(path.join(uploadPath, ktpFile.name));
//     recommendationLetterFile.mv(
//       path.join(uploadPath, recommendationLetterFile.name)
//     );
//     applicationLetterFile.mv(path.join(uploadPath, applicationLetterFile.name));

//     // Create submission in database
//     const newSubmission = await Submission.create({
//       ktpUrl: `/uploads/${ktpFile.name}`,
//       ktpFileName: ktpFile.name,
//       recommendationLetterUrl: `/uploads/${recommendationLetterFile.name}`,
//       recommendationLetterFileName: recommendationLetterFile.name,
//       applicationLetterUrl: `/uploads/${applicationLetterFile.name}`,
//       applicationLetterFileName: applicationLetterFile.name,
//       userId,
//     });

//     res.status(201).json(newSubmission);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to create submission" });
//   }
// };

// Update submission by ID
export const updateSubmissionById = async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;
  try {
    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    await submission.update({ userId });
    res.json({ message: "Submission updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update submission" });
  }
};

// Delete submission by ID
export const deleteSubmissionById = async (req, res) => {
  const { id } = req.params;
  try {
    const submission = await Submission.findByPk(id);
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
    }
    await submission.destroy();
    res.json({ message: "Submission deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to delete submission" });
  }
};

//Acc Submission
export const accSubmission = async (req, res) => {
  const {id} = req.body
  try {
    const submission = await Submission.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!submission) {
      return res.status(404).json({ message: "Submission not found" });
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
      status: "SUDAH MELAKUKAN PENGAJUAN",

      amountTGR: 0,
      isTGR: false,
    });

    await submission.update({ status: "Diterima" });
    res.json({ message: "Pengajuan Berhasil Diterima" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Gagal Menerima Pengajuan" });
  }
};

export const rejectSubmission = async (req, res) => {
  try {
    const submission = await Submission.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!submission) {
      return res.status(404).json({ message: "Slip not found" });
    }
    await submission.update({ status: "Ditolak" });
    res.json({ message: "Pengajuan Berhasil Ditolak" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Gagal Menolak Pengajuan" });
  }
};