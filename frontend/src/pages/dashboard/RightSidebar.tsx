import React from "react";

const RightSidebar = () => {
  return (
    <aside className="order-3 lg:col-span-3 lg:pl-6">
      <div className="sticky top-6">
        <h2 className="text-xl font-semibold mb-5">Recent Activity</h2>

        <div className="py-4 border-b border-gray-800">
          <h3 className="font-medium">No Recent Events</h3>
          <p className="mt-2 text-sm text-gray-500">
            Activity from repositories you own or follow will appear here.
          </p>
        </div>

        <div className="py-4 border-b border-gray-800">
          <h3 className="font-medium">Issues</h3>
          <p className="mt-2 text-sm text-gray-500">
            Open and assigned issues will appear here.
          </p>
        </div>

        <div className="py-4">
          <h3 className="font-medium">Pull Requests</h3>
          <p className="mt-2 text-sm text-gray-500">
            Recent pull requests will be displayed here.
          </p>
        </div>
      </div>
    </aside>
  );
};

export default RightSidebar;
