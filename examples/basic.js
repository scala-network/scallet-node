const Scallet = require('../index')

/* Initialize scallet wrapper */
const api = new Scallet({
    key: process.env.API_KEY,
    pass: process.env.API_PASS,
    logging: false
})

async function main() {
    try {
        /* Test ScalaPrice */
        const price = await api.scalaPrice()
        console.log("[Promised] ScalaPrice:", price)

        /*  api.scalaPrice((err, data) => {
            if (err) return console.log("Error", err)
            console.log("[Callback] ScalaPrice", data)
         }) */

        /* Test User */
        const user = await api.getUser()
        console.log("[Promised] getUser:", user.user.name)

        /*  api.getUser((err, data) => {
            if (err) return console.log("Error", err)
            console.log("[Callback] ScalaPrice", data.user.name)
        }) */

        /* Post Shortlink */
        const link = await api.postLink({
            enabled: true,
            url: 'snow'
        })
        console.log("[Promised] postLink:", link)
    } catch (e) {
        console.log(e)
    }
}

main()