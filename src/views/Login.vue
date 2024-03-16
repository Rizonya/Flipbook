<template>
  <div class="login-form" lang="ru">
    <h2>Вход</h2>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Имя пользователя</label>
        <input type="text" v-model="username" placeholder="Имя пользователя">
      </div>
      <div class="form-group">
        <label>Пароль</label>
        <input type="password" v-model="password" placeholder="Пароль">
        <span v-if="!isPasswordValid && isSubmitClicked" class="error-message">Пароль не соответствует требованиям:</span>

        <ul v-if="!isPasswordValid && isSubmitClicked" class="password-requirements">
          <li v-for="requirement in passwordRequirements" :key="requirement"
            :class="{ 'error-message': !isRequirementMet(requirement), 'success-message': isRequirementMet(requirement) }">
            {{ requirement }}
          </li>
        </ul>

        <span v-if="isPasswordValid && isSubmitClicked" class="success-message">Пароль соответствует всем
          требованиям</span>
      </div>
      <button type="submit">Отправить</button>
    </form>
  </div>
</template>
<script>
import { useUserStore } from '../store';

export default {
  data() {
    return {
      username: '',
      store : useUserStore(),
      password: '',
      isSubmitClicked: false,
      passwordRequirements: [
        'Должен содержать как минимум 8 символов',
        'Должен содержать как минимум одну заглавную букву',
        'Должен содержать как минимум одну строчную букву',
        'Должен содержать как минимум одну цифру',
        'Должен содержать как минимум один специальный символ'
      ]
    };
  },
  computed: {
    isPasswordValid() {
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&,_|<>]).{8,}$/;
      return regex.test(this.password);
    }
  },
  methods: {
    handleSubmit() {
      // Проверка требований пароля и выполнение других действий по обработке формы;
      this.isSubmitClicked = true;
  
      if (this.isPasswordValid) {
        let formData = new FormData();
        formData.append('username', this.username);
        formData.append('password', this.password);
        fetch('http://localhost:5000/api/user/login', {
          method: 'POST',
          body: formData
          }).then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          }).then(data => {
            const userStore = this.store;
            userStore.setBooks(data.reader.visits);
            userStore.setName(data.reader.fullName);
            userStore.setId(data.reader.id);
            console.log(userStore);
            console.log(data);      
            this.$router.push('/user');      
          })
        }
      },
      /**
     * Validates the password using a regular expression.
     *
     * @return {boolean} true if the password is valid, false otherwise
     */
    validatePassword() {
      const regex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&,_|<>]).{8,}$/;
      return regex.test(this.password);
    },
        /**
     * Check if the given requirement is met.
     *
     * @param {string} requirement - The requirement to check.
     * @return {boolean} - True if the requirement is met, false otherwise.
     */
    isRequirementMet(requirement) {
      switch (requirement) {
        case 'Должен содержать как минимум 8 символов':
          return this.password.length >= 8;
        case 'Должен содержать как минимум одну заглавную букву':
          return /[A-Z]/.test(this.password);
        case 'Должен содержать как минимум одну строчную букву':
          return /[a-z]/.test(this.password);
        case 'Должен содержать как минимум одну цифру':
          return /\d/.test(this.password);
        case 'Должен содержать как минимум один специальный символ':
          return /[!@#$%^&,_|<>]/.test(this.password);
        default:
          return false;
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;700&display=swap');

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-radius: 8px;
  max-width: 400px;
  background-color: #fff;
  margin: 0 auto;
  font-family: 'Open Sans', sans-serif;
}

h2 {
  font-family: 'Open Sans', sans-serif;
  margin-bottom: 20px;
}

.success-message {
  color: green;
  font-size: 12px;
  margin-top: 5px;
}

.form-group {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
}

label {
  margin-bottom: 5px;
  font-family: 'Open Sans', sans-serif;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-family: 'Open Sans', sans-serif;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 10px;
  font-family: 'Open Sans', sans-serif;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  font-family: 'Open Sans', sans-serif;
}

@media (prefers-color-scheme: dark) {
  .login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #2f2f2f;
    padding: 40px 30px 40px 30px;
    border-radius: 8px;
    max-width: 600px;
    margin: 0 auto;
    font-family: 'Open Sans', sans-serif;
  }

  input {
    background-color: #2f2f2f;
    color: white;
    border: 1px solid #555;
    font-family: 'Open Sans', sans-serif;
  }

  label {
    margin-bottom: 5px;
    font-family: 'Open Sans', sans-serif;
  }

  h2 {
    font-family: 'Open Sans', sans-serif;
  }
}</style>