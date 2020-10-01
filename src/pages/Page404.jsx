import React, { Component } from 'react';
import { useLocation } from "react-router-dom";

export default function NoMatch() {
    const location = useLocation();
    return (
        <div className="starter-template">
            <h3>
                No match for <code>{location.pathname}</code>
            </h3>
        </div>
    );
}