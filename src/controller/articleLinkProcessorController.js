const axios = require("axios");
const cheerio = require("cheerio");

const cleanText = (text) => text?.replace(/\s+/g, " ").trim() || "";

const formatDate = (dateStr) => {
  if (!dateStr) return null;

  const months = {
    Jan: "01",
    Feb: "02",
    Mar: "03",
    Apr: "04",
    May: "05",
    Jun: "06",
    Jul: "07",
    Aug: "08",
    Sep: "09",
    Oct: "10",
    Nov: "11",
    Dec: "12",
  };

  const regex = /(\w{3}) (\d{1,2}), (\d{4})/;
  const match = dateStr.match(regex);

  if (match) {
    const [, month, day, year] = match;
    return `${year}-${months[month] || "00"}-${day.padStart(2, "0")}`;
  }

  return null;
};

const processArticleFromLink = async (req, res) => {
  try {
    const { articleUrl } = req.body;
    if (!articleUrl)
      return res
        .status(400)
        .json({ error: "Vui lòng cung cấp liên kết bài báo!" });

    let htmlContent;
    try {
      const response = await axios.get(articleUrl);
      htmlContent = response.data;
    } catch (error) {
      console.error("Lỗi khi lấy nội dung bài báo:", error.message);
      return res
        .status(500)
        .json({ error: "Không thể truy cập liên kết bài báo!" });
    }

    const $ = cheerio.load(htmlContent);

    // Trích xuất thông tin từ trang web
    const title_vn = cleanText(
      $("meta[property='og:title']").attr("content") || $("title").text()
    );
    const title_en = title_vn; // Nếu không có tiêu đề tiếng Anh, dùng tiếng Việt

    const authors = [];
    $(".author, .authors, .article-author").each((_, el) => {
      const author = cleanText($(el).text());
      if (author) authors.push(author);
    });

    const rawDate = cleanText(
      $(".list-group-item.date-published").text() ||
        $("meta[property='article:published_time']").attr("content") ||
        $(".pub-date, .date").text()
    );
    const publish_date = formatDate(rawDate);

    const abstract = cleanText($(".abstract, .summary").text());
    const description = cleanText(
      $("meta[property='og:description']").attr("content") || "Không có mô tả"
    );
    const keywords = cleanText(
      $("meta[name='keywords']").attr("content") || $(".keywords").text()
    ).replace(/^Keywords:\s*/i, ""); 

    const journal = cleanText($(".journal-name, .publication-title").text());
    const magazine_type = cleanText($(".magazine-type").text() || "Không rõ");
    const page = parseInt(cleanText($(".page-number").text())) || 0;

    const issn_isbn = cleanText($(".issn, .isbn").text());
    const file = cleanText($("a.pdf-link").attr("href") || "Không có file");
    const link = articleUrl;
    const doi_number = cleanText(
      $("meta[name='citation_doi']").attr("content")
    );

    const status = true; // Mặc định bài báo được hiển thị
    const featured = false; // Chưa có logic để xác định bài báo nổi bật
    const order_no = false; // Chưa có logic để sắp xếp thứ tự
    const department = cleanText($(".department").text() || "Không rõ khoa");

    // Trả về dữ liệu JSON nhưng **KHÔNG LƯU VÀO MONGODB**
    return res.status(200).json({
      message: "Dữ liệu bài báo đã được trích xuất thành công!",
      data: {
        title_vn,
        title_en,
        authors,
        author_count: authors.length.toString(),
        publish_date,
        journal,
        magazine_type,
        page,
        issn_isbn,
        file,
        link,
        doi_number,
        status,
        order_no,
        featured,
        keywords,
        summary: abstract,
        department,
      },
    });
  } catch (error) {
    console.error("Lỗi xử lý:", error);
    return res
      .status(500)
      .json({ error: "Có lỗi xảy ra trong quá trình xử lý!" });
  }
};

module.exports = {
  processArticleFromLink,
};
