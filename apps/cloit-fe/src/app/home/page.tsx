"use client";

import { Button } from "@/components/ui/button";
import MenuPresenter from "@/presenter/MenuPresenter";
import SideBar from "@/presenter/SideMenuPresenter";
import { MenuIcon } from "lucide-react";
import { useState } from "react";

const Home = () => {
  const [showSideBar, setShowSideBar] = useState(false);
  return (
    <div className="p-4 bg-white rounded-lg shadow flex ">
      <SideBar />
      <Button
        variant="ghost"
        size="icon"
        className=" flex md:hidden"
        onClick={() => setShowSideBar((prev) => !prev)}
      >
        <MenuIcon className="h-6 w-6" />
      </Button>

      <MenuPresenter />
    </div>
  );
};

export default Home;
