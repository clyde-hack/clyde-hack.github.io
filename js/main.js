const cardFrag = document.createDocumentFragment();
const cardEle = document.createElement('div');
cardEle.className = 'card';
cardEle.innerHTML = `<img src="" alt="User Avatar">
                     <h3></h3>
                     <a href="" title=""></a>`;
cardFrag.appendChild(cardEle);

const pageLinkFrag = document.createDocumentFragment();
const pageLinkEle = document.createElement('a');
pageLinkEle.className = 'paginate__link';
pageLinkFrag.appendChild(pageLinkEle);

let page = 1;

loadCards();

function loadCards() {
	while (document.querySelector('.cards').hasChildNodes()) {
		document.querySelector('.cards').firstElementChild.remove();
	}

	while (document.querySelector('.paginate').hasChildNodes()) {
		document.querySelector('.paginate').firstElementChild.remove();
	}

	fetchUsers().then((results) => {
		results.data.forEach((item) => {
			const user = new User(item.first_name, item.last_name, item.email, item.avatar);
			const card = cardFrag.cloneNode(true).firstChild;

			card.querySelector('img').setAttribute('src', user.avatar);
			card.querySelector('h3').innerHTML = user.fullName();
			card.querySelector('a').setAttribute('href', `mailto:${user.email}`);
			card.querySelector('a').setAttribute('title', user.email);
			card.querySelector('a').innerHTML = user.email;

			document.querySelector('.cards').append(card);
		});

		if (results.total_pages > 1) {
			for (i = 0; i < results.total_pages; i++) {
				const pageItem = pageLinkFrag.cloneNode(true).firstChild;

				pageItem.setAttribute('href', '#');
				pageItem.innerHTML = i + 1;

				if (page === i + 1) {
					pageItem.classList.add('active');
				}

				pageItem.addEventListener('click', (e) => {
					e.preventDefault();
					page = +pageItem.innerHTML;
					loadCards();
				});

				document.querySelector('.paginate').append(pageItem);
			}
		}
	});
}

class User {
	constructor(firstName, lastName, email, avatar) {
		this.firstName = firstName;
		this.lastName = lastName;
		this.email = email;
		this.avatar = avatar;
	}

	fullName() {
		return `${this.firstName} ${this.lastName}`;
	}
}

async function fetchUsers() {
	const response = await fetch(`https://reqres.in/api/users?per_page=3&page=${page}`);
	const results = await response.json();
	return results;
}
