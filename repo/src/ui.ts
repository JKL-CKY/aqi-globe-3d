import { eventBus } from './eventBus.ts';

interface CityData {
  name: string;
  country?: string;
  lat: number;
  lng: number;
  aqi: number;
  pm25: number;
  windDirection: string;
  windSpeed: number;
}

function getAqiColors(aqi: number): { bg: string; text: string } {
  if (aqi <= 50) return { bg: '#00ff88', text: '#003322' };
  if (aqi <= 100) return { bg: '#ffdd00', text: '#332200' };
  if (aqi <= 150) return { bg: '#ff8800', text: '#331100' };
  return { bg: '#ff2200', text: '#ffffff' };
}

export function initUI(): void {
  const panel = document.querySelector<HTMLElement>('#info-panel')!;
  const panelCountry = document.querySelector<HTMLElement>('#panel-country')!;
  const panelAqi = document.querySelector<HTMLElement>('#panel-aqi')!;
  const panelPm25 = document.querySelector<HTMLElement>('#panel-pm25')!;
  const panelWindDir = document.querySelector<HTMLElement>('#panel-wind-dir')!;
  const panelWindSpeed = document.querySelector<HTMLElement>('#panel-wind-speed')!;

  let currentCity: CityData | null = null;
  let currentCities: CityData[] = [];

  function updatePanel(city: CityData): void {
    panelCountry.textContent = city.country
      ? `${city.name}, ${city.country}`
      : city.name;

    const { bg, text } = getAqiColors(city.aqi);
    panelAqi.innerHTML = `<span class="aqi-badge" style="background:${bg}; color:${text}">${city.aqi}</span>`;

    panelPm25.textContent = `${city.pm25} μg/m³`;
    panelWindDir.textContent = city.windDirection;
    panelWindSpeed.textContent = `${city.windSpeed.toFixed(1)} m/s`;

    panel.classList.add('visible');
  }

  eventBus.on('COUNTRY_SELECTED', (payload: CityData) => {
    currentCity = payload;
    updatePanel(payload);
  });

  eventBus.on('DATA_UPDATE', (cities: CityData[]) => {
    currentCities = cities;
    if (currentCity) {
      const updated = cities.find((c) => c.name === currentCity!.name);
      if (updated) {
        currentCity = updated;
        updatePanel(updated);
      }
    }
  });
}
