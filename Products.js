"use strict";

const pageData = new Vue({
  el: "#app",
  data: {
    sitename: "List of Lessons",
    confirmationMessage: "",
    lessons: [],
    dummyLessons: [
      {
        id: 0,
        title: "After School Class",
        classType: "Maths",
        location: "London",
        price: 100,
        spaces: 5,
        image: "src/assets/Maths_Icon.png",
        imageAlt: "Maths Icon",
      },
      {
        id: 1,
        title: "Computer Class",
        classType: "Computer Science",
        location: "London",
        price: 120,
        spaces: 5,
        image: "src/assets/Maths_Icon.png",
        imageAlt: "Maths Icon",
      },
      {
        id: 2,
        title: "English Class",
        classType: "English",
        location: "London",
        price: 90,
        spaces: 5,
        image: "src/assets/Maths_Icon.png",
        imageAlt: "Maths Icon",
      },
      {
        id: 3,
        title: "Chess Lesson",
        classType: "Chess",
        location: "London",
        price: 140,
        spaces: 5,
        image: "src/assets/Maths_Icon.png",
        imageAlt: "Maths Icon",
      },
      {
        id: 4,
        title: "Maths Lesson",
        classType: "Maths",
        location: "London",
        price: 110,
        spaces: 5,
        image: "src/assets/Maths_Icon.png",
        imageAlt: "Maths Icon",
      },
      {
        id: 5,
        title: "History Lesson",
        classType: "History",
        location: "London",
        price: 100,
        spaces: 5,
        image: "src/assets/Maths_Icon.png",
        imageAlt: "Maths Icon",
      },
      {
        id: 6,
        title: "Electrical Engineering Class",
        classType: "Electrical Engineering",
        location: "London",
        price: 200,
        spaces: 5,
        image: "src/assets/Maths_Icon.png",
        imageAlt: "Maths Icon",
      },
      {
        id: 7,
        title: "Chemistry Class",
        classType: "Chemistry",
        location: "London",
        price: 160,
        spaces: 5,
        image: "src/assets/Maths_Icon.png",
        imageAlt: "Maths Icon",
      },
      {
        id: 8,
        title: "Computer Science Class",
        classType: "Computer Science",
        location: "London",
        price: 180,
        spaces: 5,
        image: "src/assets/Maths_Icon.png",
        imageAlt: "Maths Icon",
      },
      {
        id: 9,
        title: "Geography Class",
        classType: "Geography",
        location: "London",
        price: 110,
        spaces: 5,
        image: "src/assets/Maths_Icon.png",
        imageAlt: "Maths Icon",
      },
    ],
    cart: [],
    sortType: "id",
    sortAscending: true,
    searchInput: "",
    checkoutPage: false,
    checkoutName: "",
    checkoutTelephone: "",
    searchLocal: false,
    localURL: "http://localhost:8080",
    globalURL: "https://cst3144-coursework-express.onrender.com",
  },
  methods: {
    canAddToCart: function (lesson) {
      return lesson.spaces > 0;
    },
    canRemoveFromCart: function (lesson) {
      return lesson.spaces < 5;
    },
    cartNotEmpty: function () {
      if (this.cart.length > 0) {
        return true;
      } else {
        return false;
      }
    },
    addToCart: function (lessonId) {
      const lesson = this.lessons.find((lesson) => lesson.id === lessonId);
      if (lesson && this.canAddToCart(lesson)) {
        const lessonCopy = { ...lesson };
        let lessonExists = false;
        let lessonIndex;
        lesson.spaces--;
        lessonCopy.spaces--;
        for (let i = 0; i < this.cart.length; i++) {
          if (this.cart[i].id === lessonCopy.id) {
            lessonExists = true;
            lessonIndex = i;
            break;
          }
        }
        if (!lessonExists) {
          this.cart.push(lessonCopy);
        } else {
          this.cart.splice(lessonIndex, 1);
          this.cart.push(lessonCopy);
        }
        console.log(this.lessons);
        console.log(this.cart);
      }
    },
    removeFromCart: function (lessonId) {
      const lesson = this.lessons.find((lesson) => lesson.id === lessonId);
      const lessonCopy = this.cart.find((lesson) => lesson.id === lessonId);
      if (lesson.spaces < 5) {
        lesson.spaces++;
        lessonCopy.spaces++;
      }
    },
    removeAllFromCart: function (lessonId) {
      const lesson = this.lessons.find((lesson) => lesson.id === lessonId);
      const lessonCopy = this.cart.find((lesson) => lesson.id === lessonId);
      if (lesson.spaces < 5) {
        lesson.spaces = 5;
        lessonCopy.spaces = 5;
      }
    },
    displayCart: function () {
      for (let i = 0; i < this.cart.length; i++) {
        console.log("ID: " + this.cart[i].id + " Price: " + this.cart[i].price);
        if (this.cart[i].spaces > 4) {
          this.cart.splice(i, 1);
        }
      }
      this.checkoutPage = !this.checkoutPage;
      this.switchPage();
    },
    switchPage: function () {
      const lessonsPages = [];
      const sortControls = document.getElementById("sortControls");
      const searchBarContainer = document.getElementById("searchBarContainer");
      const lessonsList = document.getElementById("lessonsList");
      const checkoutList = document.getElementById("checkoutList");
      lessonsPages.push(sortControls);
      lessonsPages.push(searchBarContainer);
      lessonsPages.push(lessonsList);
      if (this.checkoutPage) {
        console.log(true);
        for (let i = 0; i < lessonsPages.length; i++) {
          lessonsPages[i].style.display = "none";
        }
        checkoutList.style.display = "block";
      } else {
        console.log(false);
        for (let i = 0; i < lessonsPages.length - 1; i++) {
          lessonsPages[i].style.display = "block";
        }
        lessonsPages[2].style.display = "grid";
        checkoutList.style.display = "none";
      }
    },
    confirmOrder: function () {
      for (let i = 0; i < this.cart.length; i++) {
        if (this.cart[i].spaces > 4) {
          this.cart.splice(i, 1);
        }
        this.cart[i].quantity = 5 - this.cart[i].spaces;
      }
      const order = {
        name: this.checkoutName,
        telephoneNumber: this.checkoutTelephone,
        cart: this.cart,
      };
      let instruction;
      this.submitOrder(JSON.stringify(order));
      for (let i = 0; i < this.cart.length; i++) {
        instruction = {
          searchTerm: {
            id: this.cart[i].id,
          },
          updateParameter: {
            $set: {
              spaces: this.cart[i].spaces,
            },
          },
        };
        this.updateLesson(JSON.stringify(instruction));
      }
      console.log("Order confirmed.");
      this.confirmationMessage = "Order confirmed.";
    },
    submitOrder: async function (order) {
      try {
        const response = await fetch(`${this.globalURL}/orders`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: order,
        });
        const result = await response.json();
        console.log(result);
      } catch (err) {
        console.log("Error.");
      }
    },
    updateLesson: async function (lesson) {
      try {
        const response = await fetch(`${this.globalURL}/lessons`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: lesson,
        });
        const result = await response.json();
        console.log(result);
      } catch (err) {
        console.log("Error.");
      }
    },
    search() {
      if (this.searchLocal) {
        return this.searchClient();
      } else {
        this.searchServer();
      }
    },
    searchClient() {
      const searchInput = this.searchInput;
      function checkItem(item) {
        return (
          item.title.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.classType.toLowerCase().includes(searchInput.toLowerCase()) ||
          item.location.toLowerCase().includes(searchInput.toLowerCase()) ||
          JSON.stringify(item.price).includes(searchInput.toLowerCase()) ||
          JSON.stringify(item.spaces).includes(searchInput.toLowerCase())
        );
      }
      return this.lessons.filter(checkItem);
    },
    async searchServer() {
      try {
        const response = await fetch(
          `http://localhost:8080/search?q=${this.searchInput}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        const result = await response.json();
        console.log(result);
        this.lessons = result;
      } catch (error) {
        console.log("Error.");
      }
    },
  },
  computed: {
    sortedLessons() {
      let type = this.sortType;
      try {
        this.sortAscending = JSON.parse(this.sortAscending);
      } catch (error) {}
      function compare(a, b) {
        if (type === "id") {
          if (a.id > b.id) {
            return 1;
          }
          if (a.id < b.id) {
            return -1;
          }
        } else if (type === "title") {
          if (a.title > b.title) {
            return 1;
          }
          if (a.title < b.title) {
            return -1;
          }
        } else if (type === "price") {
          if (a.price > b.price) {
            return 1;
          }
          if (a.price < b.price) {
            return -1;
          }
        } else if (type === "location") {
          if (a.location > b.location) {
            return 1;
          }
          if (a.location < b.location) {
            return -1;
          }
        } else if (type === "classType") {
          if (a.classType > b.classType) {
            return 1;
          }
          if (a.classType < b.classType) {
            return -1;
          }
        } else if (type === "spaces") {
          if (a.spaces > b.spaces) {
            return 1;
          }
          if (a.spaces < b.spaces) {
            return -1;
          }
        }
        return 0;
      }
      if (this.sortAscending) {
        return this.lessons.sort(compare);
      } else {
        return this.lessons.sort(compare).reverse();
      }
    },
    filteredCart() {
      const returnCart = [...new Set(this.cart)];
      return returnCart;
    },
    isFormValid() {
      const letterRegularExpression = /^[A-Za-z]+$/;
      const numberRegularExpression = /^\d+$/;
      return (
        this.checkoutName.trim() !== "" &&
        this.checkoutTelephone.trim() !== "" &&
        letterRegularExpression.test(this.checkoutName) &&
        numberRegularExpression.test(this.checkoutTelephone)
      );
    },
  },
  created: async function retrieveLessons() {
    try {
      const response = await fetch(`${this.globalURL}/lessons`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const result = await response.json();
      console.log(result);
      this.lessons = result;
      if (result == undefined) {
        errorMessage = "No lessons found.";
        console.log(errorMessage);
      }
      return result;
    } catch (err) {
      console.log("Error.");
    }
  },
});

//Maths icon source: <a target="_blank" href="https://icons8.com/icon/QM0dP5g8D4UH/math">Math</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//English icon source: <a target="_blank" href="https://icons8.com/icon/shCl9WoAcTSQ/english-language">English Language</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//Computer icon source: <a target="_blank" href="https://icons8.com/icon/x96urEIUGUBd/computer">Computer</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//Geography icon source: <a target="_blank" href="https://icons8.com/icon/43164/earth-globe">Geography</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//Electrical engineering icon source: <a target="_blank" href="https://icons8.com/icon/1bDkft42EP0K/electrical">Electrical</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//Chess icon source: <a target="_blank" href="https://icons8.com/icon/qYPfEYiRyUha/chesspiece">Chesspiece</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//History icon source: <a target="_blank" href="https://icons8.com/icon/b8XZx9M6aR0i/history">History</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
//Chemistry icon source: <a target="_blank" href="https://icons8.com/icon/58776/periodic-table-of-elements">Chemistry</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>