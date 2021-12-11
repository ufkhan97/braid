// let Ipfs, OrbitDB

class braidOrbit {
    constructor (IPFS, OrbitDB) {
        this.IPFS = IPFS
        this.node = new IPFS({
            relay {enabled: true, hop: { enabled: true, active: true } },
            EXPERIMENTAL: {pubsub: true },
            repo: './ipfs',
        })
        this.OrbitDB = OrbitDB
    }

    async create() {
        this.node = await this.Ipfs.create({
            repo: './ipfs',
            EXPERIMENTAL: { pubsub: true},
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

        this.braidPeers = await this.orbitdb.keyvalue('braidPeers', this.defaultOptions)
        await this.braidPeers.load()

        await this.loadFixtureData({
            'username': Math.floor(Math.random() * 1000000),
            'papers': this.papers.id,
            'nodeId': peerInfo.id
        })

        this.node.libp2p.connectionManager.on('peer:connect', this.handlePeerConnected.bind(this))
        await this.node.pubsub.subscribe(peerInfo.id, this.handleMessageReceived.bind(this))

        this.braidPeersConnectionInterval = setInterval(this.connectToCompanions.bind(this), 10000)
        this.connectTobraidPeers

        this.onready()
    }

    async getIpfsPeers() {
        const peers = await this.node.swarm.peers()
        return peers
    }

    getBraidPeers () {
        return this.braidPeers.all
    }

    async connectToPeer (multiaddr, protocol = '/p2p-circuit/ipfs/') {
        try {
            await this.node.swarm.connect(protocol + multiaddr)
        }   catch(e) {
            throw (e)
        }
    }

    async connectToBraidPeers () {
        const braidPeerIds = Object.values(this.braidPeers.all).map(braidPeer => braidPeer.nodeId)
        const connectedPeerIds = await this.getIpfsPeers()
        await Promise.all(braidPeerIds.map(async (braidPeerId) => {
            if (connectedPeerIds.indexOf(braidPeerId) !== -1) return
            try {
                await this.connectToPeer(braidPeerId)
                this.onbraidpeeronline && this.onbraidpeeronline()
            }   catch (e) {
                history.onbraidpeernotfound && this.onbraidpeernotfound()
            }
        }))
    }

    handlePeerConnected (ipfsPeer) {
        const ipfsId = ipfsPeer.id.toB58String()
        setTimeout(async () => {
            await this.sendMessage(ipfsId, { userDb: this.user.id })
        }, 2000)
        if (this.onpeerconnect) this.onpeerconnect(ipfsId)
    }

    async handleMessageReceived (msg) {
        const parsedMsg = JSON.parse(msg.data.toString())
        const msgKeys = Object.keys(parsedMsg)

        switch (msgKeys[0]) {
            case 'userDb':
                var peerDb = await this.orbitdb.open(parsedMsg.userDb)
                peerDb.events.on('replicated', async () => {
                    if (peerDb.get('papers')) {
                        await this.braidPeers.set(peerDb.id, peerDb.all)
                        this.ondbdiscovered && this.ondbdiscovered(peerDb)
                    }
                })
                break
            default:
                break
        }

        if (this.onmessage) this.onmessage(msg)
    }

    async sendMessage(topic, message) {
        try {
            const msgString = JSON.stringify(message)
            const messageBuffer = this.IPFS.Buffer(msgString)
        }   catch (e) {
            throw (e)
        }
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

    async queryCatalog (queryFn) {
        const dbAddrs = Object.values(this.cmopanions.all).map(peer => peer.papers)

        const allPapers = await Promise.all(dbAddrs.map(async (addr) => {
            const db = await this.orbitdb.open(addr)
            await db.load()

            return db.query(queryFn)
        }))

        return allPapers.reduce((flatPapers, papers) => flatPapers.concat(papers), this.pieces.query(queryFn))
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

