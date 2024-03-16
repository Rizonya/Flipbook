<template>
  <!-- wide screen view -->
  <div class="view-wrapper" v-if="viewportWidth > 1200">
    <div class="slider-container">
    <input type="range" min="0" :max="images.length" v-model="sliderValue" class="slider" @input="handleChange">
    <p>{{ pages.length>1 ? 'Страницы' : 'Страница' }} {{ pages }}</p>
  </div>
    <div class="flip-book-wrapper">
      <button class="prev-pager" v-if="currentPage > 1" @click="prevPage">
        <img :src="'/prev.png'" alt="">
      </button>
      <fw-turn ref="flipbook" class="magazine" v-if="images.length > 0" :options="options">
        <div @click="nextPage" v-bind:class="{
          'hard': image.pageNumber == 1 || image.pageNumber == 2 || image.pageNumber == images.length || image.pageNumber == images.length + 1
        }" v-for="image in images" :key="image.pageNumber">
          <img class="page_image" :class="{ 'zoom': isZoom }" :src="image.pageLink"
            :alt="'Страница ' + image.pageNumber" />
        </div>
      </fw-turn>
      <button class="next-pager" v-if="currentPage < images.length" @click="nextPage">
        <img :src="'/next.png'" alt="">
      </button>
      <div class="share-button-wrapper">
        <button class="share-button" @click="copyUrlToClipboard">Поделиться</button>
        <div class="notification" v-show="showNotification">{{ notificationText }}</div>
      </div>

    </div>
    <!-- <div class="button-wrapper">
      <button @click="flipbookZoom">
      <img :src="zoomImage" alt="" srcset="">
    </button>
    
  </div> -->
  </div>
  <!-- not so wide screen view -->
  <div class="view-wrapper" v-else>
    <div class="flip-book-wrapper">

      <fw-turn ref="flipbook" class="magazine" v-if="images.length > 0" :options="options">
        <div @click="nextPage" v-bind:class="{
          'hard': image.pageNumber == 1 || image.pageNumber == 2 || image.pageNumber == images.length || image.pageNumber == images.length + 1
        }" v-for="image in images" :key="image.pageNumber">
          <img class="page_image" loading="lazy" :class="{ 'zoom': isZoom }" :src="image.pageLink"
            :alt="'Страница ' + image.pageNumber" />
        </div>
      </fw-turn>


    </div>
    <div class="button-wrapper">
      <!-- <button @click="flipbookZoom">
      <img :src="zoomImage" alt="" srcset="">
    </button> -->
      <button class="prev-pager" v-if="currentPage > 1" @click="prevPage">
        <img :src="'/prev.png'" alt="">
      </button>
      <button class="next-pager" @click="nextPage">
        <img :src="'/next.png'" alt="">
      </button>

    </div>
  </div>
</template>
<script>

export default {

  data() {
    return {
      isZoom: false,
      viewportWidth: window.innerWidth,
      audio: new Audio("/flip.mp3"),
      images: [],
      currentPage: 1,
      pages:'1',
      sliderValue:0,
      showNotification: false,
      notificationText: '',

      options: {
        acceleration: true,
        elevation: 1000,
        autoCenter: true,
        duration: 900,
        display: window.innerWidth > 1200 ? "double" : "single",
        when: {
          turning: (event, page, pageObj) => {
            this.currentPage = page;
            this.$router.replace({ query: { ...this.$route.query, page } })
            this.$route.query.page = page
            this.audio.play();
            this.pages =  pageObj.includes(0) ? page : pageObj.join('-')
            this.sliderValue = page
          }
        }
      }
    }
  },
  methods: {
    /**
 * Fetches images from the server and updates the 'images' data property.
 *
 * @return {void}
 */
    async fetchImages() {
      this.images = [];
      fetch('https://test.belinkaluga.ru/api/book/' + this.$route.params.name)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          this.images = data.pageLinks.map(page => {
            return {
              pageNumber: page.pageNumber,
              pageLink: page.pageLink
            };
          })
          console.log(this.images[0].pageLink);
          console.log(data);
        })
        .catch(error => {

          console.error('Error:', error);
        });
    },
    /**
 * Moves to the previous page in the flipbook.
 *
 * @return {void}
 */
 handleChange(){
  this.$refs.flipbook.goTo(this.sliderValue)
 },
    prevPage() {
      const component = this.$refs.flipbook;
      if (this.viewportWidth > 1200) {
        component.goTo(this.currentPage % 2 == 0 ? this.currentPage - 1 : this.currentPage - 2);
      } else {
        component.goTo(this.currentPage - 1)
      }
    },
    /**
 * Copies the current URL to the clipboard and displays a notification.
 *
 * @return {void} 
 */
    copyUrlToClipboard() {
      const url = window.location.href;
      navigator.clipboard.writeText(url).then(() => {
        this.showNotification = true;
        this.notificationText = 'URL скопирован в буфер обмена';
        setTimeout(() => {
          this.showNotification = false;
        }, 3000);
      });
    },
    /**
     * Navigates to the next page in the flipbook.
     *
     * @return {undefined} No return value.
     */
    nextPage() {
      const component = this.$refs.flipbook;
      if (this.viewportWidth > 1200) {
        console.log(this.currentPage);

        component.goTo(this.currentPage % 2 == 0 ? this.currentPage + 2 : this.currentPage + 1)
      } else {
        component.goTo(this.currentPage + 1)
      }

    },
    flipbookZoom() {
      const component = this.$refs.flipbook;
      console.log(component);
      if (this.isZoom) {
        component.zoom(1);
      } else {
        component.zoom(1.2)
      }
      this.isZoom = !this.isZoom;
    },
    handleResize() {
      this.viewportWidth = window.innerWidth
      const component = this.$refs.flipbook;
      component.forceRerender(component.defaultOptions)
    }
  },
  computed: {
    zoomImage() {
      return this.isZoom ? '/search-minus.svg' : '/search-plus.svg'
    },
    pageWowel(){
      return pages.length>1 ? 'Страницы' : 'Страница'
    }
  },
  mounted() {
    let actionExecuted = false;
    let startPointX = 0;
    const threshold = 100;
    this.fetchImages().then(() => {
      if (this.$route.query.page) {
        setTimeout(() => {
          this.$refs.flipbook.goTo(this.$route.query.page);
        }, 500);
      }
    });

    const handleResize = () => {
      // handle resize logic here
    };

    const handleTouchStart = (event) => {
      startPointX = event.touches[0].clientX;
      actionExecuted = false;
    };

    const handleTouchMove = (event) => {
      if (actionExecuted) {
        return;
      }
      const currentX = event.touches[0].clientX;
      const distanceX = currentX - startPointX;

      if (distanceX > threshold) {
        this.prevPage();
        actionExecuted = true;
      } else if (distanceX < -threshold) {
        this.nextPage();
        actionExecuted = true;
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === 'VolumeUp') {
        this.prevPage();
      } else if (event.key === 'VolumeDown') {
        this.nextPage();
      }
      if (event.key === 'ArrowLeft') {
        this.prevPage();
      } else if (event.key === 'ArrowRight') {
        this.nextPage();
      }
    };

    const handleButtonTouchStart = (button, nextPageFn) => {
      let intervalId;

      button.addEventListener('touchstart', () => {
        intervalId = setInterval(nextPageFn, 100);
      });

      button.addEventListener('touchend', () => {
        clearInterval(intervalId);
      });
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('keydown', handleKeyDown);

    const prevButton = document.querySelector('.prev-pager');
    const nextButton = document.querySelector('.next-pager');

    handleButtonTouchStart(prevButton, this.prevPage);
    handleButtonTouchStart(nextButton, this.nextPage);
  }

}
</script>
  
