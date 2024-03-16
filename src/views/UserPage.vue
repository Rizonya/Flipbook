<template>
    <div>
        <div class="user-profile">
            <div class="user-info">
                <img :src="user.avatar" class="avatar" alt="User Avatar" />
                <h2>{{ user.name }}</h2>
            </div>
            <div class="data-table">
                <table v-if="books.length>0">
                    <thead>
                        <tr>
                            <th colspan="3">
                                <h2>Книги, не возвращенные</h2>
                            </th>
                        </tr>
                        <tr>
                            <th>Описание</th>
                            <th>Дата получения</th>
                            <th>Предполагаемая дата возврата</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in books" :key="item.index">
                            <td>{{ item.description }}</td>
                            <td>{{ formatDate(item.dateGiven) }}</td>
                            <td>{{ formatDate(item.dateExpected) }}</td>
                        </tr>
                    </tbody>
                </table>
                <div v-else>
                    <h2>Вы еще не взяли ни одной книги</h2>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../store';

export default {
    data() {
        return {
            user: {
                name: "Andrey Shafar",
                avatar: 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.wU-18EN3JZEVEkj6S07isAHaHa%26pid%3DApi&f=1&ipt=49fc48289c83e644d5ac496c15cd14f7f5c1176bc0c3327741974f1d3ef33b4d&ipo=images'
            },
            books: []        }
    },
    methods: {
        /**
         * Formats the given date string into a human-readable date in Russian format.
         *
         * @param {string} date - The date string to be formatted
         * @return {string} The formatted date string in Russian format
         */
        formatDate(date) {
            let year = date.slice(0, 4);
            let month = date.slice(4, 6);
            let day = date.slice(6, 8);
            let formattedDate = new Date(`${year}-${month}-${day}`);
            let options = { year: 'numeric', month: 'long', day: 'numeric' };
            return formattedDate.toLocaleDateString('ru-RU', options);
        },
    },
    mounted() {
        const userStore = useUserStore();
        console.log(userStore);
        this.user.name = userStore.getName;
        this.books = userStore.getBooks;
    }
}
</script>

<style>
.user-profile {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #2f2f2f;
    border-radius: 10px;
    padding: 20px;
    background-color: #fff;
    margin: 20px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
}

.user-info {
    margin-right: 20px;
    flex: 2;
    border-right: 2px solid #fff;
}

.data-table td,
.data-table th {
    text-align: center;
}

.data-table {
    display: inline-block;
    flex: 4;
}

@media (prefers-color-scheme: dark) {
    .user-profile {
        background-color: #2f2f2f;
        border-color: #2f2f2f;
    }
}

.avatar {
    width: 100px;
    height: 100px;
    border-radius: 50%;
}
</style>