const axios = require('axios')
const cheerio = require('cheerio')

const BASE_URL = 'https://www.mangoplate.com'

const getSearchHtml = async (searchTxt) => {
    try {
        const txt = encodeURI(searchTxt)
        const res = await axios.get(`${BASE_URL}/search/${txt}`)
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
                        const info = $('table.info')
                            .children('tbody')
                            .find('tr')

                        info.each((i, el) => {
                            const th = $(el).find('th').text().trim()
                            const td = $(el).find('td').text().trim()

                            if (th.includes('주소')) {
                                if (td.indexOf('지번')) {
                                    const index = td.indexOf('지번')
                                    value.addr = td.slice(0, index)
                                }
                            }
                            if (th.includes('전화번호')) {
                                value.tel = td
                            }
                            if (th.includes('음식 종류')) {
                                value.cate = td
                            }
                        })
                        const point = $('.rate-point').text().trim()
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

        const restaurantList = $('ul.list-restaurants').children('li')

        restaurantList.each(async function (i, elem) {
            const restaurant = $(elem).children('div')

            restaurant.each(async (i, el) => {
                const titleElem = $(el).find('div.info h2.title')
                //title이 없는경우
                if (titleElem.html() === null) return

                const viewElem = $(el).find('span.view_count')
                const urlElem = $(el).find('div.info a')
                const imgElem = $(el).find('img')
                let title = titleElem.text().replace('\n', '').trim()

                //부제목이 있는 경우
                if (titleElem.html().includes('span')) {
                    title = title.replaceAll(' ', '')
                }

                resList[idx++] = {
                    title,
                    view: viewElem.text().trim(),
                    url: 'https://www.mangoplate.com' + urlElem.attr('href'),
                    imgUrl: imgElem.attr('data-original'),
                    origin: 'mango',
                }
            })
        })
        return resList
    })
}

const mangoCrawler = {
    getRestaurantData,
    getSearchData,
}

export default mangoCrawler
