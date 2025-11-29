INSERT IGNORE INTO auth (id, password_hash, username) VALUES 
(1, '$2a$10$a5WePxoZ7y6nnvZOfh10kOvigY0rSvs/14mjRnm6r4yeVAEIshq8e', 'admin');


INSERT IGNORE INTO products (id, name, price, quantity, category, description) VALUES 
(1, 'Laptop Dell', 15000000, 10, 'ELECTRONICS', 'Laptop Dell XPS 13 inch, RAM 16GB'),
(2, 'Mouse Logitech', 200000, 50, 'ELECTRONICS', 'Chuột không dây silent'),
(3, 'Iphone 15', 25000000, 5, 'ELECTRONICS', 'Iphone 15 Pro Max 256GB Titanium'),
(4, 'Áo thun Basic', 150000, 100, 'FASHION', 'Áo thun cotton 100% co dãn'),
(5, 'Bánh ướt lòng gà', 35000, 4, 'FOOD', 'Bánh ướt lòng gà Trang Đà Lạt');