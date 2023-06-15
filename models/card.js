const path = require('path');
const fs = require('fs');

const p = path.join(
    path.dirname(process.mainModule.filename),
    'data',
    'card.json'
);

class Card {
    static async fetch() {
        return new Promise((resolve, reject) => {
            fs.readFile(p, 'utf-8', (err, content) => {
                if (err) reject(err);
                resolve(JSON.parse(content));
            });
        });
    }
    static async add(course) {
        const card = await Card.fetch();
        const indx = card.courses.findIndex((item) => item.id === course.id);
        const candidate = card.courses[indx];

        if (candidate) {
            candidate.count++;
        } else {
            course.count = 1;
            card.courses.push(course);
        }
        card.price += +course.price;
        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), (err) => {
                if (err) reject(err);
                resolve();
            });
        });
    }
    static async remove(id) {
        const card = await Card.fetch();
        const indx = card.courses.findIndex((item) => item.id === id);
        const course = card.courses[indx];

        if (course.count === 1) {
            card.courses = card.courses.filter((c) => c.id !== id);
        } else {
            card.courses[indx].count--;
        }

        card.price -= course.price;

        return new Promise((resolve, reject) => {
            fs.writeFile(p, JSON.stringify(card), (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(card);
                }
            });
        });
    }
}

module.exports = Card;
