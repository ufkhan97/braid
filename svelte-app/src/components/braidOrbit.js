// let Ipfs, OrbitDB

class braidOrbit {
    constructor (Ipfs, OrbitDB) {
        this.Ipfs = Ipfs
        this.OrbitDB = OrbitDB
    }

    async create() {
        this.node = await this.Ipfs.create({
            preload: {enabled: false },
            repo: './ipfs',
            EXPERIMENTAL: { pubsub: true},
            config: {
                Bootstrap: [],
                Addresses: { Swarm: [] }
            }
        })

        this._init()
    }

    async _init () {
        const peerInfo = await this.node.id()
        this.orbitdb = await this.OrbitDB.createInstance(this.node)
        this.defaultOptions = { accessController: {
            write: [this.orbitdb.identity.id]
            }
        }
        const docStoreOptions = {
            ...this.defaultOptions,
            indexBy: 'hash',
        }
        this.papers = await this.orbitdb.docstore('papers', docStoreOptions)
        await this.papers.load()

        this.user = await this.orbitdb.kvstore('user', this.defaultOptions)
        await this.user.load()
        await this.user.set('papers', this.papers.id)

        await this.loadFixtureData({
            'username': Math.floor(Math.random() * 1000000),
            'papers': this.papers.id,
            'nodeId': peerInfo.id
        })

        this.onready()
    }
 
    async addNewPaper(hash, author, title, date, doi) {
        const existingPaper = this.getPaperByHash(hash)
        if (existingPaper) {
            await this.updatePaperByHash(hash, author, title, date, doi)
            return
        }

        const dbName = 'counter.' + hash.substr(20,20)
        const counter = await this.orbitdb.counter(dbName, this.defaultOptions)

        const cid = await this.papers.put({ hash, author, title, date, doi,
            counter: counter.id
        })

        return cid
    }

    async getPaperCount (paper) {
        const counter = await this.orbitdb.counter(paper.counter)
        await counter.load()
        return counter.value
    }

    async incrementPaperCounter (paper) {
        const counter = await this.orbitdb.counter(paper.counter)
        await counter.load()
        const cid = await counter.inc()
        return cid
    }


    getAllPapers() {
        const papers = this.papers.get('')
        return papers
    }

    getPaperByHash(hash) {
        const singlePaper = this.papers.get(hash)[0]
        return singlePaper
    }

    getPaperByAuthor(author) {
        return this.papers.query((papers) => papers.author === author)
    }

    getPaperByTitle(title) {
        return this.papers.query((papers) => papers.title === title)
    }

    getPaperByDate(date) {
        return this.papers.query((papers) => papers.date === date)
    }

    getPaperByDoi(doi) {
        return this.papers.query((papers) => papers.doi === doi)
    }

    async updatePaperByHash (hash, author, title, date, doi) {
        const paper = await this.getPaperByHash(hash)
        paper.author = author
        paper.title = title
        paper.date = date
        paper.doi = doi
        const cid = await this.paper.put(paper)
        return cid
    }

    async deletePaperByHash (hash) {
        const cid = await this.paper.del(hash)
        return cid
    }

    async deleteProfileField (key) {
        const cid = await this.user.del(key)
        return cid
    }

    getAllProfileFields () {
        return this.user.all;
    }

    getProfileField (key) {
        return this.user.get(key)
    }

    async updateProfileField (key, value) {
        const cid = await this.user.set(key, value)
        return cid
    }

    async loadFixtureData (fixtureData) {
        const fixtureKeys = Object.keys(fixtureData)
        for (let i in fixtureKeys) {
            let key = fixtureKeys[i]
            if(!this.user.get(key)) await this.user.set(key, fixtureData[key])
        }
    }

}

try {
    // const Ipfs = require('ipfs')
    // const OrbitDB = require('orbit-db')

    module.exports = exports = new braidOrbit(Ipfs, OrbitDB)
} catch (e) {
    window.BO = new braidOrbit(window.Ipfs, window.OrbitDB)
}

