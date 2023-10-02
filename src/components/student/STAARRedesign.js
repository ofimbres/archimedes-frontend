import React, { useEffect, useState, useRef } from 'react';
import OpenQuestion from './questions/OpenQuestion'

const mock_response = {
    'questions': [
        { 'type': 'open-question', 'questionText': 'Why a potro?' },
        { 'type': 'open-question', 'questionText': 'Why a potro 2?' }
    ]
}

const STAARRedesign = () => {
    return (
        <div>
            <h1>STAAR Redesign</h1>
            { mock_response.questions.map(item => {

                if (item['type'] === 'open-question') {
                    return <OpenQuestion questionType={item['questionText']}></OpenQuestion>
                }
            })}
        </div>
    );
}

export default STAARRedesign;