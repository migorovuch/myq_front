export default function adminMiddleware({ next, store }) {
    if (store.getters['account/isAdmin']) {
        return next();
    }

    return next({
        name: 'home'
    })
}
