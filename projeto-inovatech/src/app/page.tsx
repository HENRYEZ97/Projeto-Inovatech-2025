import WeatherPanel from "./componentes/Dashboard/WeatherPanel";

export default function HomePage() {
  return (
    <section className=" flex justify-center items-center min-h-[80vh]">
      <WeatherPanel />
    </section>
  );
}