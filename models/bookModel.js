const {db}=require('../database/database');
const ObjectId= require('mongodb').ObjectId;
let books;

// const books=[
//     {
//         id: 1,
//         title: 'Tắt Đèn',
//         cover: 'https://cdn0.fahasa.com/media/catalog/product/cache/1/small_image/400x400/9df78eab33525d08d6e5fb8d27136e95/i/m/image_195509_1_10154.jpg',
//         basePrice: '18000đ',
//         detail: 'Tắt đèn của nhà văn Ngô Tất Tố phản ánh rất chân thực cuộc sống khốn khổ của tầng lớp nông dân Việt Nam đầu thế kỷ XX dưới ách đô hộ của thực dân Pháp. Tác phẩm xoay quanh nhân vật chị Dậu và gia đình - một điển hình của cuộc sống bần cùng hóa sưu cao thuế nặng mà chế độ thực dân áp đặt lên xã hội Việt Nam. Trong cơn cùng cực chị Dậu phải bán khoai, bán bầy chó đẻ và bán cả đứa con để lấy tiền nộp sưu thuế cho chồng nhưng cuộc sống vẫn đi vào bế tắc, không lối thoát.'
//     },
//     {
//         id: 2,
//         title: 'Harry Potter',
//         cover: 'https://cdn0.fahasa.com/media/catalog/product/cache/1/small_image/400x400/9df78eab33525d08d6e5fb8d27136e95/n/x/nxbtre_full_21422017_044234.jpg',
//         basePrice: '180000đ',
//         detail: 'Kịch bản Harry Potter và Đứa trẻ bị nguyền rủa được viết dựa trên câu chuyện của J.K. Rowling, Jack Thorne và John Tiffany. Từ những nhân vật quen thuộc trong bộ Harry Potter, kịch bản nói về cuộc phiêu lưu của những hậu duệ, sự can thiệp vào dòng thời gian đã gây ra những thay đổi không ngờ cho tương lai tưởng chừng đã yên ổn sau khi vắng bóng chúa tể Voldermort'
//     },
//     {
//         id: 3,
//         title: 'Tiếng Việt 1 tập 1',
//         cover: 'https://cdn0.fahasa.com/media/catalog/product/cache/1/small_image/400x400/9df78eab33525d08d6e5fb8d27136e95/i/m/image_146114.jpg',
//         basePrice: '10000đ',
//         detail: 'Sách tiếng việt tập 1'
//     },
//     {
//         id: 4,
//         title: 'Mắt Biếc',
//         cover: 'https://cdn0.fahasa.com/media/catalog/product/cache/1/small_image/400x400/9df78eab33525d08d6e5fb8d27136e95/m/a/mat-biec_bia-mem_in-lan-thu-44.jpg',
//         basePrice: '45000đ',
//         detail: 'Mắt biếc là một tác phẩm được nhiều người bình chọn là hay nhất của nhà văn Nguyễn Nhật Ánh. Tác phẩm này cũng đã được dịch giả Kato Sakae dịch sang tiếng Nhật để giới thiệu với độc giả Nhật Bản.'
//     },
// ]

exports.list = async () => {
    const bookCollection=db().collection('books');
    books=await bookCollection.find().toArray();
    return books;
};

exports.get=async(id)=>{
    const bookCollection=db().collection('books');
    const book= await bookCollection.findOne({_id:ObjectId(id)});
    return book;
}

