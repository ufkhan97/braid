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

        this.onready()
    }
 
    async addNewPaper(hash, author, title, date, doi) {
        const existingPaper = this.getPaperByHash(hash)
        if (existingPaper) {
            await this.updatePaperByHash(hash, author, title, date, doi)
            return
        }

        const cid = await this.papers.put({ hash, author, title, date, doi})
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
        const paper = await.this.getPaperByHash(hash)
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

}

try {
    const Ipfs = require('ipfs')
    const OrbitDB = require('orbit-db')

    module.exports = exports = new braidOrbit(Ipfs, OrbitDB)
} catch (e) {
    window.BO = new braidOrbit(window.Ipfs, window.OrbitDB)
}

