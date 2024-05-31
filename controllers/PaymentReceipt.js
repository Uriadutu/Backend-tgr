import PaymentResceipt from "../models/PaymentReceiptModel";

export const getPaymentReceipt = async (req, res) => {
  try {
    const response = await PaymentResceipt.findAll();
    res.status(200).json({ message: "success", data: response });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const getPaymentReceiptById = async (req, res) => {
  try {
    const response = await PaymentResceipt.findOne({
      where: {
        uuid: req.params.id,
      },
    });
    res.status(200).json({ message: "success", data: response });
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

export const createPaymentReceipt = async (req, res) => {
  const { status, user } = req.body;
  try {
    await PaymentResceipt.create({
      status: status,
      user: user,
    });
    res.status(201).json({ msg: "Payment Receipt Created" });
  } catch (error) {
    res.status(400).json({ msg: error.message });
  }
};
