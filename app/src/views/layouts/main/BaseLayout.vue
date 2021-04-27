<template>
    <div>
        <header>
            <slot name="header">
                <Header />
            </slot>
        </header>
        <main>
            <router-view></router-view>
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
