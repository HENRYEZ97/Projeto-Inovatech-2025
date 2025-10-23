import WeatherInfo from "./componentes/WeatherInfo";

export default function HomePage() {
  return (
    <section className=" flex justify-center items-center min-h-[80vh]">
      <WeatherInfo />
    </section>
  );
}