<style scoped>
.share-button-wrapper {
  position: fixed;
  top: 10px;
  right: 10px;
  z-index: 9999;
}

.share-button {
  padding: 10px;
  background-color: #f2f2f2;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.notification {
  position: fixed;
  bottom: 10px;
  right: 10px;
  padding: 10px;
  background-color: #f2f2f2;
  border-radius: 4px;
  display: block;
}

.slider-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.2);
  opacity: 0.3;
  transition: opacity 0.5s;
  z-index: 9999;
}

.slider-container:hover {
  opacity: 1;
}

.slider {
  width: 100%;
  height: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  transition: opacity 0.5s;
}

.slider:hover {
  opacity: 1;
}

.slider::-webkit-slider-thumb {
  appearance: none;
  width: 15px;
  height: 15px;
  background-color: #3d3d3d;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  background-color: #3d3d3d;
  border-radius: 50%;
  cursor: pointer;
}
.view-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  user-select: none;
}

.button-wrapper {
  position: absolute;
  width: 10%;
  right: 0;
  height: 4%;
  display: flex;
  flex-direction: row;
}

.hard {
  background: white;
  width: 110%;
  height: 110%;
}

.page {
  background-color: white;
}

.flip-book-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
}

.page_image {
  width: 100%;
  background-color: white;
  height: 100%;
  object-fit: fill;
  z-index: 0;
}

.odd {
  box-shadow: inset 100px 0px 92px -100px #000000;
}

.even {
  display: block;
  z-index: 1;
  box-shadow: inset -100px 0px 92px -100px #000000;
}

.magazine {
  height: 100vh;
  width: 75vw;
  transition: margin 0.5s;
}

@media(width<1200px) {
  .magazine {
    height: 80%;
    width: 100%;
    max-width: 800px;
    transition: margin 0.5s;
    z-index: 0;
  }

  .view-wrapper {
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    user-select: none;
  }

  .flip-book-wrapper {
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  button>img {
    width: 100px;
    height: 100px;
  }

  button {
    width: 100px;
    height: 100px;
  }

  .prev-pager {
    float: left;
  }

  .next-pager {
    float: right;
  }

  .button-wrapper {
    display: block;
    position: relative;
    width: 100%;
    height: 100px;
  }

}

button {
  padding: 5px;
  border-radius: 10px;
}

.next-pager {
  align-self: flex-end;
  margin-bottom: 10vh;
  margin-left: 2vw;
}

.prev-pager {
  align-self: flex-end;
  margin-bottom: 10vh;
  margin-right: 2vw;

}

button>img {
  width: 20px;
  height: 20px;
}
@media(prefers-color-scheme: dark) {
  .notification {
  position: fixed;
  bottom: 10px;
  right: 10px;
  padding: 10px;
  background-color: #525252;
  border-radius: 4px;
  display: block;
}
.slider::-webkit-slider-thumb {
  appearance: none;
  width: 15px;
  height: 15px;
  background-color: #888888;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-thumb {
  width: 15px;
  height: 15px;
  background-color: #888888;
  border-radius: 50%;
  cursor: pointer;
}
}
</style>