// const uuid = require('uuid/v4');
// const fs = require('fs');
// const path = require('path');

// class Course {
//     constructor(title, price, img) {
//         this.title = title;
//         this.price = price;
//         this.img = img;
//         this.id = uuid();
//     }

//     toJSON() {
//         return {
//             title: this.title,
//             price: this.price,
//             img: this.img,
//             id: this.id,
//         };
//     }

//     async save() {
//         const courses = await Course.getAll();
//         courses.push(this.toJSON());

//         return new Promise((resolve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve();
//                     }
//                 }
//             );
//         });
//     }
//     static async uppDate(course) {
//         const courses = await Course.getAll();
//         const index = courses.findIndex((item) => item.id === course.id);
//         console.log(course);
//         courses[index] = course;
//         return new Promise((resoleve, reject) => {
//             fs.writeFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 JSON.stringify(courses),
//                 (err) => {
//                     if (err) reject(err);
//                     resoleve();
//                 }
//             );
//         });
//     }

//     static getAll() {
//         return new Promise((resolve, reject) => {
//             fs.readFile(
//                 path.join(__dirname, '..', 'data', 'courses.json'),
//                 'utf-8',
//                 (err, content) => {
//                     if (err) {
//                         reject(err);
//                     } else {
//                         resolve(JSON.parse(content));
//                     }
//                 }
//             );
//         });
//     }
//     static async getAllById(id) {
//         const data = await Course.getAll();
//         return data.find((item) => item.id === id);
//     }
// }

// module.exports = Course;

//-----------------------method of mongoose--------------------------------------------------

const { Schema, model } = require('mongoose');

const courseSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    img: { type: String },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
});

courseSchema.method('toClient', function () {
    const course = this.toObject();
    course.id = course._id;
    delete course._id;

    return course;
});

module.exports = model('Course', courseSchema);
