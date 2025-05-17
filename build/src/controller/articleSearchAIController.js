const Tesseract = require("tesseract.js");
const axios = require("axios");
const cloudinary = require("../configs/cloudinary");
const uploadToCloudinary = fileBuffer => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream({
      folder: "uploads"
    }, (error, result) => {
      if (error) return reject(error);
      resolve(result);
    });
    uploadStream.end(fileBuffer);
  });
};
const searchWithGoogle = async query => {
  const searchUrl = `https://www.googleapis.com/customsearch/v1?key=${process.env.GOOGLE_API_KEY}&cx=${process.env.GOOGLE_SEARCH_ENGINE_ID}&q=${query}`;
  console.log("Search URL:", searchUrl);
  try {
    const response = await axios.get(searchUrl);
    return response.data.items.map(item => ({
      title: item.title,
      link: item.link,
      snippet: item.snippet
    }));
  } catch (error) {
    console.error("Google API Error:", error.response?.data || error.message);
    throw error;
  }
};
const processImageAndSearch = async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({
        error: "Vui lòng tải lên một hình ảnh!"
      });
    }
    let uploadResult;
    try {
      uploadResult = await uploadToCloudinary(req.file.buffer);
    } catch (error) {
      console.error("Lỗi tải ảnh lên Cloudinary:", error);
      return res.status(500).json({
        error: "Lỗi tải ảnh lên Cloudinary!"
      });
    }
    let extractedText;
    try {
      const {
        data
      } = await Tesseract.recognize(uploadResult.secure_url, "vie", {
        logger: info => console.log(info)
      });
      extractedText = data.text.trim();
    } catch (error) {
      console.error("Lỗi OCR:", error);
      return res.status(500).json({
        error: "Lỗi nhận dạng văn bản từ hình ảnh!"
      });
    }
    if (!extractedText) {
      return res.status(400).json({
        error: "Không tìm thấy văn bản trong ảnh!"
      });
    }
    console.log("Văn bản trích xuất:", extractedText);
    const maxQueryLength = 100;
    const searchQuery = extractedText.replace(/\n/g, " ").replace(/\s+/g, " ").trim().substring(0, maxQueryLength);
    let results;
    try {
      results = await searchWithGoogle(searchQuery);
    } catch (error) {
      console.error("Lỗi tìm kiếm bài báo:", error);
      return res.status(500).json({
        error: "Lỗi tìm kiếm bài báo trên mạng!"
      });
    }
    res.status(200).json({
      imageUrl: uploadResult.secure_url,
      extractedText,
      results
    });
  } catch (error) {
    console.error("Lỗi xử lý:", error);
    res.status(500).json({
      error: "Có lỗi xảy ra trong quá trình xử lý!"
    });
  }
};
module.exports = {
  processImageAndSearch
};