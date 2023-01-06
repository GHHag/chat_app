// gör dynamisk för att kunna anv query params?
const postFormData = async (route, body) => {
    console.log('fetchUtils.js - postFormData() - route: ', route, ' - body: ', body);
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
        .then((res) => { console.log(res); })
        .then((data) => { console.log('data:', data); })
        .catch((err) => {
            console.log('error orrured in postFormData(): ', err.message);
        });
}

export default postFormData;