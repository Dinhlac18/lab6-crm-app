let customers = [
    {
        id: 1,
        name: "Nguyễn Văn An",
        phone: "0901234567",
        email: "an.nv@gmail.com"
    },
    {
        id: 2,
        name: "Trần Thị Bình",
        phone: "0918765432",
        email: "binh.tt@gmail.com"
    }
];

export default function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method === 'GET') {
        return res.status(200).json(customers);
    } 
    
    else if (req.method === 'POST') {
        const { name, phone, email } = req.body;
        if (!name || !phone) {
            return res.status(400).json({ error: 'Tên và số điện thoại là bắt buộc' });
        }
        const newCustomer = {
            id: customers.length > 0 ? customers[customers.length - 1].id + 1 : 1,
            name,
            phone,
            email: email || ''
        };
        customers.push(newCustomer);
        return res.status(201).json(newCustomer);
    } 
    
    else if (req.method === 'DELETE') {
        const { id } = req.query;
        const index = customers.findIndex(c => c.id == id);
        if (index === -1) {
            return res.status(404).json({ error: 'Không tìm thấy khách hàng' });
        }
        const deleted = customers.splice(index, 1);
        return res.status(200).json(deleted[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
}