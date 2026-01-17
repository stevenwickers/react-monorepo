import React from "react";

const Customer360: React.FC = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="max-w-2xl rounded-lg border-2 border-unifirst-gold-400 bg-unifirst-gold-50 p-12 text-center shadow-lg">
        <div className="mb-4 text-6xl">🚧</div>
        <h1 className="mb-4 text-3xl font-bold text-unifirst-teal-900">
          Customer360
        </h1>
        <p className="mb-6 text-lg text-unifirst-teal-700">
          This module is currently in the backlog and will be available soon.
        </p>
        <div className="rounded-md bg-white p-4 text-left">
          <h2 className="mb-2 font-semibold text-unifirst-teal-800">
            Planned Features:
          </h2>
          <ul className="list-inside list-disc space-y-1 text-sm text-unifirst-gray">
            <li>Customer profile management</li>
            <li>Order history and analytics</li>
            <li>Account status and preferences</li>
            <li>Communication history</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Customer360;
