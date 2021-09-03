<template>
    <div>
        <header>
            <slot name="header">
                <Header />
            </slot>
        </header>
        <main id="main">
            <router-view></router-view>
        </main>
        <footer>
            <slot name="footer">
              <Footer />
            </slot>
        </footer>
    </div>
</template>

<script>
    import Header from "./Header";
    import Footer from "./Footer";
    export default {
        name: "BaseLayout",
        components: {
          Footer,
            Header
        },
    }
</script>

<style scoped>
</style>
