import SKPDModel from "../models/SKPDModel.js";

export const getSKPD = async (req, res) => {
  try {
    const response = await SKPDModel.findAll();
    res.status(200).json({ message: "success", data: response });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getSKPDById = async (req, res) => {
  try {
    const response = await SKPDModel.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({ message: "success", data: response });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createSKPD = async (req, res) => {
  const { name } = req.body;
  try {
    await SKPDModel.create({
      name: name,
    });
    res.status(201).json({ msg: "SKPD Created" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const updateSKPD = async (req, res) => {
  const skpd = await SKPDModel.findOne({
    where: {
      uuid: req.params.id,
    },
  });
  if (!skpd) return res.status(404).json({ msg: "SKPD tidak ditemukan" });
  const { name } = req.body;
  try {
    await SKPDModel.update({ name: name }, { where: { id: skpd.id } });
    res.status(200).json({ msg: "SKPD Updated" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};

export const deleteSKPD = async (req, res) => {
  try {
    await SKPDModel.destroy({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({ msg: "SKPD Deleted" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
