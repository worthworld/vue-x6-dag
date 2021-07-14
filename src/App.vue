<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="scss">
html,body{
  width: 100%;
  height: 100%;
}
#app{
  width: 100%;
  height: 100%;
}
body,
div,
h1,
h2,
h3,
h4,
h5,
h6,
hr,
p,
blockquote,
dl,
dt,
dd,
ul,
ol,
li,
pre,
form,
fieldset,
legend,
button,
input,
textarea,
th,
td {
  margin: 0;
  padding: 0;
  vertical-align: baseline;
  box-sizing: border-box;
}
ul,
ol {
  list-style: none;
}

a {
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
</style>
