const Client = require('node-rest-client').Client
const chalk = require('chalk')

/**
 * Scallet API URL
 */
const API_URL = 'https://api.scallet.io'

class Scallet {
    /**
     * Scallet API wrapper
     * @param {{key: string, pass: string}} data credentials
     */
    constructor(data) {
        if (!data.key)
            throw new Error("Invalid key")

        if (!data.pass)
            throw new Error("Invalid key")

        this.key = data.key
        this.pass = data.pass

        /* Enabled debugging logs */
        this.logging = data.logging || false

        this.request = new Client()

        this.headers = {
            "Content-Type": "application/json",
            "Authorization": `Basic ${this._buildBasic()}`
        }
    }

    /**
     * Get basic token for authentification
     * @returns base64 encoded Basic Token
     */
    _buildBasic() {
        return Buffer.from(`${this.key}:${this.pass}`).toString('base64')
    }

    /**
     * Internal get request wrapper
     * @param {*} data request data
     * @param {*} cb callback
     */
    _getRequest(data, cb) {
        if (this.logging)
            console.log(`${chalk.grey(new Date().toLocaleString())} ${chalk.green('[GET]')} ${data.url}`)

        this.request.get(`${API_URL}${data.url}`, {
            headers: this.headers
        }, (data, response) => {
            this._validateResponse(data, response, cb)
        })
    }

    /**
    * Internal get request wrapper
    * @param {*} data request data
    * @param {*} cb callback
    */
    _postRequest(data, cb) {
        if (this.logging)
            console.log(`${chalk.grey(new Date().toLocaleString())} ${chalk.green('[POST]')} ${data.url}`)

        this.request.post(`${API_URL}${data.url}`, {
            headers: this.headers,
            data: data.data
        }, (data, response) => {
            this._validateResponse(data, response, cb)
        })
    }

    /**
     * Internal response validation
     * @param {*} data formatted response data
     * @param {*} response raw response
     * @param {APICallback} cb callback
     * @returns 
     */
    _validateResponse(data, response, cb) {
        try {
            if (this.logging)
                console.log(`${chalk.grey(new Date().toLocaleString())} ${chalk.green('[VALIDATE]')}`, data)

            if (response.statusCode != 200)
                throw new Error(`StatusCode ${response.statusCode}`)

            if (data.error)
                throw new Error(`${data.data ? data.data + '- ' : ''}${data.message}`)

            cb(null, data.data)
        } catch (e) {
            cb(e)
        }
    }

    /* ---------- Helper ---------- */

    /**
     * Helper function for callback and promise support
     * @param {(error: Error | null, data: any) => any} callback callback function
     * @returns potential promise
     */
    _asyncCallbackGETHelper(url, callback) {
        if (typeof callback === "function")
            return this._getRequest({ url }, callback)

        return new Promise((resolve, reject) => {
            this._getRequest({ url }, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    }

    /**
    * Helper function for callback and promise support
    * @param {(error: Error | null, data: any) => any} callback callback function
    * @returns potential promise
    */
    _asyncCallbackPOSTHelper(url, data, callback) {
        if (typeof callback === "function")
            return this._postRequest({ url, data }, callback)

        return new Promise((resolve, reject) => {
            this._postRequest({ url, data }, (err, data) => {
                if (err) reject(err)
                else resolve(data)
            })
        })
    }

    /* ---------- Actual API Endpoints ---------- */

    /**
     * Get current scala price in usd
     * @param {(error: Error | null, data: any) => any} callback callback function
     * @returns potential promise
     */
    scalaPrice(callback) {
        return this._asyncCallbackGETHelper('/scalaPrice', callback)
    }

    /**
     * Get user
     * @param {(error: Error | null, data: any) => any} callback callback function
     * @returns potential promise
     */
    getUser(callback) {
        return this._asyncCallbackGETHelper('/user', callback)
    }

    /**
     * Update shortlink settings
     * @param {(error: Error | null, data: any) => any} callback callback function
     * @returns potential promise
     */
    postLink(data, callback) {
        return this._asyncCallbackPOSTHelper('/link', data, callback)
    }
}

module.exports = Scallet