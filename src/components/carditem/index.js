import css from "./style.css"
import refs from "../../refs/index.js"
import templateCardItem from "./templateCardItem.hbs"
import services from "../services/index.js"
import store from "../store/index.js"
import productCard from "../product-card/index.js"

// поиск элемента куда нужно встроить "ul"
const divMain = refs.main.querySelector(".container")
const cardList = document.createElement("ul")
cardList.classList.add("card-list")
cardList.classList.add("list")
divMain.append(cardList)

// авторизация на сайте
services.loginUser("mango12345@gmail.com", "qwerty12345");

// setTimeout(() => {
// }, 1000);
// services.searchProducts("", "ref", "5").then(data => {
//     cardItem(data, cardList)
// })


// при вызове функции:
// первым параметром нужно передать (data) - промисс полученый в .then
// вторым параметром нужно передать (where) - элемент в который нужно карточки
// третий НЕОБЯЗАТЕЛЬНЫЙ (sale) - передать true что бы отобразить цену до скидки
// export не дефолтный
export const cardItem = (data, where, sale = false) => {
    // const salePrice = sale ? data.map(item => ({ ...item, sale: item.price + 10 % })) : " ";
    const item = templateCardItem(data)
    // место куда нужно вставить where 
    // where.innerHTML = item
    where.insertAdjacentHTML('beforeend', item)
    //слушатель на иконку для смены иконки
    // и записи на бек в массив favorit
    where.addEventListener("click", (e) => {
        let id = e.target.dataset.id

        // console.log(id);
        if (e.target.classList.contains("icon-box-favorit")) {
            e.target.classList.toggle("icon-box-favorit-full")
        }
        if (e.target.classList.contains("icon-box-favorit-full")) {
            // взяли id объекта
            let element = mapArray(data, id)
            services.addFavoriteProduct(element)
        }
        if (!e.target.classList.contains("icon-box-favorit-full") && e.target.nodeName === "SPAN") {
            let element = mapArray(data, id)
            services.removeFavoriteProduct(element._id)
        }

    }
    )
}
// функция поиска выбранного элемента по сердечку
function mapArray(ar, id) {
    return ar.find((elem) => elem._id === id)
}
