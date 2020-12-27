const axios = require('axios')
const cheerio = require('cheerio')

const BASE_URL = 'https://www.diningcode.com'

const getSearchHtml = async (searchTxt) => {
    try {
        const txt = encodeURI(searchTxt)
        const res = await axios.get(`${BASE_URL}/list.php?query=${txt}`)
        return res
    } catch (error) {
        console.error(error)
    }
}

const getRestaurantHtml = async (url) => {
    try {
        const res = await axios.get(url)
        return res
    } catch (error) {
        console.error(error)
    }
}

const getRestaurantData = async (data) => {
    try {
        const newData = Promise.all(
            data.map((value, i) => {
                const { url } = value
                try {
                    return getRestaurantHtml(url).then((res) => {
                        const $ = cheerio.load(res.data)
                        const primary = $('div.s-list.pic-grade')
                        const basic = $('.s-list.basic-info ul.list')

                        const imgUrl = primary
                            .find('ul')
                            .children('li')
                            .first()
                            .find('img')
                            .attr('src')
                        const title = primary.find('.tit-point p.tit').text()
                        const addr = basic.find('.locat').text()
                        const tel = basic.find('.tel').text()
                        const point = $('#lbl_star_point .point').text().trim()

                        value.imgUrl = imgUrl
                        value.title = title
                        value.addr = addr
                        value.tel = tel
                        value.point = point

                        return value
                    })
                } catch (err) {
                    console.error(err)
                }
                return value
            })
        )
        return newData
    } catch (err) {
        console.error(err)
    }
}

async function getSearchData(searchTxt) {
    return await getSearchHtml(searchTxt).then((html) => {
        let resList = []
        let idx = 0
        if (!html.data) return
        const $ = cheerio.load(html.data)

        const restaurantList = $('#div_list').children('li')

        restaurantList.each(function (i, elem) {
            const link = $(elem).children('a').attr('href')

            if (link) {
                const cate = $(elem).find('.stxt').text().trim()
                resList[idx++] = {
                    url: BASE_URL + link,
                    cate,
                    origin: 'dining',
                }
            }
        })
        return resList
    })
}

const diningCrawler = {
    getRestaurantData,
    getSearchData,
}

export default diningCrawler
