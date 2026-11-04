import React from "react";
import "remixicon/fonts/remixicon.css";

const LeftContent = () => {
  return (
    <div className="h-full flex flex-col justify-between w-1/3 ">
      <div className="p-6 ">
        <h3 className="mb-7 text-6xl font-bold">
          Prospective
          <br />
          <span className="text-slate-900">Customer</span>
          <br />
          segmentation
        </h3>
        <p className="text-xl font-medium text-gray-600 ">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates,
          repellat excepturi reprehenderit repudiandae blanditiis necessitatibus
          obcaecati doloremque ratione magnam provident.
        </p>
      </div>
      <div className="text-9xl p-1 ">
        <i className="ri-arrow-right-up-line cursor-pointer"></i>
      </div>
    </div>
  );
};

export default LeftContent;
