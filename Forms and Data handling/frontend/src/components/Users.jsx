import React from "react";
import axios from "axios";

export default function Users({users}) {
  console.log(users);

  return (<>
    {Object.values(users).map((user, index) => {
      return (
      <div className="flex gap-2">
        <div>{index}</div>
        <div>{user.firstName}</div>
        <div>{user.lastName}</div>
      </div>
      );
    })}
  </>);
}
