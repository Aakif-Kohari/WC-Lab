/* Mock API
Instead of calling a real server, 
we create a fake async function with setTimeout
to simulate delay + return dummy weather JSON.
*/ 
export function fetchFakeWeather(city) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // fake data for demo
      const fakeData = {
        cod: 200,
        name: city,
        main: { temp: 28 },
        weather: [{ description: "cloudy" }],
        wind: { speed: 3.5 }
      };

      // simulate error if city is "Nowhere"
      if (city.toLowerCase() === "nowhere") {
        reject({ cod: 404, message: "City not found" });
      } else {
        resolve(fakeData);
      }
    }, 1000); // 1 second delay
  });
}