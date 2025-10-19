import React from "react";

export default function Users({users}) {

  return (<>
    {Object.values(users).map((user, index) => {
      return (
      <div className="flex gap-2" key={index}>
        <div>{index}</div>
        <div>{user.firstName}</div>
        <div>{user.lastName}</div>
      </div>
      );
    })}
  </>);
}
