const toCurrency = (price) => {
    console.log(price);
    return new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency',
    }).format(price);
};
const toDate = (date) => {
    return new Intl.DateTimeFormat('ru-RU', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(new Date(date));
};

document.querySelectorAll('.date').forEach((node) => {
    node.textContent = toDate(node.textContent);
});

document.querySelectorAll('.price').forEach((node) => {
    node.textContent = new Intl.NumberFormat('ru-RU', {
        currency: 'rub',
        style: 'currency',
    }).format(node.textContent);
});

const $card = document.querySelector('#card');
if ($card) {
    $card.addEventListener('click', (event) => {
        if (event.target.classList.contains('remove-btn')) {
            const id = event.target.dataset.id;
            const csrf = event.target.dataset.csrf;
            fetch('/card/remove/' + id, {
                method: 'delete',
                headers: {
                    'X-XSRF-TOKEN': csrf,
                },
            })
                .then((res) => res.json())
                .then((card) => {
                    if (card.courses.length) {
                        const html = card.courses
                            .map((item) => {
                                return `<tr>
                        <td>${item.title}</td>
                        <td>${item.count}</td>
                        <td>${item.price}</td>
                        <td><button
                                class='btn btn-small remove-btn'
                                data-id='${item.id}'
                            >Удалть</button></td>
                    </tr>`;
                            })
                            .join('');
                        $card.querySelector('tbody').innerHTML = html;
                        $card.querySelector('.price').textContent = toCurrency(
                            card.price
                        );
                    } else {
                        $card.innerHTML = '<p>Корзина пуста</p>';
                    }
                })
                .catch((e) => console.log(e));
        }
    });
}

M.Tabs.init(document.querySelectorAll('.tabs'));
