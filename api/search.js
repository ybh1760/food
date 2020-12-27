import diningCrawler from '../crawler/dining'
import mangoCrawler from '../crawler/mango'

export const search = async (searchTxt) => {
    const manSearchData = await mangoCrawler.getSearchData(searchTxt)
    const manRestData = await mangoCrawler.getRestaurantData(manSearchData)
    const dinSearchData = await diningCrawler.getSearchData(searchTxt)
    const dinResData = await diningCrawler.getRestaurantData(dinSearchData)

    const total = manRestData.concat(dinResData)

    return total
}
