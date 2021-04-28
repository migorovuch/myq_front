<template>
    <div>
        <header>
            <slot name="header">
                <Header />
            </slot>
        </header>
        <main>
          <b-container>
            <router-view></router-view>
          </b-container>
        </main>
        <footer>
            <slot name="footer"></slot>
        </footer>
    </div>
</template>

<script>
    import Header from "./Header";
    export default {
        name: "BaseLayout",
        components: {
            Header
        },
    }
</script>

<style scoped>
</style>
