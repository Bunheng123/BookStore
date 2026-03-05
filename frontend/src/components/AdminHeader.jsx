import React from "react";

export default function AdminHeader({ title, description, rightContent }) {
  return (
    <div className="flex justify-between items-end">
      <div>
        <h1
          className="text-3xl font-normal mb-2"
          style={{ color: "#1a1209", fontFamily: "Georgia, serif" }}
        >
          {title}
        </h1>
        {description && (
          <p className="text-sm italic" style={{ color: "#8a7560" }}>
            {description}
          </p>
        )}
      </div>
      {rightContent && <div className="text-right">{rightContent}</div>}
    </div>
  );
}
