// gör dynamisk för att kunna anv query params?
const postData = async (route, body) => {
    await fetch(
        route,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        }
    )
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) => {
            console.log('error orrured in postData(): ', err.message);
        });
}

export default postData;