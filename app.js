const fastify = require('fastify')
const { exec } = require('child_process')
const path = require('path')

const app = fastify()

app.register(require('fastify-static'), {
	root: path.join(__dirname, 'players'),
	prefix: '/players/'
})

app.get('/', (req, rep) => {
	function makeNickPic(username) {
		let filename = `${username}-nickname.png`
		exec(`convert images/nickname.png -pointsize 35 -draw \"text 150, 180 '${username} \\\'s'\" players/${filename}`, (error, stdout, stderr) => {
			if (error) {
				console.error(error)
				return;
			}
			if (stderr) {
				console.error(stderr)
				return;
			}
		})
		return filename
	}

	function makeStatPic(username) {
		let filename = `${username}-status.png`
		exec(`convert images/status.png -pointsize 35 -draw \"text 150, 180 '${username} \\\'s'\" players/${filename}`, (error, stdout, stderr) => {
			if (error) {
				console.error(error)
				return;
			}
			if (stderr) {
				console.error(stderr)
				return;
			}
		})
		return filename
	}

	if (req.query.type == 'nickname') {
		let nick_filename = makeNickPic(req.query.username)
		rep.send({nick_filename})
	} else if (req.query.type == 'status') {
		let stat_filename = makeStatPic(req.query.username)
		rep.send({stat_filename})
	} else if (req.query.type == 'both') {
		let nick_filename = makeNickPic(req.query.username);
		let stat_filename = makeStatPic(req.query.username)
		rep.send({nick_filename, stat_filename})
	}
})

app.listen(3000, (err, address) => {
	if (err) {
		app.log.error(err)
		process.exit(1)
	}
	app.log.info(`server listening on ${address}`)
})