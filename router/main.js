import { search } from '../api/search'

module.exports = function (app) {
    app.get('/', function (req, res) {
        app.locals.food = [
            '디저트',
            '한식',
            '분식',
            '일식',
            '치킨',
            '피자',
            '아시안',
            '양식',
            '중국집',
            '족발',
            '보쌈',
            '야식',
        ]
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
