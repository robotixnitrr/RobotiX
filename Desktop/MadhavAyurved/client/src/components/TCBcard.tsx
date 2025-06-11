// import React from "react";

export const TCBcard = (data: any) => {
  return (
    <div  className="TCBcard group flex flex-col justify-center items-center max-w-[350px] min-w-[300px] border p-5 rounded-3xl bg-white hover:bg-[#113876] hover:text-white hover:-translate-y-7 transition-all duration-200">
      <h2 className="text-xl font-semibold py-3 text-[#113876] tracking-wider group-hover:text-white">
        {data.title}
      </h2>
      <p className="text-center tracking-wide">{data.content}</p>
      {/* <div className="AboutBtn btn hover:text-white btn-outline btn-accent mt-7 rounded-full px-10">
      </div> */}
      <button className="px-8 py-2 rounded-md bg-teal-500 text-white font-bold transition duration-200 hover:bg-white hover:text-black border-2 border-transparent hover:border-teal-500 mt-5">
        {data.btnText || "Read more"}{" "}
      </button>
    </div>
  );
};
