export const transformTitleToSlug = (title: string) => {
    return title
        .toLowerCase()
        .trim()
        // 1. Tách các dấu tiếng Việt ra khỏi chữ cái gốc (vần)
        .normalize("NFD")
        // 2. Xóa các ký tự dấu vừa được tách ra (các ký tự thuộc dải Unicode từ U+0300 đến U+036F)
        .replace(/[\u0300-\u036f]/g, "")
        // 3. Thay thế chữ đ/Đ thành d
        .replace(/đ/g, "d")
        // 4. Xóa tất cả các ký tự lạ, chỉ giữ lại chữ cái, số và khoảng trắng
        .replace(/[^a-z0-9 ]/g, "")
        // 5. Thay thế một hoặc nhiều khoảng trắng liên tiếp bằng 1 dấu gạch ngang (-)
        .replace(/\s+/g, "-");
}