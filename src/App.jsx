
import { useEffect, useState } from "react";
import "./App.css";

const BASE_URL = "https://location-selector.labs.crio.do";

function App() {
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch(`${BASE_URL}/countries`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error("Error fetching countries: ", error);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    if (!selectedCountry) {
      setStates([]);
      return;
    }

    const fetchStates = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/country=${encodeURIComponent(selectedCountry)}/states`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setStates(data);
      } catch (error) {
        console.error("Error fetching states: ", error);
      }
    };

    fetchStates();
  }, [selectedCountry]);

  useEffect(() => {
    if (!selectedCountry || !selectedState) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/country=${encodeURIComponent(selectedCountry)}/state=${encodeURIComponent(selectedState)}/cities`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setCities(data);
      } catch (error) {
        console.error("Error fetching cities: ", error);
      }
    };

    fetchCities();
  }, [selectedCountry, selectedState]);

  return (
    <main className="container">
      <h1>Location Selector</h1>

      <div className="selectors">
        <select
          aria-label="Select Country"
          value={selectedCountry}
          onChange={(event) => {
            setSelectedCountry(event.target.value);
            setSelectedState("");
            setSelectedCity("");
            setStates([]);
            setCities([]);
          }}
        >
          <option value="" disabled>
            Select Country
          </option>
          {countries.map((country) => {
            const name =
              typeof country === "string"
                ? country
                : country.country_name;

            return (
              <option key={name} value={name}>
                {name}
              </option>
            );
          })}
        </select>

        <select
          aria-label="Select State"
          value={selectedState}
          disabled={!selectedCountry}
          onChange={(event) => {
            setSelectedState(event.target.value);
            setSelectedCity("");
            setCities([]);
          }}
        >
          <option value="" disabled>
            Select State
          </option>
          {states.map((state) => {
            const name =
              typeof state === "string" ? state : state.state_name;

            return (
              <option key={name} value={name}>
                {name}
              </option>
            );
          })}
        </select>

        <select
          aria-label="Select City"
          value={selectedCity}
          disabled={!selectedState}
          onChange={(event) => setSelectedCity(event.target.value)}
        >
          <option value="" disabled>
            Select City
          </option>
          {cities.map((city) => {
            const name =
              typeof city === "string" ? city : city.city_name;

            return (
              <option key={name} value={name}>
                {name}
              </option>
            );
          })}
        </select>
      </div>

      {selectedCity && (
        <p className="result">
          You selected {selectedCity}, {selectedState}, {selectedCountry}
        </p>
      )}
    </main>
  );
}

export default App;
