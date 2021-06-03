export default function authMiddleware({ next, store }) {
    if (!store.getters['account/isUserLogged']) {
        return next({
            name: 'home'
        })
    }
    return next()
}
