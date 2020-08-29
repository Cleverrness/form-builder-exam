<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/NewForm">Add New Form</router-link> |
      <router-link to="/Submissions">Submissions</router-link>
    </div>
    <transition name="slide-fade">
      <router-view/>
    </transition>
  </div>
</template>

<style lang="scss">
  @import url('https://fonts.googleapis.com/css2?family=Indie+Flower&display=swap');
  * {
    font-family: 'Indie Flower', cursive;
  }
  html {
    background-image: url("../src/assets/marble-background.jpg");
    background-position: center;
    background-repeat: repeat;
    background-size: cover;
  }
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-image: url("../src/assets/marble-background.jpg");
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  /*background: linear-gradient(to top, #9e6a76 0%, #9a1630 100%);*/
}
.slide-fade-enter-active {
  transition: all 1s ease-in;
}

.slide-fade-enter{
  opacity: 0;
  overflow: hidden;
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: rgba(10, 52, 208, 0.68);
    }
  }
}
</style>
