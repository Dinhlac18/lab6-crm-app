const fs = require('fs');
const path = require('path');

const filePath = path.join(process.cwd(), 'data', 'customers.json');

// Hàm đọc dữ liệu từ file JSON
function readData() {
    try {
        if (!fs.existsSync(filePath)) return [];
        const fileData = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(fileData);
    } catch (error) {
        return [];
    }
}

// Hàm ghi dữ liệu vào file JSON
function writeData(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error("Lỗi khi ghi file:", error);
    }
}

export default function handler(req, res) {
    // Cấu hình CORS cho phép Mobile App hoặc các client khác gọi API
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const { method } = req;
    let customers = readData();

    switch (method) {
        case 'GET':
            return res.status(200).json(customers);

        case 'POST':
            const { name, phone, email } = req.body || {};
            if (!name || !phone) {
                return res.status(400).json({ error: "Vui lòng nhập đầy đủ tên và số điện thoại!" });
            }
            const newCustomer = {
                id: Date.now(),
                name,
                phone,
                email: email || ""
            };
            customers.push(newCustomer);
            writeData(customers);
            return res.status(201).json({ message: "Thêm khách hàng thành công", data: newCustomer });

        case 'DELETE':
            const { id } = req.query;
            if (!id) {
                return res.status(400).json({ error: "Thiếu tham số ID để xóa!" });
            }
            const initialLength = customers.length;
            customers = customers.filter(c => String(c.id) !== String(id));
            if (customers.length === initialLength) {
                return res.status(404).json({ error: "Không tìm thấy khách hàng cần xóa!" });
            }
            writeData(customers);
            return res.status(200).json({ message: "Xóa khách hàng thành công" });

        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            return res.status(405).json({ error: `Method ${method} Not Allowed` });
    }
}