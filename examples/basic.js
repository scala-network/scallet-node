const Scallet = require('../index')

/* Initialize scallet wrapper */
const api = new Scallet({
    key: process.env.API_KEY,
    pass: process.env.API_PASS,
    logging: true
})

async function main() {
    /* Test ScalaPrice */
    try {
        const price = await api.scalaPrice()
        console.log("[Promised] ScalaPrice", price)
    } catch (e) {
        console.log(e)
    }

    api.scalaPrice((err, data) => {
        if(err) return console.log("Error", err)

        console.log("[Callback] ScalaPrice", data)
    })

    /* Test User */
    try {
        const user = await api.getUser()
        console.log("[Promised] getUser", user)
    } catch (e) {
        console.log(e)
    }

    api.getUser((err, data) => {
        if(err) return console.log("Error", err)

        console.log("[Callback] ScalaPrice", data)
    })
}

main()