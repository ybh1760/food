async function routeToDetail(data) {
    console.log(data)
    try {
        await axios.post('/detail', {
            data,
        })
    } catch (err) {
        console.log(err)
    }
}
