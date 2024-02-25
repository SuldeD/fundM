import React from "react";
import Application from "../../app/pages/home/application";
import Detail from "../../app/pages/home/detail";
import HowToWork from "../../app/pages/home/howToWork";
import SubAbout from "../../app/pages/home/subAbout";

export const Home = () => {
  return (
    <div>
      <SubAbout />
      <Detail />
      <div className="bg-black bg-[url('/images/fundNow-bg.png')] bg-cover bg-top bg-no-repeat py-32" />
      <HowToWork />
      <Application />
    </div>
  );
};

export default Home;
