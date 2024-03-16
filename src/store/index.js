// store/index.js
import { createPinia, defineStore } from "pinia";

const pinia = createPinia();

export const useUserStore = defineStore({
  id: "UserInfo",
  state: () => ({
    id: "",
    name: "",
    books: [],
  }),
  getters: {
    /**
     * Get the id of the user.
     * @returns {string|number}
     */
    getId() {
      return this.id;
    },
    /**
     * Get the name of the user.
     * @returns {string}
     */
    getName() {
      return this.name;
    },
    /**
     * Get the books of the user.
     * @returns {array<string>}
     */
    getBooks() {
      return this.books;
    },
  },
  actions: {
    /**
     * Sets a new id for the object.
     *
     * @param {string|number} id - The new id to be set.
     * @return {void}
     */
    setId(id) {
      this.id = id;
    },
    /**
     * Sets the name of the object.
     *
     * @param {string} name - The new name to be set.
     * @return {void}
     */
    setName(name) {
      this.name = name;
    },
    /**
     * Set the books for the instance.
     *
     * @param {array<string>} books - The array of books to be set.
     */
    setBooks(books) {
      this.books = books;
    },
  },
});

export default pinia;
