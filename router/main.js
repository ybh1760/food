import { search } from '../api/search'

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('index.ejs')
    })
    app.get('/search', async function (req, res) {
        const {
            query: { searchTxt },
        } = req
        const data = await search(searchTxt)

        res.render('search.ejs', {
            data,
            keyword: searchTxt,
        })
    })
}
