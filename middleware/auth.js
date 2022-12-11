export default function ({store, redirect}) {
    if (!store.getters['token/getToken']) {
        redirect('/log-in?message=login')
    }
}
